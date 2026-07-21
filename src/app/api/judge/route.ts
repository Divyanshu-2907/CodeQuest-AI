import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { evaluateCodeWithGemini } from '@/lib/gemini';
import { Redis } from '@upstash/redis';
import { differenceInDays, startOfDay } from 'date-fns';
import { resend } from '@/lib/resend';

// Initialize Redis only if keys are present (for safety)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { code, output, missionId } = await req.json();

    if (!code || !missionId) {
      return NextResponse.json({ error: 'Missing code or missionId' }, { status: 400 });
    }

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { chapter: true }
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { userMissions: true, userBadges: { include: { badge: true } } }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are an AI mission judge for CodeQuest AI. Evaluate the player's code against the mission objective: "${mission.briefing}". 
${mission.judgeHint ? `Specific Evaluation Rules & Requirements: ${mission.judgeHint}` : ""}
Score 0-100. Give 2 sentences of feedback in the voice of the mission's NPC fixer (gritty, cyberpunk tone). 
Return ONLY JSON with this schema: { "score": number, "passed": boolean, "feedback": string, "xpAwarded": number }.
Ensure the response is raw JSON.`;

    const userPrompt = `Player's Code:\n${code}\n\nExecution Output:\n${output}\n\nMax XP Reward: ${mission.xpReward}`;

    const result = await evaluateCodeWithGemini({ systemPrompt, userPrompt });

    let levelUp = false;
    let newBadgesToAward: string[] = [];

    if (result.passed) {
      const now = new Date();
      
      // Calculate Streak
      let newStreak = dbUser.streak;
      const daysSinceLastActive = differenceInDays(startOfDay(now), startOfDay(dbUser.lastActive));
      
      if (daysSinceLastActive === 1) {
        newStreak++;
      } else if (daysSinceLastActive >= 2) {
        newStreak = 1;
      } else if (dbUser.streak === 0) {
        newStreak = 1; // First time active
      }
      
      // Fetch or create active UserMission to get startedAt
      const userMission = await prisma.userMission.findUnique({
        where: { userId_missionId: { userId: dbUser.id, missionId: mission.id } }
      });
      const startedAt = userMission?.startedAt || now;
      const durationMins = (now.getTime() - startedAt.getTime()) / 1000 / 60;

      // Upsert UserMission
      await prisma.userMission.upsert({
        where: {
          userId_missionId: { userId: dbUser.id, missionId: mission.id }
        },
        update: {
          status: "COMPLETED",
          completedAt: now,
          attempts: { increment: 1 }
        },
        create: {
          userId: dbUser.id,
          missionId: mission.id,
          status: "COMPLETED",
          completedAt: now,
          attempts: 1,
          startedAt: now
        }
      });

      // XP and Level Calculation
      const xpGained = result.xpAwarded || mission.xpReward;
      const newXp = dbUser.xp + xpGained;
      const oldLevel = dbUser.level;
      const newLevel = Math.min(20, Math.floor(newXp / 500) + 1);

      if (newLevel > oldLevel) {
        levelUp = true;
        if (resend && dbUser.email) {
          try {
            const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://codequest.ai'}/api/og/level-up?level=${newLevel}&username=${encodeURIComponent(dbUser.username || 'Agent')}`;
            await resend.emails.send({
              from: 'CodeQuest AI <prestige@resend.dev>',
              to: dbUser.email,
              subject: `⚡ PRESTIGE LEVEL UP: LEVEL ${newLevel} SECURED`,
              html: `
                <div style="background-color: #0d0d12; color: #ffffff; padding: 40px; font-family: monospace; border: 1px solid #7F77DD; border-radius: 8px; text-align: center;">
                  <h1 style="color: #7F77DD; font-size: 24px; border-bottom: 2px solid #2A2A35; padding-bottom: 15px; margin-bottom: 25px;">LEVEL UP CONFIRMED</h1>
                  <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6;">
                    Congratulations Agent, you have reached <strong>Prestige Level ${newLevel}</strong>!
                  </p>
                  <div style="margin: 30px auto; max-width: 500px; padding: 10px; background-color: #1E1E2A; border-radius: 8px; border: 1px dashed #7F77DD;">
                    <img src="${ogImageUrl}" alt="Level Up Badge" style="width: 100%; height: auto; border-radius: 4px;" />
                  </div>
                  <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px;">
                    Your rank has been broadcast across the grid. Complete more missions to unlock further chapters and secure the top spot on the global leaderboard.
                  </p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://codequest.ai'}/dashboard/city" style="background-color: #7F77DD; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                    RETURN TO TERMINAL
                  </a>
                </div>
              `
            });
            console.log(`Prestige level up email sent to ${dbUser.email} for Level ${newLevel}`);
          } catch (mailErr) {
            console.error('Failed to send level-up email:', mailErr);
          }
        }
      }

      // Update User
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          lastActive: now,
        }
      });

      // Update XP History
      await prisma.xpHistory.create({
        data: {
          userId: dbUser.id,
          amount: xpGained,
          date: now
        }
      });

      // Badge Engine
      const allUserMissions = await prisma.userMission.findMany({ 
        where: { userId: dbUser.id, status: "COMPLETED" }, 
        include: { mission: { include: { chapter: true } } } 
      });
      const completedCount = allUserMissions.length;
      
      const earnedBadgeNames = dbUser.userBadges.map(ub => ub.badge.name);

      if (!earnedBadgeNames.includes("First Blood") && completedCount >= 1) {
        newBadgesToAward.push("First Blood");
      }
      
      const chapter1Missions = allUserMissions.filter(um => um.mission.chapter.number === 1);
      if (!earnedBadgeNames.includes("Data Runner") && chapter1Missions.length >= 4) {
        newBadgesToAward.push("Data Runner");
      }

      if (!earnedBadgeNames.includes("On Fire") && newStreak >= 7) {
        newBadgesToAward.push("On Fire");
      }

      if (!earnedBadgeNames.includes("Speed Demon") && mission.type === 'BOSS' && durationMins <= 20) {
        newBadgesToAward.push("Speed Demon");
      }

      if (!earnedBadgeNames.includes("Perfectionist") && result.score === 100) {
        newBadgesToAward.push("Perfectionist");
      }

      if (!earnedBadgeNames.includes("Neural Architect") && newLevel >= 10) {
        newBadgesToAward.push("Neural Architect");
      }

      if (!earnedBadgeNames.includes("The Overlord") && completedCount >= 20) {
        newBadgesToAward.push("The Overlord");
      }

      if (newBadgesToAward.length > 0) {
        const badges = await prisma.badge.findMany({ where: { name: { in: newBadgesToAward } } });
        for (const badge of badges) {
          await prisma.userBadge.create({
            data: {
              userId: dbUser.id,
              badgeId: badge.id
            }
          });
        }
      }

      // Sync Redis Leaderboard
      if (redis) {
        await redis.zadd("leaderboard", { score: newXp, member: dbUser.id });
      }

    } else {
      // Record attempt even if failed
      await prisma.userMission.upsert({
        where: {
          userId_missionId: { userId: dbUser.id, missionId: mission.id }
        },
        update: {
          attempts: { increment: 1 }
        },
        create: {
          userId: dbUser.id,
          missionId: mission.id,
          status: "ACTIVE",
          attempts: 1,
          startedAt: new Date()
        }
      });
    }

    return NextResponse.json({ ...result, levelUp, badgesEarned: newBadgesToAward });

  } catch (error) {
    console.error('[API_JUDGE_ERROR]', error);
    return NextResponse.json({ error: 'Internal judging error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resend } from '@/lib/resend';

export async function GET(req: Request) {
  try {
    // Authenticate cron caller
    const authHeader = req.headers.get('Authorization');
    if (
      process.env.NODE_ENV === 'production' &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new Response('Unauthorized', { status: 401 });
    }

    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Find users at risk
    const atRiskUsers = await prisma.user.findMany({
      where: {
        streak: {
          gt: 0
        },
        lastActive: {
          lte: twentyHoursAgo,
          gte: fortyEightHoursAgo
        },
        email: {
          not: ''
        }
      }
    });

    console.log(`Found ${atRiskUsers.length} users with streaks at risk.`);

    if (resend) {
      for (const user of atRiskUsers) {
        try {
          await resend.emails.send({
            from: 'CodeQuest AI <reminders@resend.dev>',
            to: user.email,
            subject: `⚠️ HACKER STREAK AT RISK | ${user.username}`,
            html: `
              <div style="background-color: #0d0d12; color: #ffffff; padding: 40px; font-family: monospace; border: 1px solid #e11d48; border-radius: 8px;">
                <h1 style="color: #e11d48; font-size: 24px; border-bottom: 2px solid #2A2A35; padding-bottom: 10px;">STREAK DECAY WARNING</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                  Agent <strong>${user.username}</strong>,
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                  Your connection history shows inactivity for over 20 hours. Your active hacking streak of <strong>${user.streak} days</strong> is in danger of decaying!
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                  Jack back into the terminal today and compile any mission script to keep your streak multiplier active and claim bonus XP rewards.
                </p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://codequest.ai'}/dashboard/city" style="background-color: #e11d48; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                    RESUME UPLINK
                  </a>
                </div>
                <p style="font-size: 12px; color: #71717a; border-top: 1px solid #2A2A35; pt: 15px; margin-top: 30px;">
                  This is an automated network warning. Do not reply.
                </p>
              </div>
            `
          });
          console.log(`Dispatched streak reminder warning to ${user.email}`);
        } catch (emailErr) {
          console.error(`Failed to send email to ${user.email}:`, emailErr);
        }
      }
    }

    return NextResponse.json({ success: true, processed: atRiskUsers.length });
  } catch (error) {
    console.error('[CRON_REMIND_STREAKS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

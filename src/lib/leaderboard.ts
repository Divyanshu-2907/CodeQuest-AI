import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/db';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export interface LeaderboardUser {
  id: string;
  username: string | null;
  name: string | null;
  level: number;
  xp: number;
  streak: number;
}

/**
 * Retrieves the top 100 players from the leaderboard.
 * Fallback to direct DB query if Redis is not configured.
 */
export async function getLeaderboardData(userId?: string | null) {
  if (!redis) {
    // Database fallback
    const top100Users = await prisma.user.findMany({
      orderBy: [
        { xp: 'desc' },
        { level: 'desc' }
      ],
      take: 100,
      select: {
        id: true,
        username: true,
        name: true,
        level: true,
        xp: true,
        streak: true,
      }
    });

    let callerRank = null;
    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (dbUser) {
        const higherXpCount = await prisma.user.count({
          where: {
            OR: [
              { xp: { gt: dbUser.xp } },
              {
                xp: dbUser.xp,
                level: { gt: dbUser.level }
              }
            ]
          }
        });
        callerRank = higherXpCount + 1; // 1-indexed rank
      }
    }

    return {
      leaderboard: top100Users,
      callerRank
    };
  }

  // Get Top 100 from Redis
  const top100Ids = await redis.zrange("leaderboard", 0, 99, { rev: true });
  
  let callerRank = null;
  if (userId) {
    const rank = await redis.zrevrank("leaderboard", userId);
    if (rank !== null) {
      callerRank = rank + 1; // 1-indexed rank
    }
  }

  if (!top100Ids || top100Ids.length === 0) {
    return { leaderboard: [], callerRank };
  }

  // Fetch users details
  const users = await prisma.user.findMany({
    where: {
      id: { in: top100Ids as string[] }
    },
    select: {
      id: true,
      username: true,
      name: true,
      level: true,
      xp: true,
      streak: true,
    }
  });

  // Keep Redis sort order
  const sortedUsers = (top100Ids as string[])
    .map(id => users.find(u => u.id === id))
    .filter((u): u is LeaderboardUser => !!u);

  return {
    leaderboard: sortedUsers,
    callerRank
  };
}

/**
 * Updates player XP score on the Redis leaderboard.
 */
export async function updateLeaderboardScore(userId: string, xp: number) {
  if (redis) {
    await redis.zadd("leaderboard", { score: xp, member: userId });
  }
}

import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/db';
import { format, startOfDay } from 'date-fns';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

/**
 * Gets the number of execution runs remaining for a user today.
 */
export async function getRunsRemaining(userId: string, isPro: boolean): Promise<number> {
  if (isPro) return 9999;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const limit = 3;

  if (redis) {
    const currentRuns = (await redis.get<number>(`runs:${userId}:${todayStr}`)) || 0;
    return Math.max(0, limit - currentRuns);
  }

  // Postgres fallback
  const day = startOfDay(new Date());
  try {
    const entry = await prisma.dailyRunLimit.findUnique({
      where: {
        userId_date: {
          userId,
          date: day.toISOString(),
        },
      },
    });

    const currentRuns = entry?.runCount || 0;
    return Math.max(0, limit - currentRuns);
  } catch (err) {
    console.error("Failed to query daily run limits from Postgres:", err);
    // Safe fallback so execution doesn't block entirely
    return 3;
  }
}

/**
 * Increments the execution run count for a user today.
 */
export async function incrementRunCount(userId: string): Promise<number> {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  if (redis) {
    const currentRuns = await redis.incr(`runs:${userId}:${todayStr}`);
    if (currentRuns === 1) {
      await redis.expire(`runs:${userId}:${todayStr}`, 86400); // 24 hours expiry
    }
    return currentRuns;
  }

  // Postgres fallback
  const day = startOfDay(new Date());
  const entry = await prisma.dailyRunLimit.upsert({
    where: {
      userId_date: {
        userId,
        date: day.toISOString(),
      },
    },
    create: {
      userId,
      date: day.toISOString(),
      runCount: 1,
    },
    update: {
      runCount: {
        increment: 1,
      },
    },
  });

  return entry.runCount;
}

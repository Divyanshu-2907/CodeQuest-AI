import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { subDays, startOfDay } from 'date-fns';

export async function GET(req: Request) {
  try {
    // Basic protection (Vercel Cron sends a Bearer token we can check if CRON_SECRET is set)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twoDaysAgo = startOfDay(subDays(new Date(), 2));

    // Reset streaks for users who haven't been active in the last 48 hours
    const { count } = await prisma.user.updateMany({
      where: {
        lastActive: {
          lt: twoDaysAgo
        },
        streak: {
          gt: 0
        }
      },
      data: {
        streak: 0
      }
    });

    return NextResponse.json({ success: true, resetCount: count });
  } catch (error) {
    console.error('[CRON_STREAKS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getLeaderboardData } from '@/lib/leaderboard';

export const revalidate = 60;

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

    const data = await getLeaderboardData(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API_LEADERBOARD_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

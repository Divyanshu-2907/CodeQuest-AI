import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { getRunsRemaining } from '@/lib/limits';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ runsRemaining: 0 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser) return NextResponse.json({ runsRemaining: 0 });

    const runsRemaining = await getRunsRemaining(dbUser.id, dbUser.isPro);
    return NextResponse.json({ runsRemaining });
  } catch (error) {
    console.error('[RUNS_REMAINING_ERROR]', error);
    return NextResponse.json({ runsRemaining: 3 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { executeCodeInSandbox } from '@/lib/sandbox';
import { getRunsRemaining, incrementRunCount } from '@/lib/limits';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, missionId } = await req.json();

    if (!code || !missionId) {
      return NextResponse.json({ error: 'Code and missionId are required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const runsRemainingBefore = await getRunsRemaining(dbUser.id, dbUser.isPro);

    if (!dbUser.isPro) {
      if (runsRemainingBefore <= 0) {
        return NextResponse.json({ 
          error: 'Daily execution limit reached (3/3). Upgrade to Pro for unlimited sandbox runs.',
          runsRemaining: 0,
          limitExceeded: true
        }, { status: 429 });
      }
    }

    // Execute using Piston sandbox - default to python for CodeQuest AI missions
    const execution = await executeCodeInSandbox({
      language: 'python',
      code
    });

    let runsRemainingAfter = runsRemainingBefore;
    if (!dbUser.isPro) {
      const incremented = await incrementRunCount(dbUser.id);
      runsRemainingAfter = Math.max(0, 3 - incremented);
    }

    return NextResponse.json({
      stdout: execution.stdout || '',
      stderr: execution.stderr || '',
      runsRemaining: runsRemainingAfter
    });
  } catch (error: any) {
    console.error('[API_EXECUTE_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Internal execution error' }, { status: 500 });
  }
}

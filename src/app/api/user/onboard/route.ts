import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { username, track } = await req.json();

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    if (track !== 'BEGINNER' && track !== 'INTERMEDIATE') {
      return NextResponse.json({ error: 'Invalid starter track' }, { status: 400 });
    }

    // Check case-insensitive uniqueness
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: 'insensitive',
        },
        NOT: {
          id: userId
        }
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Update user onboarding state
    const isIntermediate = track === 'INTERMEDIATE';
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username.trim(),
        starterTrack: track,
        onboardingComplete: true,
        xp: isIntermediate ? 500 : 0,
        level: isIntermediate ? 2 : 1,
      }
    });

    // Also get the first mission for Ghost welcome message triggering
    // Ghost is the NPC of Chapter 1. Let's find Chapter 1's first mission.
    const chapter1 = await prisma.chapter.findFirst({
      where: { number: 1 },
      include: { missions: { orderBy: { title: 'asc' }, take: 1 } }
    });
    
    const firstMissionId = chapter1?.missions[0]?.id || "";

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      firstMissionId
    });
  } catch (error) {
    console.error('[ONBOARD_USER_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

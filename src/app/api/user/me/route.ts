import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userMissions: {
          include: {
            mission: true
          }
        },
        userBadges: {
          include: {
            badge: true
          }
        },
        xpHistories: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also fetch all available badges so we can show locked ones
    const allBadges = await prisma.badge.findMany();

    return NextResponse.json({
      user,
      allBadges
    });
  } catch (error) {
    console.error("[USER_ME_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

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

    const { username } = await req.json();

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Check case-insensitive uniqueness
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error('[VALIDATE_USERNAME_ERROR]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

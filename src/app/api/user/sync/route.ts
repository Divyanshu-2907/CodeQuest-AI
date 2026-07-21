import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Gateway decommissioned. Better Auth handles user synchronization directly.' });
}

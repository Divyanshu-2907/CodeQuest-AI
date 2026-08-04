import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const isSimulated = payload.simulated === true;

    if (!isSimulated && secret) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
      }
    }

    const event = payload.event;
    const subscription = payload.payload?.subscription?.entity || payload.subscription;

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription entity found' }, { status: 400 });
    }

    const subscriptionId = subscription.id;

    if (event === 'subscription.activated' || event === 'subscription.charged' || isSimulated) {
      let user = null;
      if (isSimulated && payload.userId) {
        user = await prisma.user.findUnique({ where: { id: payload.userId } });
      } else {
        const userId = subscription.notes?.userId;
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
      }

      if (user) {
        const proBadge = await prisma.badge.findFirst({ where: { name: 'Inner Circle' } });
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPro: true,
            proSince: new Date(),
            razorpaySubscriptionId: subscriptionId
          }
        });

        if (proBadge) {
          await prisma.userBadge.upsert({
            where: {
              userId_badgeId: { userId: user.id, badgeId: proBadge.id }
            },
            create: {
              userId: user.id,
              badgeId: proBadge.id
            },
            update: {}
          });
        }
      }
    } else if (event === 'subscription.cancelled' || event === 'subscription.halted') {
      const userId = subscription.notes?.userId;
      if (userId) {
        await prisma.user.updateMany({
          where: { id: userId },
          data: {
            isPro: false,
            razorpaySubscriptionId: null
          }
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[PAYMENT_WEBHOOK_ERROR]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

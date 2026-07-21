import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Return simulated setup
      return NextResponse.json({
        simulated: true,
        subscriptionId: `sub_sim_${Math.random().toString(36).substring(2, 11)}`,
        key: 'rzp_test_simulatedkey',
        amount: 49900,
        currency: 'INR'
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    let planId = process.env.RAZORPAY_PLAN_ID;
    if (!planId) {
      try {
        const plan = await razorpay.plans.create({
          period: 'monthly',
          interval: 1,
          item: {
            name: 'CodeQuest AI Pro Subscription',
            amount: 49900, // ₹499
            currency: 'INR'
          }
        });
        planId = plan.id;
      } catch (err) {
        console.error("Failed to create plan dynamically", err);
        return NextResponse.json({ error: 'Plan creation failed' }, { status: 500 });
      }
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: userId
      }
    });

    return NextResponse.json({
      simulated: false,
      subscriptionId: subscription.id,
      key: keyId,
      amount: 49900,
      currency: 'INR'
    });

  } catch (error) {
    console.error('[CREATE_SUBSCRIPTION_ERROR]', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}

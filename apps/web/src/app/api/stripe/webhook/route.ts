import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import db from "@pulseguard/db";
import { sendDunningNotice } from "@pulseguard/email";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !signature) {
      console.error(
        "Stripe Webhook Error: Missing STRIPE_WEBHOOK_SECRET or stripe-signature header",
      );
      return NextResponse.json(
        { error: "Webhook Error: Missing webhook secret or signature header" },
        { status: 400 },
      );
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Stripe Webhook Signature Verification Failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan || "NETRUNNER").toUpperCase();

        if (userId) {
          await db.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: "ACTIVE",
            },
            update: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan,
              status: "ACTIVE",
            },
          });

          await db.user.update({
            where: { id: userId },
            data: { tier: plan },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const status = (subscription.status || "").toUpperCase();
        const cancelAtPeriodEnd = !!subscription.cancel_at_period_end;

        const subRecord = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (subRecord) {
          const effectiveStatus = subscription.status === "active" ? "ACTIVE" : status;
          const currentPlan = subscription.status === "canceled" ? "INITIATE" : subRecord.plan;

          await db.subscription.update({
            where: { id: subRecord.id },
            data: {
              status: effectiveStatus,
              plan: currentPlan,
              cancelAtPeriodEnd,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : null,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            },
          });

          await db.user.update({
            where: { id: subRecord.userId },
            data: { tier: currentPlan },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        const subRecord = await db.subscription.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true },
        });

        if (subRecord) {
          await db.subscription.update({
            where: { id: subRecord.id },
            data: { status: "PAST_DUE" },
          });

          const userEmail = subRecord.user?.email || invoice.customer_email;
          const userName = subRecord.user?.name || "PulseGuard Operator";
          const amountDue = invoice.amount_due
            ? `$${(invoice.amount_due / 100).toFixed(2)}`
            : "$19.00";
          const failureReason =
            invoice.last_finalization_error?.message ||
            invoice.payment_intent?.last_payment_error?.message ||
            "Card declined or insufficient funds";

          if (userEmail) {
            await sendDunningNotice(userEmail, {
              userName,
              planName: subRecord.plan,
              amountDue,
              failureReason,
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Stripe webhook event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

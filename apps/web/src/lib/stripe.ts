import Stripe from "stripe";
import db from "@pulseguard/db";
import { PLANS, type PlanTier } from "./billing";

// Initialize Stripe SDK instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_pulseguard_key", {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  appInfo: {
    name: "PulseGuard Cloud Monitoring",
    version: "1.0.0",
  },
});

/**
 * Ensures a Stripe customer exists for a user and returns the Stripe customer ID.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string,
): Promise<string> {
  const existingSub = await db.subscription.findUnique({
    where: { userId },
  });

  if (existingSub?.stripeCustomerId) {
    return existingSub.stripeCustomerId;
  }

  // Create Stripe customer
  let customerId = `cus_mock_${userId}`;
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("mock")) {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  // Upsert subscription record with customer ID
  await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      plan: "INITIATE",
      status: "ACTIVE",
    },
    update: {
      stripeCustomerId: customerId,
    },
  });

  return customerId;
}

/**
 * Creates a Stripe Checkout Session for subscription upgrade or renewal.
 */
export async function createCheckoutSession({
  userId,
  email,
  plan,
  interval,
  returnUrl,
}: {
  userId: string;
  email: string;
  plan: PlanTier;
  interval: "monthly" | "annual";
  returnUrl: string;
}): Promise<{ url: string }> {
  const customerId = await getOrCreateStripeCustomer(userId, email);
  const planDetails = PLANS[plan];

  const priceId =
    interval === "annual" ? planDetails.stripePriceIdAnnual : planDetails.stripePriceIdMonthly;

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("mock")) {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        userId,
        plan,
        interval,
      },
    });

    return { url: session.url || returnUrl };
  }

  // Fallback demo/mock mode response when STRIPE_SECRET_KEY is not configured
  return {
    url: `${returnUrl}?mock_checkout=true&plan=${plan}&interval=${interval}`,
  };
}

/**
 * Creates a Stripe Customer Portal session URL.
 */
export async function createPortalSession({
  userId,
  email,
  returnUrl,
}: {
  userId: string;
  email: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("mock")) {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: portalSession.url };
  }

  // Fallback demo/mock mode portal URL
  return {
    url: `${returnUrl}?mock_portal=true`,
  };
}

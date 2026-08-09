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
 * Creates a Stripe Promotion Code for a Design Partner VIP (100% off for 12 months) or custom discount.
 */
export async function createStripePromotionCode({
  code,
  percentOff = 100,
  durationMonths = 12,
  maxRedemptions = 1,
  metadata = {},
}: {
  code: string;
  percentOff?: number;
  durationMonths?: number;
  maxRedemptions?: number;
  metadata?: Record<string, string>;
}): Promise<{ id: string; code: string; isMock: boolean }> {
  const cleanCode = code.trim().toUpperCase();

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("mock")) {
    console.log(`[Stripe Mock] Created mock promotion code: ${cleanCode} (${percentOff}% off)`);
    return { id: `promo_mock_${cleanCode}`, code: cleanCode, isMock: true };
  }

  const couponId = `VIP_PARTNER_${percentOff}PCT_${durationMonths}M`;

  // 1. Ensure the parent coupon exists in Stripe
  try {
    await stripe.coupons.retrieve(couponId);
  } catch (err: any) {
    if (err.statusCode === 404 || err.code === "resource_missing") {
      try {
        await stripe.coupons.create({
          id: couponId,
          name: `PulseGuard Partner VIP (${percentOff}% Off ${durationMonths} Months)`,
          percent_off: percentOff,
          duration: durationMonths > 1 ? "repeating" : "once",
          duration_in_months: durationMonths > 1 ? durationMonths : undefined,
          metadata: { system: "pulseguard_vip", durationMonths: String(durationMonths) },
        });
      } catch (createErr) {
        console.warn(`[Stripe] Note on coupon creation for ${couponId}:`, createErr);
      }
    } else {
      console.warn(`[Stripe] Error checking coupon ${couponId}:`, err);
    }
  }

  // 2. Create the unique promotion code in Stripe
  try {
    const promo = await stripe.promotionCodes.create({
      coupon: couponId,
      code: cleanCode,
      max_redemptions: maxRedemptions,
      metadata: {
        ...metadata,
        created_via: "pulseguard_design_partners",
      },
    });

    console.log(
      `[Stripe] Successfully created promotion code in Stripe: ${promo.code} (ID: ${promo.id})`,
    );
    return { id: promo.id, code: promo.code, isMock: false };
  } catch (error: any) {
    console.error(`[Stripe] Failed to create promotion code ${cleanCode}:`, error);
    // If it already exists, attempt to return existing
    if (error.code === "resource_already_exists") {
      return { id: `promo_existing_${cleanCode}`, code: cleanCode, isMock: false };
    }
    throw error;
  }
}

/**
 * Creates a post-year renewal discount code (e.g. 50% off for 12 months) via Stripe SDK.
 */
export async function createStripeRenewalDiscountCode({
  applicantEmail,
  partnerId,
  percentOff = 50,
  durationMonths = 12,
}: {
  applicantEmail?: string;
  partnerId?: string;
  percentOff?: number;
  durationMonths?: number;
}): Promise<{ id: string; code: string; percentOff: number; isMock: boolean }> {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `RENEWAL-${percentOff}-${hex}`;

  const result = await createStripePromotionCode({
    code,
    percentOff,
    durationMonths,
    maxRedemptions: 1,
    metadata: {
      applicantEmail: applicantEmail || "",
      partnerId: partnerId || "",
      type: "renewal_loyalty_discount",
    },
  });

  return {
    id: result.id,
    code: result.code,
    percentOff,
    isMock: result.isMock,
  };
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
  promoCode,
}: {
  userId: string;
  email: string;
  plan: PlanTier;
  interval: "monthly" | "annual";
  returnUrl: string;
  promoCode?: string;
}): Promise<{ url: string }> {
  const customerId = await getOrCreateStripeCustomer(userId, email);
  const planDetails = PLANS[plan];

  const priceId =
    interval === "annual" ? planDetails.stripePriceIdAnnual : planDetails.stripePriceIdMonthly;

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("mock")) {
    const cleanPromo = promoCode?.trim().toUpperCase();

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ["card"],
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      customer_update: { name: "auto", address: "auto" },
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
        promoCode: cleanPromo || "",
      },
    };

    // Handle promo codes dynamically:
    // In Stripe API, allow_promotion_codes cannot be true if discounts is provided.
    if (cleanPromo) {
      try {
        const promoList = await stripe.promotionCodes.list({
          code: cleanPromo,
          active: true,
          limit: 1,
        });

        if (promoList.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoList.data[0].id }];
        } else {
          sessionParams.discounts = [{ coupon: cleanPromo }];
        }
      } catch (promoErr) {
        console.warn(
          `[Stripe] Could not resolve promo code ${cleanPromo}, falling back to direct coupon:`,
          promoErr,
        );
        sessionParams.discounts = [{ coupon: cleanPromo }];
      }
    } else {
      // Allow user to type promo code manually on Stripe's hosted checkout page
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { url: session.url || returnUrl };
  }

  // Fallback demo/mock mode response when STRIPE_SECRET_KEY is not configured
  const promoQuery = promoCode ? `&promo_code=${encodeURIComponent(promoCode)}` : "";
  return {
    url: `${returnUrl}?mock_checkout=true&plan=${plan}&interval=${interval}${promoQuery}`,
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

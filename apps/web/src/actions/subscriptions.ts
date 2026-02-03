"use server";

import prisma from "@pulseguard/db";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { sendSubscriptionConfirm } from "@pulseguard/email";

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// Get base URL from environment
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

interface SubscriptionResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Initiate a new subscription (double opt-in first step)
 * Creates unverified subscriber and sends confirmation email
 */
export async function initiateSubscription(
  statusPageId: string,
  email: string,
  monitorIds: string[]
): Promise<SubscriptionResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email address", error: "INVALID_EMAIL" };
    }

    // Check if status page exists
    const statusPage = await prisma.statusPage.findUnique({
      where: { id: statusPageId },
      include: { monitors: true },
    });

    if (!statusPage) {
      return { success: false, message: "Status page not found", error: "PAGE_NOT_FOUND" };
    }

    // Validate monitor IDs belong to this status page
    const validMonitorIds = statusPage.monitors.map((m) => m.monitorId);
    const selectedMonitorIds = monitorIds.filter((id) => validMonitorIds.includes(id));

    if (selectedMonitorIds.length === 0 && monitorIds.length > 0) {
      return { success: false, message: "Invalid monitor selection", error: "INVALID_MONITORS" };
    }

    // Check for existing subscriber
    const existingSubscriber = await prisma.statusPageSubscriber.findUnique({
      where: {
        statusPageId_email: { statusPageId, email },
      },
    });

    if (existingSubscriber?.verified) {
      return {
        success: false,
        message: "This email is already subscribed. Check your inbox for the management link.",
        error: "ALREADY_SUBSCRIBED",
      };
    }

    // Generate verification token
    const verificationToken = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create or update subscriber (upsert)
    const subscriber = await prisma.statusPageSubscriber.upsert({
      where: {
        statusPageId_email: { statusPageId, email },
      },
      create: {
        statusPageId,
        email,
        verified: false,
        monitorSubscriptions: {
          create: selectedMonitorIds.map((monitorId) => ({ monitorId })),
        },
        tokens: {
          create: {
            token: verificationToken,
            type: "VERIFY",
            expiresAt,
          },
        },
      },
      update: {
        // Reset verification status and create new token
        verified: false,
        monitorSubscriptions: {
          deleteMany: {},
          create: selectedMonitorIds.map((monitorId) => ({ monitorId })),
        },
        tokens: {
          create: {
            token: verificationToken,
            type: "VERIFY",
            expiresAt,
          },
        },
      },
    });

    // Send verification email
    const verifyUrl = `${getBaseUrl()}/subscribe/${verificationToken}`;
    
    await sendSubscriptionConfirm(email, {
      pageTitle: statusPage.title,
      verifyUrl,
    });

    return {
      success: true,
      message: "Please check your email to confirm your subscription.",
    };
  } catch (error) {
    console.error("[Subscription] Error initiating subscription:", error);
    return {
      success: false,
      message: "Failed to process subscription. Please try again.",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Verify a subscription using the verification token
 */
export async function verifySubscription(token: string): Promise<SubscriptionResult> {
  try {
    // Find the token
    const subscriptionToken = await prisma.subscriptionToken.findUnique({
      where: { token },
      include: { subscriber: { include: { statusPage: true } } },
    });

    if (!subscriptionToken) {
      return { success: false, message: "Invalid or expired verification link.", error: "INVALID_TOKEN" };
    }

    // Check if token is expired
    if (subscriptionToken.expiresAt < new Date()) {
      return { success: false, message: "Verification link has expired. Please subscribe again.", error: "TOKEN_EXPIRED" };
    }

    // Check if already used
    if (subscriptionToken.usedAt) {
      return { success: false, message: "This link has already been used.", error: "TOKEN_USED" };
    }

    // Verify the subscription
    await prisma.$transaction([
      prisma.statusPageSubscriber.update({
        where: { id: subscriptionToken.subscriberId },
        data: { verified: true },
      }),
      prisma.subscriptionToken.update({
        where: { id: subscriptionToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    const manageToken = subscriptionToken.subscriber.manageToken;
    const manageUrl = `${getBaseUrl()}/subscribe/manage/${manageToken}`;

    return {
      success: true,
      message: `You're now subscribed to ${subscriptionToken.subscriber.statusPage.title}! Save your management link: ${manageUrl}`,
    };
  } catch (error) {
    console.error("[Subscription] Error verifying subscription:", error);
    return {
      success: false,
      message: "Failed to verify subscription. Please try again.",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Get subscriber info by manage token
 */
export async function getSubscriberByManageToken(manageToken: string) {
  try {
    const subscriber = await prisma.statusPageSubscriber.findUnique({
      where: { manageToken },
      include: {
        statusPage: {
          include: {
            monitors: {
              include: { monitor: true },
            },
          },
        },
        monitorSubscriptions: true,
      },
    });

    return subscriber;
  } catch (error) {
    console.error("[Subscription] Error fetching subscriber:", error);
    return null;
  }
}

/**
 * Update subscription preferences
 */
export async function updateSubscriptionPreferences(
  manageToken: string,
  preferences: {
    notifyIncidents?: boolean;
    notifyMaintenance?: boolean;
    monitorIds?: string[];
  }
): Promise<SubscriptionResult> {
  try {
    const subscriber = await prisma.statusPageSubscriber.findUnique({
      where: { manageToken },
      include: { statusPage: { include: { monitors: true } } },
    });

    if (!subscriber) {
      return { success: false, message: "Subscription not found.", error: "NOT_FOUND" };
    }

    // Validate monitor IDs if provided
    const validMonitorIds = subscriber.statusPage.monitors.map((m) => m.monitorId);
    const selectedMonitorIds = preferences.monitorIds?.filter((id) =>
      validMonitorIds.includes(id)
    );

    // Update preferences
    await prisma.statusPageSubscriber.update({
      where: { manageToken },
      data: {
        notifyIncidents: preferences.notifyIncidents ?? subscriber.notifyIncidents,
        notifyMaintenance: preferences.notifyMaintenance ?? subscriber.notifyMaintenance,
        ...(selectedMonitorIds && {
          monitorSubscriptions: {
            deleteMany: {},
            create: selectedMonitorIds.map((monitorId) => ({ monitorId })),
          },
        }),
      },
    });

    revalidatePath(`/subscribe/manage/${manageToken}`);

    return {
      success: true,
      message: "Preferences updated successfully.",
    };
  } catch (error) {
    console.error("[Subscription] Error updating preferences:", error);
    return {
      success: false,
      message: "Failed to update preferences. Please try again.",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Unsubscribe completely
 */
export async function unsubscribe(manageToken: string): Promise<SubscriptionResult> {
  try {
    const subscriber = await prisma.statusPageSubscriber.findUnique({
      where: { manageToken },
      include: { statusPage: true },
    });

    if (!subscriber) {
      return { success: false, message: "Subscription not found.", error: "NOT_FOUND" };
    }

    // Delete the subscriber (cascades to tokens and monitor subscriptions)
    await prisma.statusPageSubscriber.delete({
      where: { manageToken },
    });

    return {
      success: true,
      message: `You have been unsubscribed from ${subscriber.statusPage.title}.`,
    };
  } catch (error) {
    console.error("[Subscription] Error unsubscribing:", error);
    return {
      success: false,
      message: "Failed to unsubscribe. Please try again.",
      error: "INTERNAL_ERROR",
    };
  }
}

/**
 * Get all verified subscribers for a status page (for sending notifications)
 */
export async function getVerifiedSubscribers(
  statusPageId: string,
  monitorId?: string
) {
  try {
    const whereClause: any = {
      statusPageId,
      verified: true,
    };

    // If monitorId is provided, filter by monitor subscription
    if (monitorId) {
      whereClause.monitorSubscriptions = {
        some: { monitorId },
      };
    }

    const subscribers = await prisma.statusPageSubscriber.findMany({
      where: whereClause,
      select: {
        email: true,
        manageToken: true,
        notifyIncidents: true,
        notifyMaintenance: true,
      },
    });

    return subscribers;
  } catch (error) {
    console.error("[Subscription] Error fetching subscribers:", error);
    return [];
  }
}

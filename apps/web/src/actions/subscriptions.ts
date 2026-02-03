"use server";

import prisma from "@pulseguard/db";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { sendSubscriptionConfirm } from "@pulseguard/email";

// Generate a secure random token
/**
 * Generates a random token as a hexadecimal string.
 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// Get base URL from environment
/**
 * Returns the base URL from the environment variable or a default value.
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

interface SubscriptionResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Initiate a new subscription with a double opt-in first step.
 *
 * This function validates the email format, checks for the existence of the status page, and verifies that the selected monitor IDs belong to that status page.
 * It also checks for existing subscribers and generates a verification token if the email is not already subscribed.
 * Finally, it sends a confirmation email to the user with a verification link.
 *
 * @param statusPageId - The ID of the status page to which the subscription is related.
 * @param email - The email address of the subscriber.
 * @param monitorIds - An array of monitor IDs that the subscriber wishes to subscribe to.
 * @returns A promise that resolves to a SubscriptionResult indicating the success or failure of the subscription initiation.
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
 * Retrieves subscriber information using a manage token.
 *
 * This function queries the database for a subscriber associated with the provided manageToken.
 * It includes related status page information, monitors, and monitor subscriptions.
 * If an error occurs during the database operation, it logs the error and returns null.
 *
 * @param manageToken - The token used to identify the subscriber in the database.
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
 * Update subscription preferences for a status page subscriber.
 *
 * This function retrieves a subscriber using the provided manageToken and validates the provided monitor IDs against the subscriber's status page monitors.
 * It updates the subscriber's notification preferences and monitor subscriptions accordingly. If the subscriber is not found, it returns an error message.
 * In case of an error during the process, it logs the error and returns a failure message.
 *
 * @param manageToken - The token used to identify the subscriber.
 * @param preferences - An object containing the subscription preferences to update.
 * @param preferences.notifyIncidents - Optional flag to notify about incidents.
 * @param preferences.notifyMaintenance - Optional flag to notify about maintenance.
 * @param preferences.monitorIds - Optional array of monitor IDs to subscribe to.
 * @returns A promise that resolves to a SubscriptionResult indicating the success or failure of the update.
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
 * Unsubscribe completely from a status page.
 *
 * This function retrieves a subscriber using the provided manageToken. If the subscriber exists, it deletes the subscriber, which also cascades to any associated tokens and monitor subscriptions. If the subscriber is not found, it returns a not found message. In case of an error during the process, it logs the error and returns a failure message.
 *
 * @param manageToken - The unique token associated with the subscriber to be unsubscribed.
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
 * Get all verified subscribers for a status page (for sending notifications).
 *
 * This function retrieves subscribers who are verified for a given status page.
 * If a monitorId is provided, it further filters the subscribers to include only
 * those who are subscribed to the specified monitor. The function uses Prisma to
 * query the database and returns the relevant subscriber details.
 *
 * @param statusPageId - The ID of the status page for which to fetch subscribers.
 * @param monitorId - An optional ID of the monitor to filter subscribers by.
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

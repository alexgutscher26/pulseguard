"use server";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { sendMonitorAlert } from "@pulseguard/email";

const channelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["EMAIL", "DISCORD", "SLACK", "WEBHOOK", "TELEGRAM", "SMS"]),
  config: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON configuration",
      });
      return z.NEVER;
    }
  }),
});

export async function createNotificationChannel(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    type: formData.get("type") as any,
    config: formData.get("config") as string,
  };

  const validation = channelSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const data = validation.data;

  try {
    await prisma.notificationChannel.create({
      data: {
        name: data.name,
        type: data.type,
        config: data.config,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/alerts");
    return { success: true };
  } catch (error) {
    console.error("Failed to create channel", error);
    return { success: false, error: "Failed to create notification channel" };
  }
}

export async function deleteNotificationChannel(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.notificationChannel.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/alerts");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete channel", error);
    return { success: false, error: "Failed to delete notification channel" };
  }
}

/**
 * Sends a test notification to a specified notification channel.
 *
 * The function retrieves the current user session and checks for authorization. It then attempts to find the notification channel by its ID and validates its type and configuration. If all checks pass, it sends a test alert via email. In case of any errors during the process, appropriate error messages are returned.
 *
 * @param id - The ID of the notification channel to send the test notification to.
 * @returns An object indicating the success status and any error messages if applicable.
 */
export async function sendTestNotification(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const channel = await prisma.notificationChannel.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!channel) {
      return { success: false, error: "Channel not found" };
    }

    if (channel.type !== "EMAIL") {
      return { success: false, error: "Only Email tests are currently supported" };
    }

    const config = channel.config as { email?: string };
    if (!config?.email) {
      return { success: false, error: "Invalid email configuration" };
    }

    const result = await sendMonitorAlert(
      config.email,
      {
        monitorId: "test-monitor-id",
        monitorName: "Test Monitor",
        url: "https://example.com",
        status: "DOWN",
        previousStatus: "UP",
        timestamp: new Date().toISOString(),
        reason: "Test Notification",
        downtimeDuration: "0m 0s",
      }
    );

    if ("error" in result) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send test notification", error);
    return { success: false, error: "Failed to send test notification" };
  }
}

export async function getNotificationChannels() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const channels = await prisma.notificationChannel.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return channels;
  } catch (error) {
    console.error("Failed to fetch channels", error);
    return [];
  }
}

/**
 * Retrieve the alert history for a user with pagination.
 *
 * This function first checks for a valid user session. If a session exists, it calculates the total count of monitor events for the user and retrieves a paginated list of events. The results include event details along with pagination information. In case of an error during the fetch operation, it logs the error and returns an empty result set.
 *
 * @param page - The current page number for pagination, defaults to 1.
 * @param pageSize - The number of events to retrieve per page, defaults to 10.
 * @returns An object containing the events, total count of events, and total number of pages.
 */
export async function getAlertHistory(page: number = 1, pageSize: number = 10) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { events: [], totalCount: 0, totalPages: 0 };

  try {
    const skip = (page - 1) * pageSize;
    
    // Get total count for pagination
    const totalCount = await prisma.monitorEvent.count({
      where: {
        monitor: {
          userId: session.user.id,
        },
      },
    });

    const events = await prisma.monitorEvent.findMany({
      where: {
        monitor: {
          userId: session.user.id,
        },
      },
      take: pageSize,
      skip: skip,
      orderBy: {
        timestamp: "desc",
      },
      include: {
        monitor: {
          select: {
            name: true,
            url: true,
          },
        },
      },
    });
    
    return {
      events,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error("Failed to fetch alert history", error);
    return { events: [], totalCount: 0, totalPages: 0 };
  }
}

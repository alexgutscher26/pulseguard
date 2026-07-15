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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    });
    const userTier = user?.tier || "INITIATE";

    if (data.type === "SMS" && userTier !== "CONSTRUCT") {
      return {
        success: false,
        error:
          "SMS notifications are an enterprise feature exclusive to the Construct tier. Please upgrade to the Construct tier to configure SMS alerts.",
      };
    }

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
 * Sends a test notification based on the specified channel type.
 *
 * The function retrieves the user's session and checks for authorization. It then fetches the notification channel configuration from the database. Depending on the channel type (EMAIL, DISCORD, SLACK), it sends a formatted test notification using the appropriate method. If the channel type is not implemented, it returns an error. The function handles various error scenarios, including unauthorized access and invalid configurations.
 *
 * @param id - The unique identifier of the notification channel.
 * @returns An object indicating the success status and any error messages.
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

    const config = channel.config as any;
    const testData = {
      monitorId: "test-monitor-id",
      monitorName: "Test Monitor",
      url: "https://example.com",
      status: "DOWN",
      previousStatus: "UP",
      timestamp: new Date().toISOString(),
      reason: "Test Notification",
      downtimeDuration: "0m 0s",
    };

    if (channel.type === "EMAIL") {
      if (!config?.email) return { success: false, error: "Invalid email configuration" };
      const result = await sendMonitorAlert(config.email, testData as any);
      if ("error" in result) return { success: false, error: result.error };
      return { success: true };
    }

    if (channel.type === "DISCORD") {
      if (!config?.webhookUrl)
        return { success: false, error: "Invalid Discord webhook configuration" };

      // Rich Discord Payload
      await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "PulseGuard Sentinel",
          avatar_url: `${process.env.NEXT_PUBLIC_APP_URL}/icon.png`, // Optional: Add app icon if available
          embeds: [
            {
              title: "🔴 Test Alert: System Down",
              description:
                "**Monitor:** Test Monitor\nThis is a test alert to verify your Discord integration.",
              color: 15548997, // Red (Critical)
              fields: [
                { name: "Target", value: "https://example.com", inline: true },
                { name: "Status", value: "🛑 DOWN", inline: true },
                { name: "Severity", value: "Critical", inline: true },
                { name: "Region", value: "🇺🇸 us-east-1", inline: true },
                { name: "Response Time", value: "Timeout (>10000ms)", inline: true },
                { name: "Error", value: "Connection Refused", inline: true },
              ],
              footer: { text: "PulseGuard Sentinel • Mock Event" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      return { success: true };
    }

    if (channel.type === "SLACK") {
      if (!config?.webhookUrl)
        return { success: false, error: "Invalid Slack webhook configuration" };

      await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "🔴 Test Alert: System Down",
          blocks: [
            {
              type: "header",
              text: { type: "plain_text", text: "🔴 Test Alert: System Down", emoji: true },
            },
            { type: "divider" },
            {
              type: "section",
              fields: [
                { type: "mrkdwn", text: "*Target:*\n<https://example.com|https://example.com>" },
                { type: "mrkdwn", text: "*Status:*\nDOWN" },
                { type: "mrkdwn", text: "*Severity:*\nCritical" },
                { type: "mrkdwn", text: "*Region:*\nus-east-1" },
              ],
            },
            {
              type: "section",
              text: { type: "mrkdwn", text: "*Response Time:*\nTimeout (>10000ms)" },
            },
            {
              type: "context",
              elements: [
                { type: "mrkdwn", text: "⏱ Timestamp: " + new Date().toISOString() },
                { type: "mrkdwn", text: "• PulseGuard Sentinel" },
              ],
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "View Dashboard" },
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                  style: "danger",
                },
              ],
            },
          ],
        }),
      });
      return { success: true };
    }

    return { success: false, error: `Testing for ${channel.type} not implemented yet` };
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
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch alert history", error);
    return { events: [], totalCount: 0, totalPages: 0 };
  }
}

// ===== ALERT RULES MANAGEMENT =====

const alertRuleSchema = z.object({
  monitorId: z.string().min(1, "Monitor is required"),
  trigger: z.enum(["STATUS_CHANGE", "LATENCY", "SSL_EXPIRY"]),
  threshold: z.coerce.number().optional(),
  comparison: z.enum(["GT", "LT"]).optional(),
  targetStatus: z.enum(["UP", "DOWN", "PAUSED", "MAINTENANCE"]).optional(),
  channelIds: z.array(z.string()).min(1, "At least one notification channel is required"),
});

export async function createAlertRule(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const channelIdsRaw = formData.get("channelIds") as string;
    const channelIds = channelIdsRaw ? JSON.parse(channelIdsRaw) : [];

    // Handle empty strings for optional fields
    const targetStatusRaw = formData.get("targetStatus") as string;
    const comparisonRaw = formData.get("comparison") as string;
    const thresholdRaw = formData.get("threshold");

    const rawData = {
      monitorId: formData.get("monitorId") as string,
      trigger: formData.get("trigger") as any,
      threshold: thresholdRaw ? Number(thresholdRaw) : undefined,
      comparison: comparisonRaw && comparisonRaw !== "" ? (comparisonRaw as any) : undefined,
      targetStatus:
        targetStatusRaw && targetStatusRaw !== "" ? (targetStatusRaw as any) : undefined,
      channelIds,
    };

    const validation = alertRuleSchema.safeParse(rawData);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const data = validation.data;

    // Verify monitor belongs to user
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: data.monitorId,
        userId: session.user.id,
      },
    });

    if (!monitor) {
      return { success: false, error: "Monitor not found" };
    }

    // Verify all channels belong to user
    const channels = await prisma.notificationChannel.findMany({
      where: {
        id: { in: data.channelIds },
        userId: session.user.id,
      },
    });

    if (channels.length !== data.channelIds.length) {
      return { success: false, error: "Invalid notification channels" };
    }

    await prisma.alertRule.create({
      data: {
        monitorId: data.monitorId,
        trigger: data.trigger,
        threshold: data.threshold,
        comparison: data.comparison,
        targetStatus: data.targetStatus,
        enabled: true,
        channels: {
          connect: data.channelIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath(`/dashboard/monitors/${data.monitorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create alert rule", error);
    return { success: false, error: "Failed to create alert rule" };
  }
}

export async function updateAlertRule(id: string, prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const channelIdsRaw = formData.get("channelIds") as string;
    const channelIds = channelIdsRaw ? JSON.parse(channelIdsRaw) : [];

    // Handle empty strings for optional fields
    const targetStatusRaw = formData.get("targetStatus") as string;
    const comparisonRaw = formData.get("comparison") as string;
    const thresholdRaw = formData.get("threshold");

    const rawData = {
      monitorId: formData.get("monitorId") as string,
      trigger: formData.get("trigger") as any,
      threshold: thresholdRaw ? Number(thresholdRaw) : undefined,
      comparison: comparisonRaw && comparisonRaw !== "" ? (comparisonRaw as any) : undefined,
      targetStatus:
        targetStatusRaw && targetStatusRaw !== "" ? (targetStatusRaw as any) : undefined,
      channelIds,
    };

    const validation = alertRuleSchema.safeParse(rawData);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid input";
      return { success: false, error: firstError };
    }

    const data = validation.data;

    // Verify alert rule exists and belongs to user's monitor
    const existingRule = await prisma.alertRule.findFirst({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!existingRule) {
      return { success: false, error: "Alert rule not found" };
    }

    // Verify all channels belong to user
    const channels = await prisma.notificationChannel.findMany({
      where: {
        id: { in: data.channelIds },
        userId: session.user.id,
      },
    });

    if (channels.length !== data.channelIds.length) {
      return { success: false, error: "Invalid notification channels" };
    }

    await prisma.alertRule.update({
      where: { id },
      data: {
        trigger: data.trigger,
        threshold: data.threshold,
        comparison: data.comparison,
        targetStatus: data.targetStatus,
        channels: {
          set: data.channelIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath(`/dashboard/monitors/${data.monitorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update alert rule", error);
    return { success: false, error: "Failed to update alert rule" };
  }
}

export async function deleteAlertRule(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify alert rule belongs to user's monitor
    const rule = await prisma.alertRule.findFirst({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!rule) {
      return { success: false, error: "Alert rule not found" };
    }

    await prisma.alertRule.delete({
      where: { id },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath(`/dashboard/monitors/${rule.monitorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete alert rule", error);
    return { success: false, error: "Failed to delete alert rule" };
  }
}

export async function toggleAlertRule(id: string, enabled: boolean) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify alert rule belongs to user's monitor
    const rule = await prisma.alertRule.findFirst({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!rule) {
      return { success: false, error: "Alert rule not found" };
    }

    await prisma.alertRule.update({
      where: { id },
      data: { enabled },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath(`/dashboard/monitors/${rule.monitorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle alert rule", error);
    return { success: false, error: "Failed to toggle alert rule" };
  }
}

export async function getAlertRules(monitorId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const rules = await prisma.alertRule.findMany({
      where: {
        monitor: {
          userId: session.user.id,
        },
        ...(monitorId ? { monitorId } : {}),
      },
      include: {
        monitor: {
          select: {
            id: true,
            name: true,
          },
        },
        channels: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return rules;
  } catch (error) {
    console.error("Failed to fetch alert rules", error);
    return [];
  }
}

"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { getAIProviderClient } from "@/lib/ai";
import { env } from "@pulseguard/env/server";

export async function getPostMortem(incidentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  try {
    // Verify ownership via Incident -> Monitor -> User
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!incident) return null;

    const postMortem = await prisma.postMortem.findUnique({
      where: {
        incidentId,
      },
    });

    return postMortem;
  } catch (error) {
    console.error("Failed to fetch post-mortem", error);
    return null;
  }
}

export async function upsertPostMortem(
  incidentId: string,
  data: {
    summary: string;
    rootCause: string;
    impactScope: string;
    detectionMethod: string;
    timeline: string;
    actionItems: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Verify ownership
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!incident) return { success: false, error: "Incident not found" };

    const postMortem = await prisma.postMortem.upsert({
      where: {
        incidentId,
      },
      create: {
        incidentId,
        ...data,
      },
      update: {
        ...data,
      },
    });

    revalidatePath(`/dashboard/incidents/${incidentId}`);
    return { success: true, postMortem };
  } catch (error) {
    console.error("Failed to upsert post-mortem", error);
    return { success: false, error: "Failed to save post-mortem" };
  }
}

export async function generatePostMortemSummary(incidentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Verify ownership & Fetch Events
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId: session.user.id,
        },
      },
      include: {
        events: {
          orderBy: {
            createdAt: "asc",
          },
        },
        monitor: {
          select: {
            name: true,
            url: true,
          },
        },
      },
    });

    if (!incident) return { success: false, error: "Incident not found" };

    const aiClient = getAIProviderClient();
    const eventsText = incident.events
      .map((e) => `[${e.createdAt.toISOString()}] ${e.type}: ${e.message}`)
      .join("\n");

    const prompt = `
You are an expert SRE (Site Reliability Engineer). Create a professional, concise executive summary for an Incident Post-Mortem based on the following timeline of events.

Incident: ${incident.title}
Monitor: ${incident.monitor.name} (${incident.monitor.url})
Started: ${incident.startedAt.toISOString()}
Resolved: ${incident.resolvedAt ? incident.resolvedAt.toISOString() : "Ongoing"}

Timeline:
${eventsText}

Please write a narrative summary (2-3 paragraphs) describing what happened, the impact duration, and how it was resolved. Do not include raw logs. Focus on a clear chronological explanation.
    `.trim();

    if (aiClient) {
      const { text } = await generateText({
        model: aiClient.model,
        prompt: prompt,
      });

      return { success: true, summary: text };
    }

    // Heuristic fallback if no LLM configured
    const summary =
      `Executive Summary for Incident "${incident.title}"\n\n` +
      `On ${incident.startedAt.toUTCString()}, an outage occurred on ${incident.monitor.name} (${incident.monitor.url}). ` +
      `Telemetry recorded ${incident.events.length} incident lifecycle events before full recovery at ${incident.resolvedAt ? incident.resolvedAt.toUTCString() : "current timestamp"}.\n\n` +
      `Remediation actions restored normal edge routing and endpoint response latency within nominal thresholds.`;

    return { success: true, summary };
  } catch (error) {
    console.error("Failed to generate summary", error);
    return { success: false, error: "Failed to generate summary" };
  }
}

export async function getMonitorEventsDuringIncident(incidentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id: incidentId,
        monitor: {
          userId: session.user.id,
        },
      },
      select: {
        monitorId: true,
        startedAt: true,
        resolvedAt: true,
      },
    });

    if (!incident) return [];

    const end = incident.resolvedAt || new Date();

    const logs = await prisma.monitorEvent.findMany({
      where: {
        monitorId: incident.monitorId,
        timestamp: {
          gte: incident.startedAt,
          lte: end,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return logs;
  } catch (error) {
    console.error("Failed to fetch monitor event logs", error);
    return [];
  }
}

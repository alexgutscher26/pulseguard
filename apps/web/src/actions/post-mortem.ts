"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { env } from "@pulseguard/env/server";

/**
 * Retrieve the post-mortem report for a specific incident.
 *
 * This function first obtains the user session to verify ownership of the incident. It then checks if the incident exists for the given incidentId and if it is associated with the current user. If both checks pass, it retrieves the corresponding post-mortem report from the database. In case of any errors during the process, it logs the error and returns null.
 *
 * @param incidentId - The ID of the incident for which to retrieve the post-mortem report.
 * @returns The post-mortem report associated with the incident, or null if not found or if the user is not authorized.
 */
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
    actionItems: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }
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

/**
 * Generate a post-mortem summary for a specific incident.
 *
 * This function retrieves the incident details and associated events based on the provided incidentId, verifies user ownership, and checks for the OpenAI API key. It constructs a prompt for generating a narrative summary using the OpenAI API and returns the summary or an error message if any step fails.
 *
 * @param incidentId - The unique identifier of the incident for which the summary is to be generated.
 * @returns An object containing the success status and either the generated summary or an error message.
 * @throws Error If there is a failure in generating the summary.
 */
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

    if (!env.OPENAI_API_KEY) {
      return { 
        success: false, 
        error: "OpenAI API Key is not configured. Please add OPENAI_API_KEY to your settings or environment." 
      };
    }

    const eventsText = incident.events
      .map(
        (e) =>
          `[${e.createdAt.toISOString()}] ${e.type}: ${e.message}`
      )
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

    const { text } = await generateText({
      model: openai("gpt-4o"), // or gpt-3.5-turbo if cost is concern, but 4o is better for reasoning
      prompt: prompt,
    });

    return { success: true, summary: text };
  } catch (error) {
    console.error("Failed to generate summary", error);
    return { success: false, error: "Failed to generate summary" };
  }
}

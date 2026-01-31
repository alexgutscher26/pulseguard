"use server";

import prisma from "@pulseguard/db";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getIncidents() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        monitor: {
          userId: session.user.id,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        monitor: {
          select: {
            name: true,
            url: true,
          },
        },
        _count: {
          select: { events: true },
        },
      },
      take: 50,
    });
    return incidents;
  } catch (error) {
    console.error("Failed to fetch incidents", error);
    return [];
  }
}

/**
 * Retrieve an incident by its ID.
 *
 * This function first obtains the user session using the auth.api.getSession method. If the session is valid and the user is authenticated, it attempts to fetch the incident from the database using prisma.incident.findFirst. The incident is filtered by the provided ID and the user's ID. If an error occurs during the fetch, it logs the error and returns null.
 *
 * @param id - The unique identifier of the incident to retrieve.
 * @returns The incident object if found, or null if the user is not authenticated or an error occurs.
 */
export async function getIncident(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  try {
    const incident = await prisma.incident.findFirst({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
      include: {
        monitor: true,
        events: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return incident;
  } catch (error) {
    console.error("Failed to fetch incident details", error);
    return null;
  }
}

/**
 * Update the status of an incident based on its ID.
 *
 * This function first retrieves the user's session to ensure authorization. It then verifies the ownership of the incident by checking if it belongs to the user. If the incident is found, it updates the status and logs the event. Finally, it revalidates the relevant paths to reflect the changes. If any step fails, it returns an appropriate error message.
 *
 * @param id - The unique identifier of the incident to update.
 * @param status - The new status to set for the incident, which can be "INVESTIGATING", "IDENTIFIED", "MONITORING", or "RESOLVED".
 * @returns An object indicating the success of the operation and any error messages if applicable.
 */
export async function updateIncidentStatus(
  id: string,
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Verify ownership
    const incident = await prisma.incident.findFirst({
      where: {
        id,
        monitor: {
          userId: session.user.id,
        },
      },
    });

    if (!incident) return { success: false, error: "Incident not found" };

    const eventMessage = `Status updated to ${status} by user`;

    await prisma.incident.update({
      where: { id },
      data: {
        status: status as any,
        resolvedAt: status === "RESOLVED" ? new Date() : incident.resolvedAt,
        events: {
          create: {
            type: "STATE_CHANGE", // IncidentEventType not exported? Use string literal if mapped in DB or fix types
            message: eventMessage,
          },
        },
      },
    });

    revalidatePath("/dashboard/incidents");
    revalidatePath(`/dashboard/incidents/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update incident status", error);
    return { success: false, error: "Failed to update status" };
  }
}

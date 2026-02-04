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

/**
 * Create a new incident associated with a specific monitor.
 *
 * This function first retrieves the user's session to ensure authorization. It then verifies the ownership of the monitor by checking if it belongs to the user. If the monitor is found, it creates a new incident with the provided details and logs an event. Finally, it revalidates the relevant paths for updates. If any step fails, appropriate error messages are returned.
 *
 * @param data - An object containing the incident details including monitorId, title, description, severity, and status.
 * @returns An object indicating the success of the operation and the incidentId if successful, or an error message if not.
 */
export async function createIncident(data: {
  monitorId: string;
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Verify monitor ownership
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: data.monitorId,
        userId: session.user.id,
      },
    });

    if (!monitor) return { success: false, error: "Monitor not found" };

    const incident = await prisma.incident.create({
      data: {
        monitorId: data.monitorId,
        title: data.title,
        description: data.description,
        severity: data.severity as any,
        status: data.status as any,
        events: {
          create: {
            type: "STATE_CHANGE", // Use string literal or enum if imported
            message: `Incident manually reported: ${data.title}`,
          },
        },
      },
    });

    revalidatePath("/dashboard/incidents");
    revalidatePath(`/dashboard/monitors/${data.monitorId}`);
    return { success: true, incidentId: incident.id };
  } catch (error) {
    console.error("Failed to create incident", error);
    return { success: false, error: "Failed to create incident" };
  }
}

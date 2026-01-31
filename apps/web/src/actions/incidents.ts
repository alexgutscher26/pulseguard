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

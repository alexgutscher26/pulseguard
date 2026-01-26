"use server";

import prisma from "@pulseguard/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

const maintenanceSchema = z.object({
  monitorId: z.string(),
  description: z.string().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
});

export async function createMaintenanceWindow(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    monitorId: formData.get("monitorId"),
    description: formData.get("description"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  };

  const validation = maintenanceSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const data = validation.data;

  // Validate start < end
  if (data.startAt >= data.endAt) {
    return { success: false, error: "End time must be after start time" };
  }

  // Validate monitor ownership
  const monitor = await prisma.monitor.findUnique({
    where: {
      id: data.monitorId,
      userId: session.user.id,
    },
  });

  if (!monitor) {
    return { success: false, error: "Monitor not found or authorized" };
  }

  try {
    await prisma.maintenanceWindow.create({
      data: {
        monitorId: data.monitorId,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
      },
    });

    revalidatePath(`/dashboard/monitors/${data.monitorId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create maintenance window", error);
    return { success: false, error: "Failed to create maintenance window" };
  }
}

/**
 * Deletes a maintenance window identified by the given ID.
 *
 * The function first retrieves the current user session and checks for authorization.
 * It then verifies ownership of the maintenance window by checking the associated monitor's user ID.
 * If authorized, it deletes the maintenance window and revalidates the corresponding path.
 * In case of any errors during the process, it logs the error and returns a failure response.
 *
 * @param id - The ID of the maintenance window to be deleted.
 * @returns An object indicating the success status and any error message if applicable.
 */
export async function deleteMaintenanceWindow(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Verify ownership via monitor Relation lookup is complex efficiently in one delete call
    // So we find first
    const window = await prisma.maintenanceWindow.findUnique({
      where: { id },
      include: { monitor: true },
    });

    if (!window || window.monitor.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.maintenanceWindow.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/monitors/${window.monitorId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete maintenance window", error);
    return { success: false, error: "Failed to delete maintenance window" };
  }
}

/**
 * Retrieve maintenance windows for a specific monitor.
 *
 * The function first obtains the user session to verify ownership of the monitor. If the session is valid, it checks for the existence of the monitor associated with the provided monitorId. If the monitor is found, it retrieves the maintenance windows ordered by their start time. In case of any errors during the retrieval, it logs the error and returns an empty array.
 *
 * @param monitorId - The ID of the monitor for which to retrieve maintenance windows.
 * @returns An array of maintenance windows associated with the specified monitor, or an empty array if the monitor is not found or an error occurs.
 */
export async function getMaintenanceWindows(monitorId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  // Verify ownership
  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId, userId: session.user.id },
  });

  if (!monitor) return [];

  try {
    return await prisma.maintenanceWindow.findMany({
      where: { monitorId },
      orderBy: { startAt: "asc" },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

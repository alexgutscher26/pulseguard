"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

export async function getUserPreferences() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "HH:mm",
    };
  }

  return {
    // @ts-expect-error - additionalFields type extension
    timezone: session.user.timezone || "UTC",
    // @ts-expect-error - additionalFields type extension
    dateFormat: session.user.dateFormat || "MM/DD/YYYY",
    // @ts-expect-error - additionalFields type extension
    timeFormat: session.user.timeFormat || "HH:mm",
  };
}

export async function updateUserPreferences(data: {
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const prisma = await import("@pulseguard/db").then((m) => m.default);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        timezone: data.timezone,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update user preferences [DETAILS]:", {
      error,
      userId: session.user.id,
      data,
    });
    return { success: false, error: "Failed to update preferences" };
  }
}

"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";

/**
 * Retrieves user preferences based on the current session.
 *
 * The function first attempts to get the user session using the auth.api.getSession method with appropriate headers.
 * If no user session is found, it returns default preferences for timezone, date format, and time format.
 * If a user session exists, it returns the user's preferences, falling back to defaults if any are missing.
 */
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

/**
 * Update user preferences in the database.
 *
 * This function retrieves the current user session and checks for authorization. If authorized, it attempts to update the user's preferences in the database using Prisma. In case of an error during the update, it logs the error details and returns a failure response.
 *
 * @param data - An object containing optional user preference fields: timezone, dateFormat, and timeFormat.
 * @returns An object indicating the success of the update operation.
 * @throws Error If the user is not authorized.
 */
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

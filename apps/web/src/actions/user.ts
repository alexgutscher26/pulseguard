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
    timezone: session.user.timezone || "UTC",
    dateFormat: session.user.dateFormat || "MM/DD/YYYY",
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

export async function getLicenseTelemetry() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      tier: "INITIATE",
      probeCount: 0,
      maxProbes: 0,
      pingInterval: "60s Min",
      regions: "US-East Only",
    };
  }

  try {
    const prisma = await import("@pulseguard/db").then((m) => m.default);

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true },
    });

    const userTier = dbUser?.tier || session.user.tier || "INITIATE";
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    const isEmailAdmin = Boolean(dbUser?.email && adminEmails.includes(dbUser.email.toLowerCase()));
    const isAdmin = userTier === "ADMIN" || isEmailAdmin;

    const probeCount = await prisma.probe.count({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    let maxProbes = 0;
    let pingInterval = "60s Min";
    let regions = "US-East Only";

    if (userTier === "NETRUNNER") {
      maxProbes = 3;
      pingInterval = "30s Min";
      regions = "3 Regions";
    } else if (userTier === "CONSTRUCT" || userTier === "ADMIN") {
      maxProbes = 5; // Enterprise / Admin
      pingInterval = "10s Min";
      regions = "Global Edge";
    }

    return {
      tier: userTier,
      isAdmin,
      probeCount,
      maxProbes,
      pingInterval,
      regions,
    };
  } catch (error) {
    console.error("Failed to fetch license telemetry:", error);
    return {
      tier: session.user.tier || "INITIATE",
      probeCount: 0,
      maxProbes: session.user.tier === "NETRUNNER" ? 3 : session.user.tier === "CONSTRUCT" ? 5 : 0,
      pingInterval:
        session.user.tier === "NETRUNNER"
          ? "30s Min"
          : session.user.tier === "CONSTRUCT"
            ? "10s Min"
            : "60s Min",
      regions:
        session.user.tier === "NETRUNNER"
          ? "3 Regions"
          : session.user.tier === "CONSTRUCT"
            ? "Global Edge"
            : "US-East Only",
    };
  }
}

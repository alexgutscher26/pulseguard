import prisma from "@pulseguard/db";

/**
 * Default badge text for widget status display
 */
export const DEFAULT_BADGE_TEXT = {
  operational: "All Systems Operational",
  partial: "Partial Outage",
  major: "Major Outage",
};

/**
 * Badge text configuration type
 */
export interface BadgeTextConfig {
  operational: string;
  partial: string;
  major: string;
}

/**
 * Calculate uptime percentage for a monitor over a given time period
 * 
 * @param monitorId - The monitor ID to calculate uptime for
 * @param days - Number of days to look back (30, 60, or 90)
 * @returns Uptime percentage (0-100) with 2 decimal precision
 */
export async function calculateUptime(
  monitorId: string,
  days: number = 90
): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const events = await prisma.monitorEvent.findMany({
    where: {
      monitorId,
      timestamp: { gte: startDate },
    },
    orderBy: { timestamp: "asc" },
    select: {
      status: true,
      timestamp: true,
    },
  });

  // No events = assume 100% uptime (no data to disprove)
  if (events.length === 0) {
    return 100;
  }

  const totalDurationMs = Date.now() - startDate.getTime();
  let downtimeMs = 0;
  let lastDownTime: Date | null = null;

  for (const event of events) {
    if (event.status === "DOWN" && lastDownTime === null) {
      // Start of downtime
      lastDownTime = event.timestamp;
    } else if (event.status === "UP" && lastDownTime !== null) {
      // End of downtime
      downtimeMs += event.timestamp.getTime() - lastDownTime.getTime();
      lastDownTime = null;
    }
  }

  // If still in downtime state, count until now
  if (lastDownTime !== null) {
    downtimeMs += Date.now() - lastDownTime.getTime();
  }

  const uptimeMs = totalDurationMs - downtimeMs;
  const uptimePercentage = (uptimeMs / totalDurationMs) * 100;

  // Clamp between 0 and 100, round to 2 decimal places
  return Math.round(Math.max(0, Math.min(100, uptimePercentage)) * 100) / 100;
}

/**
 * Calculate uptime for multiple monitors (e.g., all monitors on a status page)
 * Returns average uptime across all monitors
 * 
 * @param monitorIds - Array of monitor IDs
 * @param days - Number of days to look back
 * @returns Average uptime percentage across all monitors
 */
export async function calculateAverageUptime(
  monitorIds: string[],
  days: number = 90
): Promise<number> {
  if (monitorIds.length === 0) {
    return 100;
  }

  const uptimes = await Promise.all(
    monitorIds.map((id) => calculateUptime(id, days))
  );

  const average = uptimes.reduce((sum, val) => sum + val, 0) / uptimes.length;
  return Math.round(average * 100) / 100;
}

/**
 * Get uptime trend compared to previous period
 * 
 * @param monitorId - Monitor ID
 * @param days - Current period days
 * @returns Object with current, previous uptimes and trend direction
 */
export async function getUptimeTrend(
  monitorId: string,
  days: number = 90
): Promise<{
  current: number;
  previous: number;
  trend: "up" | "down" | "stable";
  difference: number;
}> {
  const current = await calculateUptime(monitorId, days);
  
  // Calculate previous period (same length, immediately prior)
  const now = new Date();
  const currentStart = new Date();
  currentStart.setDate(currentStart.getDate() - days);
  
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);

  const previousEvents = await prisma.monitorEvent.findMany({
    where: {
      monitorId,
      timestamp: { 
        gte: previousStart,
        lt: currentStart,
      },
    },
    orderBy: { timestamp: "asc" },
    select: {
      status: true,
      timestamp: true,
    },
  });

  // Calculate previous period uptime with same logic
  let previous = 100;
  if (previousEvents.length > 0) {
    const periodMs = days * 24 * 60 * 60 * 1000;
    let downtimeMs = 0;
    let lastDownTime: Date | null = null;

    for (const event of previousEvents) {
      if (event.status === "DOWN" && lastDownTime === null) {
        lastDownTime = event.timestamp;
      } else if (event.status === "UP" && lastDownTime !== null) {
        downtimeMs += event.timestamp.getTime() - lastDownTime.getTime();
        lastDownTime = null;
      }
    }

    if (lastDownTime !== null) {
      downtimeMs += currentStart.getTime() - lastDownTime.getTime();
    }

    const uptimeMs = periodMs - downtimeMs;
    previous = Math.round(Math.max(0, Math.min(100, (uptimeMs / periodMs) * 100)) * 100) / 100;
  }

  const difference = Math.round((current - previous) * 100) / 100;
  
  let trend: "up" | "down" | "stable";
  if (difference > 0.01) {
    trend = "up";
  } else if (difference < -0.01) {
    trend = "down";
  } else {
    trend = "stable";
  }

  return { current, previous, trend, difference };
}

/**
 * Determine overall status based on monitor statuses
 */
export function getOverallStatus(
  monitors: Array<{ status: string }>
): "operational" | "partial" | "major" {
  const downCount = monitors.filter((m) => m.status === "DOWN").length;
  
  if (downCount === 0) {
    return "operational";
  } else if (downCount < monitors.length) {
    return "partial";
  } else {
    return "major";
  }
}

/**
 * Get status message based on overall status and custom badge text
 */
export function getStatusMessage(
  status: "operational" | "partial" | "major",
  customBadgeText?: BadgeTextConfig | null
): string {
  const text = customBadgeText || DEFAULT_BADGE_TEXT;
  return text[status];
}

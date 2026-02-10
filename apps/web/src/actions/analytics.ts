"use server";

import prisma from "@pulseguard/db";
import { headers } from "next/headers";
import { hashVisitor } from "@/lib/analytics";

/**
 * Records a page view for a status page.
 * Designed to be called from a Server Action or Server Component.
 */
export async function recordStatusPageView(pageId: string) {
  try {
    const headerStore = await headers();

    // Extract IP
    const forwardedFor = headerStore.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Extract UA
    const userAgent = headerStore.get("user-agent") || "";

    // Generate Hash
    const visitorHash = hashVisitor(ip, userAgent);

    // Determine Country (Vercel specific header, fallback null)
    const country = headerStore.get("x-vercel-ip-country");

    // Write to DB
    // We use create because we want a log of every visit.
    await prisma.statusPageView.create({
      data: {
        statusPageId: pageId,
        visitorHash,
        userAgent: userAgent.substring(0, 255), // Truncate just in case
        country: country || undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to record analytics:", error);
    // Fail silently to not impact user experience
    return { success: false };
  }
}

/**
 * Fetch analytics data for the dashboard
 */
export async function getStatusPageAnalytics(pageId: string, days: number = 30) {
  // Basic verification of ownership should happen in the parent component or here if we pass session.
  // Assuming caller checks permissions for now as this is detailed data.

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const views = await prisma.statusPageView.findMany({
      where: {
        statusPageId: pageId,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
      select: {
        timestamp: true,
        visitorHash: true,
      },
    });

    // Process data for Chart (Group by Day)
    const groupedMap = new Map<string, { date: string; views: number; uniques: Set<string> }>();

    // Fill empty days? Ideally yes, but let's start with raw data.
    // Actually, charts look better with 0s.

    // Initialize map
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      groupedMap.set(key, { date: key, views: 0, uniques: new Set<string>() });
    }

    views.forEach((v: { timestamp: Date; visitorHash: string }) => {
      const key = v.timestamp.toISOString().split("T")[0];
      if (groupedMap.has(key)) {
        const entry = groupedMap.get(key)!;
        entry.views++;
        entry.uniques.add(v.visitorHash);
      }
    });

    // Sort by date key (ascending)
    const chartData = Array.from(groupedMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, val]) => ({
        date: val.date,
        views: val.views,
        uniqueVisitors: val.uniques.size,
      }));

    // Calculate Totals
    const totalViews = views.length;
    const distinctVisitors = new Set(views.map((v) => v.visitorHash)).size;

    return {
      chartData,
      totalViews,
      uniqueVisitors: distinctVisitors,
    };
  } catch (e) {
    console.error("Analytics fetch failed:", e);
    return { chartData: [], totalViews: 0, uniqueVisitors: 0 };
  }
}

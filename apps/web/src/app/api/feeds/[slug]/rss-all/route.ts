import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { generateRssFeed, type FeedItem } from "@/lib/feeds/rss-generator";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch status page with incidents and recent events
    const statusPage = await prisma.statusPage.findUnique({
      where: { slug },
      include: {
        monitors: {
          include: {
            monitor: {
              include: {
                incidents: {
                  where: {
                    createdAt: {
                      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    },
                  },
                  orderBy: { createdAt: "desc" },
                  take: 20,
                },
                events: {
                  where: {
                    timestamp: {
                      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                    },
                    status: { in: ["DOWN", "UP"] }, // Only status changes
                  },
                  orderBy: { timestamp: "desc" },
                  take: 50,
                },
              },
            },
          },
        },
      },
    });

    if (!statusPage) {
      return new NextResponse("Status page not found", { status: 404 });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const pageUrl = `${baseUrl}/status-page/${slug}`;

    // Collect all feed items
    const items: FeedItem[] = [];

    // Add incidents
    for (const m of statusPage.monitors) {
      const monitorName = m.displayName || m.monitor.name;

      for (const incident of m.monitor.incidents) {
        items.push({
          id: `incident-${incident.id}`,
          title: `[INCIDENT] ${incident.title}`,
          description: `
            <p><strong>Status:</strong> ${incident.status}</p>
            <p><strong>Affected:</strong> ${monitorName}</p>
            ${incident.description ? `<p>${incident.description}</p>` : ""}
          `,
          link: `${pageUrl}#incident-${incident.id}`,
          pubDate: incident.createdAt,
          category: "incident",
        });
      }

      // Add status change events
      for (const event of m.monitor.events) {
        const statusText = event.status === "DOWN" ? "went DOWN" : "is UP";
        items.push({
          id: `event-${event.id}`,
          title: `${monitorName} ${statusText}`,
          description: `
            <p><strong>Monitor:</strong> ${monitorName}</p>
            <p><strong>Status:</strong> ${event.status}</p>
            ${event.latency ? `<p><strong>Latency:</strong> ${event.latency}ms</p>` : ""}
            ${event.errorReason ? `<p><strong>Error:</strong> ${event.errorReason}</p>` : ""}
            <p><strong>Region:</strong> ${event.region || "default"}</p>
          `,
          link: pageUrl,
          pubDate: event.timestamp,
          category: event.status === "DOWN" ? "outage" : "recovery",
        });
      }
    }

    // Sort by date descending and limit
    items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    const limitedItems = items.slice(0, 100);

    // Generate RSS feed
    const rss = generateRssFeed({
      title: `${statusPage.title} - All Status Events`,
      description: `All status updates and events for ${statusPage.title}`,
      link: pageUrl,
      lastBuildDate: limitedItems[0]?.pubDate || new Date(),
      items: limitedItems,
    });

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60", // 1 min cache (more frequent updates)
      },
    });
  } catch (error) {
    console.error("[RSS-All Feed] Error generating feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

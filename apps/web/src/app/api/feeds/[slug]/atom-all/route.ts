import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { generateAtomFeed, AtomEntry } from "@/lib/feeds/atom-generator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

    // Collect all feed entries
    const entries: AtomEntry[] = [];

    // Add incidents
    for (const m of statusPage.monitors) {
      const monitorName = m.displayName || m.monitor.name;

      for (const incident of m.monitor.incidents) {
        entries.push({
          id: `urn:pulseguard:incident:${incident.id}`,
          title: `[INCIDENT] ${incident.title}`,
          content: `
            <p><strong>Status:</strong> ${incident.status}</p>
            <p><strong>Affected:</strong> ${monitorName}</p>
            ${incident.description ? `<p>${incident.description}</p>` : ""}
          `,
          link: `${pageUrl}#incident-${incident.id}`,
          updated: incident.updatedAt,
          published: incident.createdAt,
          category: "incident",
        });
      }

      // Add status change events
      for (const event of m.monitor.events) {
        const statusText = event.status === "DOWN" ? "went DOWN" : "is UP";
        entries.push({
          id: `urn:pulseguard:event:${event.id}`,
          title: `${monitorName} ${statusText}`,
          content: `
            <p><strong>Monitor:</strong> ${monitorName}</p>
            <p><strong>Status:</strong> ${event.status}</p>
            ${event.latency ? `<p><strong>Latency:</strong> ${event.latency}ms</p>` : ""}
            ${event.errorReason ? `<p><strong>Error:</strong> ${event.errorReason}</p>` : ""}
            <p><strong>Region:</strong> ${event.region || "default"}</p>
          `,
          link: pageUrl,
          updated: event.timestamp,
          published: event.timestamp,
          category: event.status === "DOWN" ? "outage" : "recovery",
        });
      }
    }

    // Sort by date descending and limit
    entries.sort((a, b) => b.updated.getTime() - a.updated.getTime());
    const limitedEntries = entries.slice(0, 100);

    // Generate Atom feed
    const atom = generateAtomFeed({
      id: `urn:pulseguard:status:${statusPage.id}:all`,
      title: `${statusPage.title} - All Status Events`,
      subtitle: `All status updates and events for ${statusPage.title}`,
      link: pageUrl,
      updated: limitedEntries[0]?.updated || new Date(),
      author: {
        name: statusPage.title,
      },
      entries: limitedEntries,
    });

    return new NextResponse(atom, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60", // 1 min cache
      },
    });
  } catch (error) {
    console.error("[Atom-All Feed] Error generating feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

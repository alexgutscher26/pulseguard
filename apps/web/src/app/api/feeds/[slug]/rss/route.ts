import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { generateRssFeed } from "@/lib/feeds/rss-generator";

export const dynamic = "force-dynamic";

export async function GET({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Fetch status page with incidents
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
                      gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                    },
                  },
                  orderBy: { createdAt: "desc" },
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

    // Collect all incidents from all monitors
    const incidents = statusPage.monitors
      .flatMap((m) =>
        m.monitor.incidents.map((incident) => ({
          ...incident,
          monitorName: m.displayName || m.monitor.name,
        })),
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 50);

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const pageUrl = `${baseUrl}/status-page/${slug}`;

    // Generate RSS feed
    const rss = generateRssFeed({
      title: `${statusPage.title} - Status Updates`,
      description: statusPage.description || `Status updates for ${statusPage.title}`,
      link: pageUrl,
      lastBuildDate: incidents[0]?.updatedAt || new Date(),
      items: incidents.map((incident) => ({
        id: `incident-${incident.id}`,
        title: `[${incident.status}] ${incident.title}`,
        description: `
          <p><strong>Status:</strong> ${incident.status}</p>
          <p><strong>Affected:</strong> ${incident.monitorName}</p>
          ${incident.description ? `<p>${incident.description}</p>` : ""}
          <p><em>Last updated: ${incident.updatedAt.toISOString()}</em></p>
        `,
        link: `${pageUrl}#incident-${incident.id}`,
        pubDate: incident.createdAt,
        category: incident.status,
      })),
    });

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300", // 5 min cache
      },
    });
  } catch (error) {
    console.error("[RSS Feed] Error generating feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { generateAtomFeed } from "@/lib/feeds/atom-generator";

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

    // Generate Atom feed
    const atom = generateAtomFeed({
      id: `urn:pulseguard:status:${statusPage.id}`,
      title: `${statusPage.title} - Status Updates`,
      subtitle: statusPage.description || undefined,
      link: pageUrl,
      updated: incidents[0]?.updatedAt || new Date(),
      author: {
        name: statusPage.title,
      },
      entries: incidents.map((incident) => ({
        id: `urn:pulseguard:incident:${incident.id}`,
        title: `[${incident.status}] ${incident.title}`,
        content: `
          <p><strong>Status:</strong> ${incident.status}</p>
          <p><strong>Affected:</strong> ${incident.monitorName}</p>
          ${incident.description ? `<p>${incident.description}</p>` : ""}
          <p><em>Last updated: ${incident.updatedAt.toISOString()}</em></p>
        `,
        link: `${pageUrl}#incident-${incident.id}`,
        updated: incident.updatedAt,
        published: incident.createdAt,
        category: incident.status,
      })),
    });

    return new NextResponse(atom, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300", // 5 min cache
      },
    });
  } catch (error) {
    console.error("[Atom Feed] Error generating feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

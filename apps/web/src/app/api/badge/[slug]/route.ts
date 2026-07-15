import { NextRequest } from "next/server";
import prisma from "@pulseguard/db";
import { getOverallStatus } from "@/lib/uptime-calculator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Trim .svg suffix if it was requested (e.g. /api/badge/my-slug.svg)
  let cleanSlug = slug;
  if (slug.endsWith(".svg")) {
    cleanSlug = slug.slice(0, -4);
  }

  // Fetch the status page
  const page = await prisma.statusPage.findUnique({
    where: { slug: cleanSlug },
    include: {
      monitors: {
        include: {
          monitor: true,
        },
      },
    },
  });

  if (!page) {
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
         <rect width="120" height="20" rx="3" fill="#555"/>
         <text x="10" y="14" fill="#fff" font-family="sans-serif" font-size="11">page not found</text>
       </svg>`,
      {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }

  // Determine overall status
  const monitorStatuses = page.monitors.map((m) => ({
    status: m.monitor.status,
  }));
  const status = getOverallStatus(monitorStatuses);

  // Parse parameters
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") || "dark"; // dark | light
  const style = searchParams.get("style") || "flat"; // flat | outline
  const size = searchParams.get("size") || "sm"; // sm | lg

  // Map status to label and colors
  let statusText = "OPERATIONAL";
  let color = "#22c55e"; // Operational green

  if (status === "partial") {
    statusText = "DEGRADED";
    color = "#f59e0b"; // Warning amber
  } else if (status === "major") {
    statusText = "OUTAGE";
    color = "#ef4444"; // Major red
  }

  // Dimensions
  const isLg = size === "lg";
  const height = isLg ? 32 : 20;
  const fontSize = isLg ? 11 : 9.5;
  const paddingX = isLg ? 12 : 8;

  const prefixText = "STATUS";
  // Prefix text length approx
  const prefixWidth = isLg ? 55 : 45;
  const valueWidth = (statusText.length * (isLg ? 7.2 : 6.2)) + (paddingX * 2);
  const totalWidth = prefixWidth + valueWidth;

  let svgContent = "";

  if (style === "outline") {
    // Cyberpunk transparent/glassmorphic neon-glowing outline style
    const bgOpacity = theme === "light" ? "0.05" : "0.2";
    const bgFill = theme === "light" ? "#000000" : "#ffffff";
    const textColor = theme === "light" ? "#333333" : "#dddddd";
    const borderOpacity = theme === "light" ? "0.15" : "0.25";

    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${totalWidth}" height="${height}" rx="${isLg ? 6 : 4}" fill="${bgFill}" fill-opacity="${bgOpacity}" stroke="${color}" stroke-opacity="${borderOpacity}" stroke-width="1.5" />
        
        <!-- Vertical separator line -->
        <line x1="${prefixWidth}" y1="0" x2="${prefixWidth}" y2="${height}" stroke="${color}" stroke-opacity="0.15" stroke-width="1" />

        <!-- Status indicator dot -->
        <circle cx="${prefixWidth + paddingX + 4}" cy="${height / 2}" r="${isLg ? 4.5 : 3.5}" fill="${color}" filter="url(#glow)" />

        <!-- Text -->
        <text x="${prefixWidth / 2}" y="${(height / 2) + (isLg ? 4.5 : 3.5)}" text-anchor="middle" fill="${textColor}" font-family="monospace, monospace" font-size="${fontSize}" font-weight="bold" letter-spacing="0.5">${prefixText}</text>
        <text x="${prefixWidth + paddingX + (isLg ? 14 : 10)}" y="${(height / 2) + (isLg ? 4.5 : 3.5)}" fill="${color}" filter="url(#glow)" font-family="monospace, monospace" font-size="${fontSize}" font-weight="bold" letter-spacing="0.5">${statusText}</text>
      </svg>
    `;
  } else {
    // Flat style (solid background panels, clean shields.io look)
    const labelBg = theme === "light" ? "#f1f5f9" : "#1e293b";
    const labelText = theme === "light" ? "#475569" : "#94a3b8";

    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
        <clipPath id="r">
          <rect width="${totalWidth}" height="${height}" rx="${isLg ? 6 : 4}" />
        </clipPath>
        <g clip-path="url(#r)">
          <rect width="${prefixWidth}" height="${height}" fill="${labelBg}" />
          <rect x="${prefixWidth}" width="${valueWidth}" height="${height}" fill="${color}" />
        </g>
        <g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="${fontSize}" font-weight="bold">
          <text x="${prefixWidth / 2}" y="${(height / 2) + (isLg ? 4.5 : 3.5)}" fill="${labelText}" text-anchor="middle">${prefixText}</text>
          <text x="${prefixWidth + (valueWidth / 2)}" y="${(height / 2) + (isLg ? 4.5 : 3.5)}" fill="#ffffff" text-anchor="middle">${statusText}</text>
        </g>
      </svg>
    `;
  }

  return new Response(svgContent.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=5",
    },
  });
}

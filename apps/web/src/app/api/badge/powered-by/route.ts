import { NextRequest } from "next/server";

/**
 * Serves a "Powered by PulseGuard" SVG badge.
 *
 * Query params:
 *   theme  — "dark" | "light"  (default: "dark")
 *   style  — "flat" | "outline" (default: "flat")
 *   size   — "sm" | "lg"       (default: "sm")
 *
 * Example:
 *   /api/badge/powered-by?theme=dark&style=outline&size=lg
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const theme = (searchParams.get("theme") ?? "dark") as "dark" | "light";
  const style = (searchParams.get("style") ?? "flat") as "flat" | "outline";
  const size = (searchParams.get("size") ?? "sm") as "sm" | "lg";

  const isLg = size === "lg";
  const height = isLg ? 32 : 20;
  const fontSize = isLg ? 10.5 : 9;
  const paddingX = isLg ? 10 : 7;

  const labelText = "POWERED BY";
  const valueText = "PULSEGUARD";
  const labelWidth = isLg ? 70 : 56;
  const valueWidth = valueText.length * (isLg ? 6.8 : 5.8) + paddingX * 2;
  const totalWidth = labelWidth + valueWidth;

  // Brand accent — electric cyan matches the PulseGuard primary
  const accent = "#22c55e";

  let svgContent: string;

  if (style === "outline") {
    const bgOpacity = theme === "light" ? "0.04" : "0.18";
    const bgFill = theme === "light" ? "#000000" : "#ffffff";
    const textColor = theme === "light" ? "#374151" : "#d1d5db";
    const strokeOpacity = theme === "light" ? "0.12" : "0.20";

    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
  <rect width="${totalWidth}" height="${height}" rx="${isLg ? 5 : 3}" fill="${bgFill}" fill-opacity="${bgOpacity}" stroke="${accent}" stroke-opacity="${strokeOpacity}" stroke-width="1.5"/>
  <line x1="${labelWidth}" y1="0" x2="${labelWidth}" y2="${height}" stroke="${accent}" stroke-opacity="0.12" stroke-width="1"/>
  <!-- Pulse dot -->
  <circle cx="${labelWidth + paddingX + 3}" cy="${height / 2}" r="${isLg ? 3.5 : 2.5}" fill="${accent}"/>
  <!-- Label -->
  <text x="${labelWidth / 2}" y="${height / 2 + (isLg ? 4 : 3.2)}" text-anchor="middle" fill="${textColor}" font-family="monospace,monospace" font-size="${fontSize}" font-weight="700" letter-spacing="0.4">${labelText}</text>
  <!-- Value -->
  <text x="${labelWidth + paddingX + (isLg ? 12 : 9)}" y="${height / 2 + (isLg ? 4 : 3.2)}" fill="${accent}" font-family="monospace,monospace" font-size="${fontSize}" font-weight="700" letter-spacing="0.4">${valueText}</text>
</svg>`;
  } else {
    // Flat style
    const labelBg = theme === "light" ? "#f1f5f9" : "#1e293b";
    const labelFg = theme === "light" ? "#64748b" : "#94a3b8";

    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}">
  <clipPath id="clip-pg"><rect width="${totalWidth}" height="${height}" rx="${isLg ? 5 : 3}"/></clipPath>
  <g clip-path="url(#clip-pg)">
    <rect width="${labelWidth}" height="${height}" fill="${labelBg}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${accent}"/>
  </g>
  <g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="${fontSize}" font-weight="700">
    <text x="${labelWidth / 2}" y="${height / 2 + (isLg ? 4 : 3.2)}" fill="${labelFg}" text-anchor="middle">${labelText}</text>
    <text x="${labelWidth + valueWidth / 2}" y="${height / 2 + (isLg ? 4 : 3.2)}" fill="#000000" text-anchor="middle">${valueText}</text>
  </g>
</svg>`;
  }

  return new Response(svgContent.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

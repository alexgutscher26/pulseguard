import type { MetadataRoute } from "next";
import prisma from "@pulseguard/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pulseguard.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/comparison",
    "/privacy",
    "/terms",
    "/hall-of-fame",
    "/showcase",
    "/features/automated-dispatch",
    "/features/latency-grid",
    "/features/sleep-mode",
    "/features/global-verification",
    "/tools/visual-diff",
    "/tools/ssl-checker",
    "/tools/roast-my-stack",
    "/tools/port-checker",
    "/tools/payload-regex",
    "/tools/ip-subnet",
    "/tools/http-headers",
    "/tools/global-latency",
    "/tools/cron-sentinel",
    "/tools/dns-sentinel",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority:
      route === ""
        ? 1.0
        : route.startsWith("/features/")
          ? 0.8
          : route.startsWith("/tools/")
            ? 0.7
            : 0.5,
  }));

  try {
    // Dynamically retrieve public status pages from the database
    const publicPages = await prisma.statusPage.findMany({
      where: { isPrivate: false },
      select: { slug: true, updatedAt: true },
    });

    for (const page of publicPages) {
      sitemapEntries.push({
        url: `${baseUrl}/status-page/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error("Failed to generate dynamic status pages in sitemap:", error);
  }

  return sitemapEntries;
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/blog",
        "/comparison",
        "/privacy",
        "/terms",
        "/hall-of-fame",
        "/showcase",
        "/features/",
        "/tools/",
        "/status-page/",
      ],
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/settings",
        "/settings/",
        "/api/",
        "/_next/",
        "/static/",
      ],
    },
    sitemap: "https://pulseguard.com/sitemap.xml",
  };
}

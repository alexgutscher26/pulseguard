/**
 * RSS 2.0 Feed Generator
 * Generates valid RSS XML for status page incidents and events
 */

interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  category?: string;
}

interface FeedConfig {
  title: string;
  description: string;
  link: string;
  language?: string;
  lastBuildDate?: Date;
  items: FeedItem[];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822Date(date: Date): string {
  return date.toUTCString();
}

export function generateRssFeed(config: FeedConfig): string {
  const { title, description, link, language = "en-us", lastBuildDate, items } = config;

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <description><![CDATA[${item.description}]]></description>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <pubDate>${formatRfc822Date(item.pubDate)}</pubDate>
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ""}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <language>${language}</language>
    <lastBuildDate>${formatRfc822Date(lastBuildDate || new Date())}</lastBuildDate>
    <atom:link href="${escapeXml(link)}/feed/rss" rel="self" type="application/rss+xml"/>
    <generator>PulseGuard Status Page</generator>
    ${itemsXml}
  </channel>
</rss>`;
}

export type { FeedItem, FeedConfig };

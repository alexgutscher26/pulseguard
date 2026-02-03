/**
 * Atom 1.0 Feed Generator
 * Generates valid Atom XML for status page incidents and events
 */

interface AtomEntry {
  id: string;
  title: string;
  content: string;
  link: string;
  updated: Date;
  published?: Date;
  category?: string;
  author?: {
    name: string;
    email?: string;
  };
}

interface AtomFeedConfig {
  id: string;
  title: string;
  subtitle?: string;
  link: string;
  updated: Date;
  author?: {
    name: string;
    email?: string;
  };
  entries: AtomEntry[];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatIso8601(date: Date): string {
  return date.toISOString();
}

export function generateAtomFeed(config: AtomFeedConfig): string {
  const { id, title, subtitle, link, updated, author, entries } = config;

  const entriesXml = entries
    .map(
      (entry) => `
  <entry>
    <id>${escapeXml(entry.id)}</id>
    <title>${escapeXml(entry.title)}</title>
    <content type="html"><![CDATA[${entry.content}]]></content>
    <link href="${escapeXml(entry.link)}" rel="alternate"/>
    <updated>${formatIso8601(entry.updated)}</updated>
    ${entry.published ? `<published>${formatIso8601(entry.published)}</published>` : ""}
    ${entry.category ? `<category term="${escapeXml(entry.category)}"/>` : ""}
    ${
      entry.author
        ? `<author>
      <name>${escapeXml(entry.author.name)}</name>
      ${entry.author.email ? `<email>${escapeXml(entry.author.email)}</email>` : ""}
    </author>`
        : ""
    }
  </entry>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(id)}</id>
  <title>${escapeXml(title)}</title>
  ${subtitle ? `<subtitle>${escapeXml(subtitle)}</subtitle>` : ""}
  <link href="${escapeXml(link)}" rel="alternate"/>
  <link href="${escapeXml(link)}/feed/atom" rel="self" type="application/atom+xml"/>
  <updated>${formatIso8601(updated)}</updated>
  <generator uri="https://pulseguard.com">PulseGuard Status Page</generator>
  ${
    author
      ? `<author>
    <name>${escapeXml(author.name)}</name>
    ${author.email ? `<email>${escapeXml(author.email)}</email>` : ""}
  </author>`
      : ""
  }
  ${entriesXml}
</feed>`;
}

export type { AtomEntry, AtomFeedConfig };

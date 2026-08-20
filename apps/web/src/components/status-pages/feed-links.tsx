"use client";

import { useState } from "react";
import { Rss, Copy, Check, ExternalLink } from "lucide-react";

interface FeedLinksProps {
  pageSlug: string;
  pageTitle: string;
}

export function FeedLinks({ pageSlug, pageTitle }: FeedLinksProps) {
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const feeds = [
    {
      id: "rss",
      name: "RSS Feed",
      subtitle: "Incidents Only",
      url: `${baseUrl}/api/feeds/${pageSlug}/rss`,
      icon: Rss,
    },
    {
      id: "rss-all",
      name: "RSS Feed",
      subtitle: "All Events",
      url: `${baseUrl}/api/feeds/${pageSlug}/rss-all`,
      icon: Rss,
    },
    {
      id: "atom",
      name: "Atom Feed",
      subtitle: "Incidents Only",
      url: `${baseUrl}/api/feeds/${pageSlug}/atom`,
      icon: Rss,
    },
    {
      id: "atom-all",
      name: "Atom Feed",
      subtitle: "All Events",
      url: `${baseUrl}/api/feeds/${pageSlug}/atom-all`,
      icon: Rss,
    },
  ];

  const copyToClipboard = async (feedId: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedFeed(feedId);
      setTimeout(() => setCopiedFeed(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-3">
      {feeds.map((feed) => (
        <div
          key={feed.id}
          className="flex items-center justify-between p-3 border border-primary/20 rounded-md bg-black/30 hover:bg-primary/5 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <feed.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{feed.name}</p>
              <p className="text-xs text-primary/50">{feed.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(feed.id, feed.url)}
              className="p-2 rounded-md hover:bg-primary/10 text-primary/50 hover:text-primary transition-colors"
              title="Copy URL"
            >
              {copiedFeed === feed.id ? (
                <Check className="size-4 text-primary" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
            <a
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-primary/10 text-primary/50 hover:text-primary transition-colors"
              title="Open Feed"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      ))}

      <p className="text-xs text-primary/30 text-center mt-4">
        Add these URLs to your RSS reader app (like Feedly, Inoreader, or
        NewsBlur)
      </p>
    </div>
  );
}

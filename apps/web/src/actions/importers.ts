"use server";

import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import type { NormalizedImportMonitor } from "./uptimerobot";

/**
 * Fetches monitor configurations from Better Stack (Better Uptime) API.
 * Endpoint: GET https://uptime.betterstack.com/api/v2/monitors
 * Header: Authorization: Bearer <apiKey>
 */
export async function fetchBetterStackMonitors(apiKey: string): Promise<{
  success: boolean;
  monitors?: NormalizedImportMonitor[];
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { success: false, error: "Better Stack API Key is required." };
  }

  try {
    const response = await fetch("https://uptime.betterstack.com/api/v2/monitors", {
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Better Stack API returned status ${response.status}. Please check your API token.`,
      };
    }

    const data: any = await response.json();
    const items = data?.data || [];

    const normalized: NormalizedImportMonitor[] = items.map((item: any) => {
      const attrs = item.attributes || {};
      let mappedType: "HTTP" | "PING" | "PORT" = "HTTP";
      if (attrs.monitor_type === "ping") mappedType = "PING";
      else if (attrs.monitor_type === "tcp") mappedType = "PORT";

      const targetUrl = attrs.url || attrs.pronounceable_name || "";

      return {
        name: attrs.pronounceable_name || targetUrl || `BetterStack Monitor ${item.id}`,
        url: targetUrl,
        type: mappedType,
        interval: 60,
        selected: true,
      };
    });

    return {
      success: true,
      monitors: normalized,
    };
  } catch (err: any) {
    console.error("Failed to fetch Better Stack monitors:", err);
    return {
      success: false,
      error: "Failed to connect to Better Stack API.",
    };
  }
}

/**
 * Fetches monitor configurations from StatusCake API v1.
 * Endpoint: GET https://api.statuscake.com/v1/uptime
 * Header: Authorization: Bearer <apiKey>
 */
export async function fetchStatusCakeMonitors(apiKey: string): Promise<{
  success: boolean;
  monitors?: NormalizedImportMonitor[];
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { success: false, error: "StatusCake API Key is required." };
  }

  try {
    const response = await fetch("https://api.statuscake.com/v1/uptime", {
      headers: {
        Authorization: `Bearer ${cleanKey}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `StatusCake API returned status ${response.status}. Please check your API key.`,
      };
    }

    const data: any = await response.json();
    const items = data?.data || (Array.isArray(data) ? data : []);

    const normalized: NormalizedImportMonitor[] = items.map((item: any) => {
      let mappedType: "HTTP" | "PING" | "PORT" = "HTTP";
      if (item.test_type === "PING") mappedType = "PING";
      else if (item.test_type === "TCP") mappedType = "PORT";

      return {
        name: item.name || item.website_url || `StatusCake Monitor ${item.id}`,
        url: item.website_url || item.website_name || "",
        type: mappedType,
        interval: 60,
        selected: true,
      };
    });

    return {
      success: true,
      monitors: normalized,
    };
  } catch (err: any) {
    console.error("Failed to fetch StatusCake monitors:", err);
    return {
      success: false,
      error: "Failed to connect to StatusCake API.",
    };
  }
}

/**
 * Parses user pasted CSV or JSON file contents into normalized monitors.
 */
export async function parseCsvOrJsonMonitors(content: string): Promise<{
  success: boolean;
  monitors?: NormalizedImportMonitor[];
  error?: string;
}> {
  const raw = content.trim();
  if (!raw) {
    return { success: false, error: "Content is empty." };
  }

  // Try JSON first
  if (raw.startsWith("[") || raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : parsed.monitors || [parsed];
      const normalized: NormalizedImportMonitor[] = list.map((item: any, idx: number) => {
        let type: "HTTP" | "PING" | "PORT" = "HTTP";
        const rawType = (item.type || "").toUpperCase();
        if (rawType.includes("PING")) type = "PING";
        else if (rawType.includes("PORT") || rawType.includes("TCP")) type = "PORT";

        return {
          name: item.name || item.friendly_name || item.url || `Imported Monitor ${idx + 1}`,
          url: item.url || item.website_url || item.hostname || "",
          type,
          interval: 60,
          selected: true,
        };
      });

      return { success: true, monitors: normalized };
    } catch {
      // Fallback to CSV
    }
  }

  // Parse CSV
  try {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { success: false, error: "Empty CSV content." };

    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes("url") || firstLine.includes("name");
    const startIndex = hasHeader ? 1 : 0;

    const normalized: NormalizedImportMonitor[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length === 0) continue;

      let name = parts[0];
      let url = parts[1] || parts[0];
      let type: "HTTP" | "PING" | "PORT" = "HTTP";

      if (parts.length >= 3) {
        const rawType = parts[2].toUpperCase();
        if (rawType.includes("PING")) type = "PING";
        else if (rawType.includes("PORT") || rawType.includes("TCP")) type = "PORT";
      }

      if (url.startsWith("http://") || url.startsWith("https://") || url.includes(".")) {
        normalized.push({
          name: name || url,
          url,
          type,
          interval: 60,
          selected: true,
        });
      }
    }

    if (normalized.length === 0) {
      return {
        success: false,
        error: "Could not detect valid monitor URLs in CSV/JSON data.",
      };
    }

    return { success: true, monitors: normalized };
  } catch (e: any) {
    return {
      success: false,
      error: "Failed to parse CSV/JSON format: " + e.message,
    };
  }
}

/**
 * Regional Monitoring Service
 *
 * Performs HTTP checks from multiple regions using free proxy services.
 * No paid Cloudflare plan required.
 */

import { isPrivateOrInternalUrl } from "@pulseguard/core";

export interface RegionalCheckResult {
  region: string;
  status: "UP" | "DOWN";
  latency: number;
  timestamp: Date;
  errorReason?: string | undefined;
}

export interface Monitor {
  id: string;
  url: string;
  timeout: number;
  checkRegions?: string | null;
  method?: string;
  headers?: string | null;
  body?: string | null;
}

/**
 * Perform a check from a specific region
 * Uses Cloudflare's global network - the Worker will execute from the nearest edge location
 */
async function checkFromRegion(monitor: Monitor, region: string): Promise<RegionalCheckResult> {
  const start = Date.now();
  const timeout = monitor.timeout;

  try {
    const method = monitor.method || "GET";
    const userHeaders: Record<string, string> = {};

    if (monitor.headers) {
      try {
        const parsed = JSON.parse(monitor.headers);
        if (Array.isArray(parsed)) {
          parsed.forEach((h: { key: string; value: string }) => {
            if (h.key) userHeaders[h.key] = h.value;
          });
        }
      } catch (e) {
        console.error(`[Regional:${region}] Failed to parse headers:`, e);
      }
    }

    let currentUrl = monitor.url;
    let response: Response | null = null;
    let hops = 0;
    const maxHops = 5;

    while (hops < maxHops) {
      const ssrfCheck = isPrivateOrInternalUrl(currentUrl);
      if (ssrfCheck.isForbidden) {
        return {
          region,
          status: "DOWN",
          latency: Date.now() - start,
          timestamp: new Date(),
          errorReason: `SSRF_PROTECTION: ${ssrfCheck.reason || "Forbidden target URL or redirect target"}`,
        };
      }

      response = await fetch(currentUrl, {
        method: hops === 0 ? method : "GET",
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PulseGuard/1.0; +https://pulseguard.io/bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          ...userHeaders,
        },
        body: hops === 0 && ["POST", "PUT", "PATCH"].includes(method) ? (monitor.body ?? null) : null,
        signal: AbortSignal.timeout(timeout * 1000),
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).href;
        hops++;
        continue;
      }

      break;
    }

    if (!response) {
      return {
        region,
        status: "DOWN",
        latency: Date.now() - start,
        timestamp: new Date(),
        errorReason: "TOO_MANY_REDIRECTS: Exceeded maximum redirect hop count of 5",
      };
    }

    // CRITICAL: Consume body to prevent deadlock
    await response.text();

    const latency = Date.now() - start;

    // Treat 2xx, 3xx as UP — healthy responses
    // Treat 429 (Too Many Requests) as UP — the server is alive and responding,
    // it's just rate-limiting our IP. This is NOT a real outage.
    // Treat 403 (Forbidden) as UP — server is alive but blocking our monitoring IP/UA.
    // Very common for Google, CDN-protected sites. A 403 is NOT a service outage.
    const statusNum = Number(response.status);
    const isRateLimited = statusNum === 429;
    const isIPBlocked = statusNum === 403;
    const isHealthy =
      response.ok || (statusNum >= 300 && statusNum < 400) || isRateLimited || isIPBlocked;

    return {
      region,
      status: isHealthy ? "UP" : "DOWN",
      latency,
      timestamp: new Date(),
      errorReason: isRateLimited
        ? undefined // 429 = alive, suppress error
        : isHealthy
          ? undefined
          : `HTTP ${response.status}`,
    };
  } catch (error) {
    const latency = Date.now() - start;

    return {
      region,
      status: "DOWN",
      latency,
      timestamp: new Date(),
      errorReason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Perform checks from all configured regions for a monitor
 */
export async function performRegionalChecks(monitor: Monitor): Promise<RegionalCheckResult[]> {
  // Parse selected regions
  let regions: string[] = [];

  if (monitor.checkRegions) {
    try {
      regions = JSON.parse(monitor.checkRegions);
    } catch (e) {
      console.error("Failed to parse checkRegions:", e);
      regions = [];
    }
  }

  // If no regions selected, perform single check (default behavior)
  if (regions.length === 0) {
    const result = await checkFromRegion(monitor, "default");
    return [result];
  }

  // CLOUDFLARE FREE PLAN: Hard cap at 3 regions maximum.
  // Each region = 1 fetch subrequest. Cloudflare Free allows 50 subrequests per invocation.
  // A single check invocation also does: DB reads, DB writes, multi-vector retries (3 more fetches),
  // proxy mesh calls, latency aggregator DO calls, and processes multiple monitors at once.
  // Running 10 regions = 10 fetches + all overhead = consistently blows the 50 subrequest budget.
  // 3 regions is the safe sweet spot: meaningful multi-region signal, stays well within budget.
  const MAX_REGIONS = 3;
  if (regions.length > MAX_REGIONS) {
    console.warn(
      `[Regional] Monitor has ${regions.length} regions but capping to ${MAX_REGIONS} to avoid exceeding Cloudflare subrequest limits.`,
    );
    regions = regions.slice(0, MAX_REGIONS);
  }

  // Run regions sequentially with a delay between each.
  // Even small parallel bursts to the same target (google.com) from the same Cloudflare
  // edge IP trigger HTTP 429 rate-limiting — running them sequentially avoids this entirely.
  const results: RegionalCheckResult[] = [];
  const BATCH_SIZE = 2;
  const BATCH_DELAY_MS = 400; // Enough spread to avoid rate-limiting on sensitive sites

  for (let i = 0; i < regions.length; i += BATCH_SIZE) {
    if (i > 0) {
      // Brief pause between batches to avoid triggering rate-limits
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
    const batch = regions.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map((region) => checkFromRegion(monitor, region));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Get the overall status from regional checks using multi-region consensus.
 * Requires majority of regions to agree on DOWN status before declaring an incident,
 * preventing single-region network glitches from firing false alarms.
 */
export function getOverallStatus(results: RegionalCheckResult[]): "UP" | "DOWN" {
  if (results.length === 0) return "UP";
  if (results.length === 1) return results[0]?.status === "DOWN" ? "DOWN" : "UP";

  const downCount = results.filter((r) => r.status === "DOWN").length;
  // Require at least 2 regions or > 50% of total regions to be DOWN for consensus
  const consensusThreshold = Math.max(2, Math.ceil(results.length / 2));
  return downCount >= consensusThreshold ? "DOWN" : "UP";
}

/**
 * Get average latency across all regions
 */
export function getAverageLatency(results: RegionalCheckResult[]): number {
  const upResults = results.filter((r) => r.status === "UP");
  if (upResults.length === 0) return 0;

  const total = upResults.reduce((sum, r) => sum + r.latency, 0);
  return Math.round(total / upResults.length);
}

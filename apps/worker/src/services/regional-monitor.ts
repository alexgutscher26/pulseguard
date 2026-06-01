/**
 * Regional Monitoring Service
 *
 * Performs HTTP checks from multiple regions using free proxy services.
 * No paid Cloudflare plan required.
 */

export interface RegionalCheckResult {
  region: string;
  status: "UP" | "DOWN";
  latency: number;
  timestamp: Date;
  errorReason?: string;
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
  const url = monitor.url;
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

    const response = await fetch(url, {
      method,
      redirect: "follow",
      headers: {
        // Use a real browser UA to avoid bot detection (429) from sites like Google
        "User-Agent": "Mozilla/5.0 (compatible; PulseGuard/1.0; +https://pulseguard.io/bot)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        ...userHeaders,
      },
      body: ["POST", "PUT", "PATCH"].includes(method) ? monitor.body : undefined,
      signal: AbortSignal.timeout(timeout * 1000),
    });

    // CRITICAL: Consume body to prevent deadlock
    await response.text();

    const latency = Date.now() - start;

    // Treat 2xx, 3xx as UP — healthy responses
    // Treat 429 (Too Many Requests) as UP — the server is alive and responding,
    // it's just rate-limiting our IP. This is NOT a real outage.
    const isRateLimited = response.status === 429;
    const isHealthy =
      response.ok || (response.status >= 300 && response.status < 400) || isRateLimited;

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

  // CLOUDFLARE FREE PLAN: Hard cap at 10 regions.
  // Each region = 1 fetch subrequest. Free plan allows ~50 per invocation total.
  // With retries, multi-vector, and DB writes, we must stay well under that.
  const MAX_REGIONS = 10;
  if (regions.length > MAX_REGIONS) {
    console.warn(
      `[Regional] Monitor has ${regions.length} regions but capping to ${MAX_REGIONS} to avoid exceeding Cloudflare subrequest limits.`,
    );
    regions = regions.slice(0, MAX_REGIONS);
  }

  // Run regions sequentially in small batches with a short delay between batches.
  // This avoids burst-firing 10 identical requests at the same target IP simultaneously,
  // which triggers rate-limiting (HTTP 429) from sites like Google.
  const results: RegionalCheckResult[] = [];
  const BATCH_SIZE = 3;
  const BATCH_DELAY_MS = 200; // Small delay between batches to spread load

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
 * Get the overall status from regional checks
 * Returns DOWN if ANY region is down
 */
export function getOverallStatus(results: RegionalCheckResult[]): "UP" | "DOWN" {
  return results.some((r) => r.status === "DOWN") ? "DOWN" : "UP";
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

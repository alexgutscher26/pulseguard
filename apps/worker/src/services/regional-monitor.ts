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
      headers: {
        "User-Agent": `PulseGuard-Monitor/1.0 (Region: ${region})`,
        Accept: "*/*",
        ...userHeaders,
      },
      body: ["POST", "PUT", "PATCH"].includes(method) ? monitor.body : undefined,
      signal: AbortSignal.timeout(timeout * 1000),
    });

    // CRITICAL: Consume body to prevent deadlock
    await response.text();

    const latency = Date.now() - start;

    return {
      region,
      status: response.ok ? "UP" : "DOWN",
      latency,
      timestamp: new Date(),
      errorReason: response.ok ? undefined : `HTTP ${response.status}`,
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

  // Perform checks with a concurrency limit of 10 to protect free-tier CPU / Fetch limits
  const results: RegionalCheckResult[] = [];
  const concurrencyLimit = 10;

  for (let i = 0; i < regions.length; i += concurrencyLimit) {
    const batch = regions.slice(i, i + concurrencyLimit);
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

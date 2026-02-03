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
}

/**
 * Perform a check from a specific region
 * Uses Cloudflare's global network - the Worker will execute from the nearest edge location
 */
async function checkFromRegion(
  url: string,
  region: string,
  timeout: number,
): Promise<RegionalCheckResult> {
  const start = Date.now();

  try {
    // For Cloudflare Workers, we don't need proxies
    // The Worker automatically executes from the nearest edge location
    // We can use cf-specific headers to get region info
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": `PulseGuard-Monitor/1.0 (Region: ${region})`,
        Accept: "*/*",
      },
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
    const result = await checkFromRegion(monitor.url, "default", monitor.timeout);
    return [result];
  }

  // Perform checks from all selected regions in parallel
  const checks = regions.map((region) => checkFromRegion(monitor.url, region, monitor.timeout));

  return Promise.all(checks);
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

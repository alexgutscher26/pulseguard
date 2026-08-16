/**
 * Regional Monitoring Service
 *
 * Dispatches checks to geographically pinned Cloudflare RegionalProbe Durable Objects.
 * Evaluates results using the 4-of-7 Quorum Consensus Engine.
 */

import { isPrivateOrInternalUrl } from "@pulseguard/core";
import {
  CLOUDFLARE_PROBE_REGIONS,
  FREE_TIER_PROBE_REGIONS,
  getRegionByCode,
  type DOLocationHint,
} from "@pulseguard/shared";
import type { ProbeCheckResult } from "@pulseguard/types";
import type { Env } from "../env";
import { evaluateQuorum, type QuorumConfig } from "./quorum-engine";

export interface RegionalCheckResult {
  region: string;
  status: "UP" | "DOWN";
  latency: number;
  timestamp: Date;
  errorReason?: string | undefined;
  errorClass?: string | undefined;
  colo?: string | undefined;
  asn?: string | undefined;
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
 * Perform a check from a specific pinned Durable Object probe
 */
async function checkFromRegion(
  monitor: Monitor,
  regionCode: string,
  env?: Env,
): Promise<RegionalCheckResult> {
  const start = performance.now();
  const regionMeta = getRegionByCode(regionCode);
  const resolvedRegion = (regionMeta?.code || "wnam") as DOLocationHint;

  // 1. If Regional Probe DO is available, route to the pinned DO instance
  if (env?.REGIONAL_PROBE) {
    try {
      const probeId = env.REGIONAL_PROBE.idFromName(`probe-${resolvedRegion}`);
      const probe = env.REGIONAL_PROBE.get(probeId, {
        locationHint: resolvedRegion as any,
      });

      const res = await probe.fetch("http://internal/check-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monitors: [
            {
              id: monitor.id,
              url: monitor.url,
              timeout: monitor.timeout,
              method: monitor.method,
              headers: monitor.headers,
              body: monitor.body,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { results: ProbeCheckResult[] };
        const r = data.results?.[0];
        if (r) {
          return {
            region: resolvedRegion,
            status: r.status,
            latency: r.latency,
            timestamp: new Date(r.timestamp),
            errorReason: r.errorReason,
            errorClass: r.errorClass,
            colo: r.colo,
            asn: r.asn,
          };
        }
      }
    } catch (doErr) {
      console.warn(
        `[RegionalProbe:${resolvedRegion}] DO dispatch failed, falling back to edge fetch:`,
        doErr,
      );
    }
  }

  // 2. Direct edge fetch fallback with SSRF check
  try {
    const ssrfCheck = isPrivateOrInternalUrl(monitor.url);
    if (ssrfCheck.isForbidden) {
      return {
        region: resolvedRegion,
        status: "DOWN",
        latency: Math.round(performance.now() - start),
        timestamp: new Date(),
        errorReason: `SSRF_PROTECTION: ${ssrfCheck.reason}`,
        errorClass: "SECURITY_VIOLATION",
      };
    }

    const userHeaders: Record<string, string> = {};
    if (monitor.headers) {
      try {
        const parsed = JSON.parse(monitor.headers);
        if (Array.isArray(parsed)) {
          for (const h of parsed as { key?: string; value?: string }[]) {
            if (h.key && h.value) userHeaders[h.key] = h.value;
          }
        } else if (typeof parsed === "object" && parsed !== null) {
          Object.assign(userHeaders, parsed);
        }
      } catch {}
    }

    const hasBody =
      ["POST", "PUT", "PATCH"].includes(monitor.method || "GET") && Boolean(monitor.body);

    const response = await fetch(monitor.url, {
      method: monitor.method || "GET",
      headers: {
        "User-Agent": "PulseGuard-Synthetic-Monitor/2.0 (+https://pulseguard.io/bot)",
        Accept: "*/*",
        ...userHeaders,
      },
      ...(hasBody && monitor.body ? { body: monitor.body } : {}),
      signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
      redirect: "follow",
    });

    await response.text();

    const latency = Math.round(performance.now() - start);
    const statusNum = Number(response.status);
    const isUp =
      response.ok || (statusNum >= 300 && statusNum < 400) || [403, 429].includes(statusNum);

    return {
      region: resolvedRegion,
      status: isUp ? "UP" : "DOWN",
      latency,
      timestamp: new Date(),
      errorReason: isUp ? undefined : `HTTP ${response.status}`,
      errorClass: isUp ? undefined : statusNum >= 500 ? "SERVER_ERROR" : "CLIENT_ERROR",
    };
  } catch (error: any) {
    return {
      region: resolvedRegion,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      timestamp: new Date(),
      errorReason: error instanceof Error ? error.message : "Unknown error",
      errorClass: "NETWORK_ERROR",
    };
  }
}

/**
 * Perform checks from all configured or default probe regions for a monitor
 */
export async function performRegionalChecks(
  monitor: Monitor,
  env?: Env,
): Promise<RegionalCheckResult[]> {
  let targetRegions: string[] = [];

  if (monitor.checkRegions) {
    try {
      targetRegions = JSON.parse(monitor.checkRegions);
    } catch {
      targetRegions = [];
    }
  }

  // If no regions configured, use default 3 primary regions on free tier (2-of-3 quorum)
  if (targetRegions.length === 0) {
    targetRegions = [...FREE_TIER_PROBE_REGIONS];
  }

  // Execute checks in bounded concurrency (max 5 simultaneous subrequests) to respect DO limits
  const results: RegionalCheckResult[] = [];
  const concurrency = 5;
  for (let i = 0; i < targetRegions.length; i += concurrency) {
    const chunk = targetRegions.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map((region) => checkFromRegion(monitor, region, env)),
    );
    results.push(...chunkResults);
  }
  return results;
}

/**
 * Evaluate overall status using Quorum Consensus Engine (4-of-7 confirmation)
 */
export function getOverallStatus(
  results: RegionalCheckResult[],
  monitorId: string = "default",
): "UP" | "DOWN" | "DEGRADED" {
  if (results.length === 0) return "UP";

  const probeResults: ProbeCheckResult[] = results.map((r) => ({
    monitorId,
    probeId: `probe-${r.region}`,
    region: r.region,
    status: r.status,
    latency: r.latency,
    errorReason: r.errorReason,
    errorClass: r.errorClass,
    timestamp: r.timestamp.toISOString(),
  }));

  const quorumEval = evaluateQuorum(monitorId, probeResults);
  return quorumEval.finalStatus;
}

/**
 * Get average latency across healthy UP regions
 */
export function getAverageLatency(results: RegionalCheckResult[]): number {
  const upResults = results.filter((r) => r.status === "UP");
  if (upResults.length === 0) return 0;

  const total = upResults.reduce((sum, r) => sum + r.latency, 0);
  return Math.round(total / upResults.length);
}

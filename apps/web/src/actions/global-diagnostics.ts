"use server";

import { isPrivateOrInternalUrl } from "@pulseguard/core";

export interface GlobalpingProbeResult {
  city: string;
  country: string;
  continent: string;
  flag: string;
  asn: string;
  network: string;
  latencyMs: number;
  dnsMs?: number;
  tlsMs?: number;
  statusCode?: number;
  status: "OK" | "SLOW" | "FAILED";
  resolvedIp?: string;
  error?: string;
}

export interface GlobalpingDiagnosticReport {
  target: string;
  timestamp: string;
  totalProbes: number;
  successfulProbes: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  results: GlobalpingProbeResult[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  CA: "🇨🇦",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  NL: "🇳🇱",
  PL: "🇵🇱",
  JP: "🇯🇵",
  SG: "🇸🇬",
  AU: "🇦🇺",
  IN: "🇮🇳",
  BR: "🇧🇷",
  ZA: "🇿🇦",
  AE: "🇦🇪",
  KR: "🇰🇷",
  SE: "🇸🇪",
  ES: "🇪🇸",
  IT: "🇮🇹",
  IE: "🇮🇪",
};

/**
 * Execute ad-hoc, on-demand global latency and reachability test via Globalping API.
 * This is strictly used for manual troubleshooting, while automated critical alerts
 * remain 100% on PulseGuard's deterministic pinned RegionalProbe mesh.
 */
export async function runGlobalpingDiagnostics(targetUrl: string): Promise<{
  success: boolean;
  data?: GlobalpingDiagnosticReport;
  error?: string;
}> {
  try {
    if (!targetUrl) {
      return { success: false, error: "Target URL is required" };
    }

    const ssrfCheck = isPrivateOrInternalUrl(targetUrl);
    if (ssrfCheck.isForbidden) {
      return {
        success: false,
        error: `Diagnostics prohibited for internal targets: ${ssrfCheck.reason}`,
      };
    }

    let hostname = targetUrl.trim();
    let protocol: "HTTP" | "HTTPS" = "HTTPS";
    let port: number | undefined;
    let path = "/";
    let query: string | undefined;

    try {
      const parsed = new URL(targetUrl.includes("://") ? targetUrl : `https://${targetUrl}`);
      hostname = parsed.hostname;
      protocol = parsed.protocol === "http:" ? "HTTP" : "HTTPS";
      if (parsed.port) {
        const p = Number.parseInt(parsed.port, 10);
        if (!Number.isNaN(p)) port = p;
      }
      path = parsed.pathname || "/";
      if (parsed.search) {
        query = parsed.search.replace(/^\?/, "") || undefined;
      }
    } catch {
      hostname =
        targetUrl
          .replace(/^[a-zA-Z]+:\/\//, "")
          .split("/")[0]
          ?.split(":")[0] || targetUrl;
    }

    const measurementOptions: Record<string, any> = {
      protocol,
      request: {
        method: "HEAD",
        path: path || "/",
        ...(query ? { query } : {}),
      },
    };
    if (port) {
      measurementOptions.port = port;
    }

    const reqBody = {
      type: "http",
      target: hostname,
      locations: [
        { continent: "NA" },
        { continent: "EU" },
        { continent: "AS" },
        { continent: "OC" },
        { continent: "SA" },
        { continent: "AF" },
      ],
      measurementOptions,
      limit: 12, // Test from 12 diverse global probe vantage points
    };

    const postRes = await fetch("https://api.globalping.io/v1/measurements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PulseGuard-AdHoc-Diagnostics/2.0 (+https://pulseguard.io)",
      },
      body: JSON.stringify(reqBody),
      signal: AbortSignal.timeout(10_000),
    });

    if (!postRes.ok) {
      const errText = await postRes.text();
      return {
        success: false,
        error: `Globalping service returned HTTP ${postRes.status}: ${errText.slice(0, 150)}`,
      };
    }

    const { id } = (await postRes.json()) as { id: string };
    if (!id) {
      return {
        success: false,
        error: "Failed to allocate measurement ID from Globalping",
      };
    }

    // Poll for measurement completion (up to 8 iterations, ~12s max)
    let rawResults: any[] = [];
    let isComplete = false;

    for (let i = 0; i < 8; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const pollRes = await fetch(`https://api.globalping.io/v1/measurements/${id}`, {
        headers: {
          "User-Agent": "PulseGuard-AdHoc-Diagnostics/2.0 (+https://pulseguard.io)",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (pollRes.ok) {
        const data = (await pollRes.json()) as any;
        if (data.status === "finished" || data.status === "offline") {
          rawResults = data.results || [];
          isComplete = true;
          break;
        }
      }
    }

    if (!isComplete && rawResults.length === 0) {
      return {
        success: false,
        error: "Globalping measurement timed out waiting for probes",
      };
    }

    const probeResults: GlobalpingProbeResult[] = rawResults.map((r: any) => {
      const probe = r.probe || {};
      const result = r.result || {};
      const timings = result.timings || {};

      const totalLatency = Math.round(timings.total || result.rawOutput?.length || 0);
      const dnsTime = timings.dns ? Math.round(timings.dns) : undefined;
      const tlsTime = timings.tls ? Math.round(timings.tls) : undefined;
      const statusCode = result.statusCode || (result.status === "finished" ? 200 : undefined);
      const isOk =
        result.status === "finished" && (!statusCode || (statusCode >= 200 && statusCode < 400));
      const isSlow = totalLatency > 800;

      const countryCode = probe.country || "US";
      const flag = COUNTRY_FLAGS[countryCode] || "🌐";

      return {
        city: probe.city || "Unknown City",
        country: probe.country || "Global",
        continent: probe.continent || "NA",
        flag,
        asn: probe.asn ? `AS${probe.asn}` : "Unknown ASN",
        network: probe.network || "Public ISP",
        latencyMs: totalLatency,
        dnsMs: dnsTime,
        tlsMs: tlsTime,
        statusCode,
        status: isOk ? (isSlow ? "SLOW" : "OK") : "FAILED",
        resolvedIp: result.resolvedAddress || probe.resolvers?.[0],
        error: isOk ? undefined : result.rawOutput?.slice(0, 100) || "Probe Connection Failed",
      };
    });

    const successfulProbes = probeResults.filter((p) => p.status !== "FAILED");
    const latencies = successfulProbes.map((p) => p.latencyMs).filter((l) => l > 0);

    const averageLatencyMs =
      latencies.length > 0
        ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
        : 0;
    const minLatencyMs = latencies.length > 0 ? Math.min(...latencies) : 0;
    const maxLatencyMs = latencies.length > 0 ? Math.max(...latencies) : 0;

    return {
      success: true,
      data: {
        target: targetUrl,
        timestamp: new Date().toISOString(),
        totalProbes: probeResults.length,
        successfulProbes: successfulProbes.length,
        averageLatencyMs,
        minLatencyMs,
        maxLatencyMs,
        results: probeResults,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred executing Globalping diagnostics",
    };
  }
}

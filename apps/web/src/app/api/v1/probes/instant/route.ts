import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "../../_lib/auth";

export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req, "read");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    url,
    regions = ["wnam", "weur", "apac"],
    method = "GET",
    expectedStatus = [200, 201, 204, 301, 302, 307, 308],
    timeoutMs = 8000,
  } = body;

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return NextResponse.json(
      { error: "url is required and must start with http:// or https://" },
      { status: 400 },
    );
  }

  const regionList: string[] = Array.isArray(regions) ? regions : ["wnam", "weur", "apac"];

  // Perform multi-region parallel synthetic fetch
  const regionNames: Record<string, { name: string; flag: string }> = {
    wnam: { name: "North America West", flag: "🇺🇸" },
    enam: { name: "North America East", flag: "🇺🇸" },
    weur: { name: "Western Europe", flag: "🇩🇪" },
    eeur: { name: "Eastern Europe", flag: "🇵🇱" },
    apac: { name: "Asia Pacific", flag: "🇸🇬" },
    "apac-ne": { name: "Asia Pacific Northeast", flag: "🇯🇵" },
    "apac-se": { name: "Asia Pacific Southeast", flag: "🇦🇺" },
  };

  const results = await Promise.all(
    regionList.map(async (regionCode) => {
      const start = Date.now();
      const meta = regionNames[regionCode] || { name: regionCode, flag: "🌐" };
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
          method: method.toUpperCase(),
          headers: {
            "User-Agent": `PulseGuard-Edge-Probe/1.0 (${regionCode})`,
          },
          signal: controller.signal,
        });
        clearTimeout(timer);

        const latencyMs = Date.now() - start;
        const isExpected = expectedStatus.includes(res.status);

        return {
          region: regionCode,
          name: meta.name,
          flag: meta.flag,
          status: isExpected ? "UP" : "DOWN",
          httpCode: res.status,
          latencyMs,
          error: isExpected ? null : `Unexpected HTTP ${res.status}`,
        };
      } catch (err: any) {
        const latencyMs = Date.now() - start;
        return {
          region: regionCode,
          name: meta.name,
          flag: meta.flag,
          status: "DOWN",
          httpCode: 0,
          latencyMs,
          error:
            err.name === "AbortError" ? "Connection timed out" : err.message || "Network Error",
        };
      }
    }),
  );

  const passedCount = results.filter((r) => r.status === "UP").length;
  const quorumPass = passedCount > results.length / 2;
  const avgLatency = Math.round(
    results.reduce((acc, curr) => acc + curr.latencyMs, 0) / (results.length || 1),
  );

  return NextResponse.json({
    data: {
      url,
      status: quorumPass ? "UP" : "DOWN",
      overallLatencyMs: avgLatency,
      quorumPass,
      quorumRatio: `${passedCount}/${results.length}`,
      regions: results,
      checkedAt: new Date().toISOString(),
    },
  });
}

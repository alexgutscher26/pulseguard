export interface DNSWatchdogResult {
  domain: string;
  expectedIPs: string[];
  resolved: {
    cloudflare: string | null;
    google: string | null;
    quad9: string | null;
  };
  allResolvedIPs: string[];
  match: boolean;
  propagationAnomaly: boolean;
  anomalies: string[];
  score: number;
  grade: string;
}

interface ResolverDef {
  name: "cloudflare" | "google" | "quad9";
  url: (hostname: string) => string;
  headers: Record<string, string>;
  parse: (data: any) => string | null;
}

const RESOLVERS: ResolverDef[] = [
  {
    name: "cloudflare",
    url: (hostname: string) =>
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
    headers: { accept: "application/dns-json" },
    parse: (data: any) => {
      if (data.Status === 0 && data.Answer) {
        const a = data.Answer.find((r: any) => r.type === 1);
        return a ? a.data : null;
      }
      return null;
    },
  },
  {
    name: "google",
    url: (hostname: string) =>
      `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`,
    headers: { accept: "application/dns-json" },
    parse: (data: any) => {
      if (data.Status === 0 && data.Answer) {
        const a = data.Answer.find((r: any) => r.type === 1);
        return a ? a.data : null;
      }
      return null;
    },
  },
  {
    name: "quad9",
    url: (hostname: string) =>
      `https://dns.quad9.net:5053/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
    headers: { accept: "application/dns-json" },
    parse: (data: any) => {
      if (data.Status === 0 && data.Answer) {
        const a = data.Answer.find((r: any) => r.type === 1);
        return a ? a.data : null;
      }
      return null;
    },
  },
];

async function queryResolver(
  resolver: ResolverDef,
  hostname: string,
): Promise<string | null> {
  try {
    const response = await fetch(resolver.url(hostname), {
      headers: resolver.headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data: any = await response.json();
    return resolver.parse(data);
  } catch {
    return null;
  }
}

export async function checkDNSWatchdog(
  domain: string,
  expectedIPs: string[] = [],
): Promise<DNSWatchdogResult> {
  const hostname = (domain.replace(/^https?:\/\//, "").split("/")[0] || "").split(":")[0] || domain;

  const resolvedPromises = RESOLVERS.map((r) => queryResolver(r, hostname));
  const results = await Promise.all(resolvedPromises);

  const resolved: DNSWatchdogResult["resolved"] = {
    cloudflare: results[0] ?? null,
    google: results[1] ?? null,
    quad9: results[2] ?? null,
  };

  const allResolvedIPs = [...new Set(results.filter((r): r is string => r !== null))];

  const anomalies: string[] = [];

  const uniqueIPs = [...new Set(results.filter(Boolean))];
  const propagationAnomaly = uniqueIPs.length > 1;
  if (propagationAnomaly) {
    anomalies.push(
      `Propagation anomaly: resolvers returned inconsistent IPs (${uniqueIPs.join(", ")})`,
    );
  }

  let match = false;
  if (expectedIPs.length > 0) {
    match = allResolvedIPs.some((ip) => expectedIPs.includes(ip));
    if (!match) {
      anomalies.push(
        `Expected IP${expectedIPs.length > 1 ? "s" : ""} ${expectedIPs.join(", ")} but resolved to ${allResolvedIPs.join(", ") || "nothing"}`,
      );
    }
  }

  const failedResolvers = RESOLVERS.filter((_, i) => results[i] === null).map((r) => r.name);
  if (failedResolvers.length > 0) {
    anomalies.push(`Resolver${failedResolvers.length > 1 ? "s" : ""} ${failedResolvers.join(", ")} failed to resolve`);
  }

  if (allResolvedIPs.length === 0) {
    anomalies.push("Domain does not resolve from any resolver");
  }

  let score = 100;

  if (failedResolvers.length > 0) score -= 15 * failedResolvers.length;
  if (propagationAnomaly) score -= 25;
  if (expectedIPs.length > 0 && !match) score -= 30;
  if (allResolvedIPs.length === 0) score -= 50;

  score = Math.max(0, Math.min(100, score));

  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  return {
    domain: hostname,
    expectedIPs,
    resolved,
    allResolvedIPs,
    match,
    propagationAnomaly,
    anomalies,
    score,
    grade,
  };
}

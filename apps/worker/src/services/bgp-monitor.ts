export interface BGPExpectation {
  expectedAsn?: number;
  expectedPrefix?: string;
}

export interface BGPASPathEntry {
  asn: number;
  name: string;
  country: string;
}

export interface BGPRouteInfo {
  prefix: string;
  originAsns: number[];
  asPath: BGPASPathEntry[];
  rirCountry: string;
  rirAllocationDate: string;
  description: string;
}

export interface BGPRouteResult {
  domain: string;
  resolvedIp: string | null;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  route: BGPRouteInfo | null;
  multipleOrigins: boolean;
  originCount: number;
  expectedAsnMatch: boolean;
  prefixHijackRisk: boolean;
  anomalies: string[];
  score: number;
  grade: string;
}

interface BGPViewIPResponse {
  status: string;
  data?: {
    ip: string;
    ptr_record?: string;
    prefixes?: Array<{
      prefix: string;
      ip: string;
      cidr: number;
      asn: {
        asn: number;
        name: string;
        description: string;
        country: string;
        country_name: string;
      };
      name: string;
      description: string;
      country: string;
      country_name: string;
      rir_allocation_date: string;
      rir_country: string;
    }>;
    rir_allocation?: {
      rir_name: string;
      country: string;
      date: string;
    };
  };
}

interface BGPViewPrefixResponse {
  status: string;
  data?: {
    prefix: string;
    rir: {
      rir_name: string;
      country: string;
      date: string;
    };
    related_prefixes: Array<{
      prefix: string;
      rir_country: string;
      rir_date: string;
      rir_name: string;
    }>;
    asns: Array<{
      asn: number;
      name: string;
      description: string;
      country: string;
      country_name: string;
    }>;
  };
}

function extractHostname(domain: string): string {
  return (domain.replace(/^https?:\/\//, "").split("/")[0] || "").split(":")[0] || domain;
}

async function resolveToIP(hostname: string): Promise<string | null> {
  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`;
    const response = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data: any = await response.json();
    if (data.Status === 0 && data.Answer) {
      const a = data.Answer.find((r: any) => r.type === 1);
      return a ? a.data : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchBGPViewIP(ip: string): Promise<BGPViewIPResponse | null> {
  try {
    const response = await fetch(`https://api.bgpview.io/ip/${ip}`, {
      headers: { Accept: "application/json", "User-Agent": "PulseGuard-BGP-Monitor/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    return response.json() as Promise<BGPViewIPResponse | null>;
  } catch {
    return null;
  }
}

async function fetchBGPViewPrefix(prefix: string): Promise<BGPViewPrefixResponse | null> {
  try {
    const response = await fetch(`https://api.bgpview.io/prefix/${prefix}`, {
      headers: { Accept: "application/json", "User-Agent": "PulseGuard-BGP-Monitor/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    return response.json() as Promise<BGPViewPrefixResponse | null>;
  } catch {
    return null;
  }
}

async function fetchRIPEVisibility(ip: string): Promise<number | null> {
  // Check how many RIPE RIS collectors see this IP's route
  try {
    const response = await fetch(
      `https://stat.ripe.net/data/routing-status/data.json?resource=${ip}`,
      {
        headers: { Accept: "application/json", "User-Agent": "PulseGuard-BGP-Monitor/1.0" },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) return null;
    const data: any = await response.json();
    return data.data?.routing_count ?? null;
  } catch {
    return null;
  }
}

export async function checkBGPTRoute(
  domain: string,
  expectation?: BGPExpectation,
): Promise<BGPRouteResult> {
  const start = performance.now();
  const hostname = extractHostname(domain);

  const anomalies: string[] = [];

  // 1. Resolve domain to IP
  const resolvedIp = await resolveToIP(hostname);
  if (!resolvedIp) {
    return {
      domain: hostname,
      resolvedIp: null,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      errorReason: "DNS_RESOLUTION_FAILED",
      route: null,
      multipleOrigins: false,
      originCount: 0,
      expectedAsnMatch: false,
      prefixHijackRisk: false,
      anomalies: ["Failed to resolve domain to IP"],
      score: 0,
      grade: "F",
    };
  }

  // 2. Look up IP in BGPView
  const ipData = await fetchBGPViewIP(resolvedIp);
  if (!ipData || ipData.status !== "OK" || !ipData.data) {
    return {
      domain: hostname,
      resolvedIp,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      errorReason: "BGP_LOOKUP_FAILED",
      route: null,
      multipleOrigins: false,
      originCount: 0,
      expectedAsnMatch: false,
      prefixHijackRisk: false,
      anomalies: ["Failed to retrieve BGP route information"],
      score: 0,
      grade: "F",
    };
  }

  const prefixes = ipData.data.prefixes || [];
  const rirAlloc = ipData.data.rir_allocation;

  if (prefixes.length === 0) {
    return {
      domain: hostname,
      resolvedIp,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      errorReason: "NO_BGP_PREFIX",
      route: null,
      multipleOrigins: false,
      originCount: 0,
      expectedAsnMatch: false,
      prefixHijackRisk: false,
      anomalies: ["IP address has no BGP prefix announcements"],
      score: 0,
      grade: "F",
    };
  }

  const sortedPrefixes = [...prefixes].sort((a, b) => {
    const aLen = parseInt(a.prefix.split("/")[1] || "0", 10);
    const bLen = parseInt(b.prefix.split("/")[1] || "0", 10);
    return bLen - aLen;
  });
  const bestPrefix = sortedPrefixes[0]!;

  const route: BGPRouteInfo = {
    prefix: bestPrefix.prefix,
    originAsns: [bestPrefix.asn.asn],
    asPath: [
      {
        asn: bestPrefix.asn.asn,
        name: bestPrefix.asn.name,
        country: bestPrefix.asn.country,
      },
    ],
    rirCountry: rirAlloc?.country || bestPrefix.asn.country,
    rirAllocationDate: rirAlloc?.date || "",
    description: bestPrefix.description || bestPrefix.asn.description,
  };

  // 3. Check for multiple origin ASes (potential hijack)
  const uniqueOriginAsns = [...new Set(prefixes.map((p) => p.asn.asn))];
  const multipleOrigins = uniqueOriginAsns.length > 1;
  if (multipleOrigins) {
    anomalies.push(
      `Multiple origin ASes detected: ${uniqueOriginAsns.join(", ")} — possible MOAS attack or multihoming`,
    );
  }

  // 4. Check for more-specific prefixes (potential hijack)
  const prefixParts = bestPrefix.prefix.split("/");
  const prefixLen = parseInt(prefixParts[1] || "0", 10);
  const prefixHijackRisk = prefixLen >= 24;
  if (prefixHijackRisk && prefixLen >= 24) {
    // Very specific prefixes (> /24 for IPv4) may indicate hijacking
    anomalies.push(`Highly specific prefix (/${prefixLen}) — verify this is intentional`);
  }

  // 5. Check against expected ASN/prefix
  let expectedAsnMatch = true;
  if (expectation?.expectedAsn) {
    expectedAsnMatch = uniqueOriginAsns.includes(expectation.expectedAsn);
    if (!expectedAsnMatch) {
      anomalies.push(
        `Origin AS changed: expected AS${expectation.expectedAsn}, found AS${uniqueOriginAsns.join(", ")}`,
      );
    }
  }

  if (expectation?.expectedPrefix) {
    if (route.prefix !== expectation.expectedPrefix) {
      anomalies.push(
        `Prefix changed: expected ${expectation.expectedPrefix}, found ${route.prefix}`,
      );
    }
  }

  // 6. Check route visibility via RIPE RIS
  const visibilityCount = await fetchRIPEVisibility(resolvedIp);
  if (visibilityCount !== null && visibilityCount < 5) {
    anomalies.push(`Limited route visibility: seen by only ${visibilityCount} RIPE RIS collectors`);
  }

  const latency = Math.round(performance.now() - start);

  // Score calculation
  let score = 100;
  if (multipleOrigins) score -= 30;
  if (prefixHijackRisk && prefixLen >= 27) score -= 25;
  else if (prefixHijackRisk) score -= 10;
  if (!expectedAsnMatch) score -= 35;
  if (visibilityCount !== null && visibilityCount < 3) score -= 20;
  else if (visibilityCount !== null && visibilityCount < 5) score -= 10;

  score = Math.max(0, Math.min(100, score));

  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  const status = anomalies.length === 0 ? "UP" : "DOWN";

  return {
    domain: hostname,
    resolvedIp,
    status,
    latency,
    errorReason: status === "DOWN" ? anomalies.join("; ") : undefined,
    route,
    multipleOrigins,
    originCount: uniqueOriginAsns.length,
    expectedAsnMatch,
    prefixHijackRisk,
    anomalies,
    score,
    grade,
  };
}

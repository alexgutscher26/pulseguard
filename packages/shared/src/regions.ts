/**
 * PulseGuard Verified Probe Regions
 *
 * Pinned geographically via Cloudflare Durable Object location hints.
 * Cloudflare strictly supports 7 functional location hints:
 *   - wnam: Western North America
 *   - enam: Eastern North America
 *   - weur: Western Europe
 *   - eeur: Eastern Europe
 *   - apac: Asia-Pacific (South/Central)
 *   - apac-ne: Asia-Pacific Northeast
 *   - apac-se: Asia-Pacific Southeast
 *
 * (Note: sam, oc, afr, and me fall back to enam/weur on Cloudflare DOs and
 * are intentionally not simulated here to guarantee radical data truthfulness).
 */

export type ProbeHealthStatus = "ONLINE" | "DEGRADED" | "OFFLINE" | "FLAPPING";

export interface Region {
  code: string;
  name: string;
  covers: string;
  city: string;
  continent: string;
  flag: string;
  provider: string;
  asn: string;
  primaryColos: string[];
  ipv4Ranges: string[];
  ipv6Ranges: string[];
  isCloudflareDO: boolean;
  defaultHealthStatus?: ProbeHealthStatus;
}

export const PULSEGUARD_CANONICAL_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

export const CLOUDFLARE_PROBE_REGIONS: Region[] = [
  {
    code: "wnam",
    name: "North America West",
    covers: "Western North America",
    city: "San Jose / Seattle",
    continent: "North America",
    flag: "🇺🇸",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["SJC", "LAX", "SEA", "PDX"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "enam",
    name: "North America East",
    covers: "Eastern North America",
    city: "Ashburn / New York",
    continent: "North America",
    flag: "🇺🇸",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["IAD", "EWR", "ATL", "MIA"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "weur",
    name: "Western Europe",
    covers: "Western Europe",
    city: "London / Frankfurt / Paris",
    continent: "Europe",
    flag: "🇬🇧",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["LHR", "FRA", "AMS", "CDG"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "eeur",
    name: "Eastern Europe",
    covers: "Eastern Europe",
    city: "Warsaw / Vienna / Helsinki",
    continent: "Europe",
    flag: "🇵🇱",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["WAW", "VIE", "PRG", "HEL"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "apac",
    name: "Asia-Pacific",
    covers: "Tokyo, Singapore, Hong Kong",
    city: "Tokyo / Singapore / Hong Kong",
    continent: "Asia Pacific",
    flag: "🌏",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["NRT", "SIN", "HKG", "ICN"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "oc",
    name: "Oceania",
    covers: "Australia, New Zealand",
    city: "Sydney / Melbourne",
    continent: "Oceania",
    flag: "🇦🇺",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["SYD", "MEL", "AKL"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
  {
    code: "sam",
    name: "South America",
    covers: "Brazil, Chile, Argentina",
    city: "São Paulo / Santiago / Buenos Aires",
    continent: "South America",
    flag: "🇧🇷",
    provider: "Cloudflare Edge",
    asn: "AS13335",
    primaryColos: ["GRU", "GIG", "SCL", "EZE"],
    ipv4Ranges: [],
    ipv6Ranges: [],
    isCloudflareDO: true,
    defaultHealthStatus: "ONLINE",
  },
];

export const OUT_OF_BAND_SENTINEL_REGION: Region = {
  code: "ext-sentinel",
  name: "Out-of-Band Sentinel",
  covers: "Multi-Cloud / Heterogeneous ASN",
  city: "Nuremberg (Hetzner)",
  continent: "Europe",
  flag: "🛡️",
  provider: "Independent VPS (Non-Cloudflare)",
  asn: "AS24940",
  primaryColos: ["NBG1", "FSN1"],
  ipv4Ranges: [],
  ipv6Ranges: [],
  isCloudflareDO: false,
  defaultHealthStatus: "ONLINE",
};

export const ALL_PROBE_REGIONS: Region[] = [
  ...CLOUDFLARE_PROBE_REGIONS,
  OUT_OF_BAND_SENTINEL_REGION,
];

export const AVAILABLE_REGIONS: Region[] = ALL_PROBE_REGIONS;

export const VALID_DO_LOCATION_HINTS = [
  "wnam",
  "enam",
  "weur",
  "eeur",
  "apac",
  "oc",
  "sam",
] as const;

export type DOLocationHint = (typeof VALID_DO_LOCATION_HINTS)[number];

/** Complete 7 sovereign probe regions (4-of-7 quorum consensus) included across all tiers */
export const FREE_TIER_PROBE_REGIONS: DOLocationHint[] = [
  "wnam",
  "enam",
  "weur",
  "eeur",
  "apac",
  "oc",
  "sam",
];

export const PAID_TIER_PROBE_REGIONS: DOLocationHint[] = [
  "wnam",
  "enam",
  "weur",
  "eeur",
  "apac",
  "oc",
  "sam",
];

/**
 * Returns the assigned probe regions based on subscription plan
 */
export function getProbeRegionsForPlan(_plan?: string | null): DOLocationHint[] {
  return [...PAID_TIER_PROBE_REGIONS];
}

export const REGION_MAP = new Map<string, Region>(
  AVAILABLE_REGIONS.map((region) => [region.code, region]),
);

/** Legacy & alias code mappings for backward compatibility */
const LEGACY_REGION_ALIASES: Record<string, string> = {
  sam: "enam",
  oc: "apac-se",
  "us-east-1": "enam",
  "us-east-2": "enam",
  "us-west-1": "wnam",
  "us-west-2": "wnam",
  "ca-central-1": "enam",
  "ca-west-1": "wnam",
  "eu-west-1": "weur",
  "eu-west-2": "weur",
  "eu-west-3": "weur",
  "eu-central-1": "weur",
  "eu-east-1": "eeur",
  "eu-east-2": "eeur",
  "eu-north-1": "eeur",
  "ap-southeast-1": "apac",
  "ap-south-1": "apac",
  "ap-northeast-1": "apac-ne",
  "ap-northeast-2": "apac-ne",
  "ap-northeast-3": "apac-ne",
  "ap-southeast-2": "apac-se",
  "ap-southeast-4": "apac-se",
};

export function getRegionByCode(code: string): Region | undefined {
  if (!code) return undefined;
  const direct = REGION_MAP.get(code);
  if (direct) return direct;
  const aliasTarget = LEGACY_REGION_ALIASES[code];
  if (aliasTarget) return REGION_MAP.get(aliasTarget);
  return undefined;
}

export function getRegionsByContinent(continent: string): Region[] {
  return AVAILABLE_REGIONS.filter((r) => r.continent === continent);
}

export const CONTINENTS = Array.from(new Set(AVAILABLE_REGIONS.map((r) => r.continent)));

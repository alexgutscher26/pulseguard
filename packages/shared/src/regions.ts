/**
 * Multi-Region Monitoring Configuration
 */

export interface Region {
  code: string;
  name: string;
  continent: string;
  flag: string;
  proxyUrl?: string; // Optional proxy endpoint for this region
}

export const AVAILABLE_REGIONS: Region[] = [
  // North America (12)
  { code: "us-east-1", name: "US East (N. Virginia)", continent: "North America", flag: "🇺🇸" },
  { code: "us-east-2", name: "US East (Ohio)", continent: "North America", flag: "🇺🇸" },
  { code: "us-west-1", name: "US West (N. California)", continent: "North America", flag: "🇺🇸" },
  { code: "us-west-2", name: "US West (Oregon)", continent: "North America", flag: "🇺🇸" },
  { code: "us-central-1", name: "US Central (Iowa)", continent: "North America", flag: "🇺🇸" },
  { code: "us-south-1", name: "US South (Texas)", continent: "North America", flag: "🇺🇸" },
  { code: "ca-central-1", name: "Canada (Toronto)", continent: "North America", flag: "🇨🇦" },
  { code: "ca-west-1", name: "Canada (Vancouver)", continent: "North America", flag: "🇨🇦" },
  { code: "mx-central-1", name: "Mexico (Querétaro)", continent: "North America", flag: "🇲🇽" },
  {
    code: "us-northeast-1",
    name: "US Northeast (New York)",
    continent: "North America",
    flag: "🇺🇸",
  },
  {
    code: "us-southeast-1",
    name: "US Southeast (Atlanta)",
    continent: "North America",
    flag: "🇺🇸",
  },
  { code: "us-mountain-1", name: "US Mountain (Denver)", continent: "North America", flag: "🇺🇸" },

  // Europe (15)
  { code: "eu-west-1", name: "Europe (Ireland)", continent: "Europe", flag: "🇮🇪" },
  { code: "eu-west-2", name: "Europe (London)", continent: "Europe", flag: "🇬🇧" },
  { code: "eu-west-3", name: "Europe (Paris)", continent: "Europe", flag: "🇫🇷" },
  { code: "eu-central-1", name: "Europe (Frankfurt)", continent: "Europe", flag: "🇩🇪" },
  { code: "eu-central-2", name: "Europe (Zurich)", continent: "Europe", flag: "🇨🇭" },
  { code: "eu-north-1", name: "Europe (Stockholm)", continent: "Europe", flag: "🇸🇪" },
  { code: "eu-south-1", name: "Europe (Milan)", continent: "Europe", flag: "🇮🇹" },
  { code: "eu-south-2", name: "Europe (Madrid)", continent: "Europe", flag: "🇪🇸" },
  { code: "eu-east-1", name: "Europe (Warsaw)", continent: "Europe", flag: "🇵🇱" },
  { code: "eu-east-2", name: "Europe (Vienna)", continent: "Europe", flag: "🇦🇹" },
  { code: "eu-benelux-1", name: "Europe (Amsterdam)", continent: "Europe", flag: "🇳🇱" },
  { code: "eu-benelux-2", name: "Europe (Brussels)", continent: "Europe", flag: "🇧🇪" },
  { code: "eu-scand-1", name: "Europe (Helsinki)", continent: "Europe", flag: "🇫🇮" },
  { code: "eu-scand-2", name: "Europe (Oslo)", continent: "Europe", flag: "🇳🇴" },
  { code: "eu-south-3", name: "Europe (Athens)", continent: "Europe", flag: "🇬🇷" },

  // Asia Pacific (12)
  { code: "ap-east-1", name: "Asia Pacific (Hong Kong)", continent: "Asia Pacific", flag: "🇭🇰" },
  {
    code: "ap-southeast-1",
    name: "Asia Pacific (Singapore)",
    continent: "Asia Pacific",
    flag: "🇸🇬",
  },
  { code: "ap-southeast-2", name: "Asia Pacific (Sydney)", continent: "Asia Pacific", flag: "🇦🇺" },
  { code: "ap-southeast-3", name: "Asia Pacific (Jakarta)", continent: "Asia Pacific", flag: "🇮🇩" },
  { code: "ap-northeast-1", name: "Asia Pacific (Tokyo)", continent: "Asia Pacific", flag: "🇯🇵" },
  { code: "ap-northeast-2", name: "Asia Pacific (Seoul)", continent: "Asia Pacific", flag: "🇰🇷" },
  { code: "ap-northeast-3", name: "Asia Pacific (Osaka)", continent: "Asia Pacific", flag: "🇯🇵" },
  { code: "ap-south-1", name: "Asia Pacific (Mumbai)", continent: "Asia Pacific", flag: "🇮🇳" },
  { code: "ap-south-2", name: "Asia Pacific (Hyderabad)", continent: "Asia Pacific", flag: "🇮🇳" },
  {
    code: "ap-southeast-4",
    name: "Asia Pacific (Melbourne)",
    continent: "Asia Pacific",
    flag: "🇦🇺",
  },
  { code: "ap-southeast-5", name: "Asia Pacific (Bangkok)", continent: "Asia Pacific", flag: "🇹🇭" },
  {
    code: "ap-southeast-6",
    name: "Asia Pacific (Ho Chi Minh)",
    continent: "Asia Pacific",
    flag: "🇻🇳",
  },

  // South America (4)
  { code: "sa-east-1", name: "South America (São Paulo)", continent: "South America", flag: "🇧🇷" },
  { code: "sa-west-1", name: "South America (Santiago)", continent: "South America", flag: "🇨🇱" },
  { code: "sa-north-1", name: "South America (Bogotá)", continent: "South America", flag: "🇨🇴" },
  {
    code: "sa-south-1",
    name: "South America (Buenos Aires)",
    continent: "South America",
    flag: "🇦🇷",
  },

  // Africa (4)
  { code: "af-south-1", name: "Africa (Cape Town)", continent: "Africa", flag: "🇿🇦" },
  { code: "af-central-1", name: "Africa (Nairobi)", continent: "Africa", flag: "🇰🇪" },
  { code: "af-west-1", name: "Africa (Lagos)", continent: "Africa", flag: "🇳🇬" },
  { code: "af-north-1", name: "Africa (Cairo)", continent: "Africa", flag: "🇪🇬" },

  // Middle East (3)
  { code: "me-south-1", name: "Middle East (Bahrain)", continent: "Middle East", flag: "🇧🇭" },
  { code: "me-central-1", name: "Middle East (Dubai)", continent: "Middle East", flag: "🇦🇪" },
  { code: "me-west-1", name: "Middle East (Tel Aviv)", continent: "Middle East", flag: "🇮🇱" },
];

export const REGION_MAP = new Map(AVAILABLE_REGIONS.map((region) => [region.code, region]));

export function getRegionByCode(code: string): Region | undefined {
  return REGION_MAP.get(code);
}

export function getRegionsByContinent(continent: string): Region[] {
  return AVAILABLE_REGIONS.filter((r) => r.continent === continent);
}

export const CONTINENTS = Array.from(new Set(AVAILABLE_REGIONS.map((r) => r.continent)));

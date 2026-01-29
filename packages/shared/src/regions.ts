/**
 * Multi-Region Monitoring Configuration
 * 
 * Uses free proxy services to simulate checks from different regions.
 * No paid Cloudflare plan required.
 */

export interface Region {
  code: string;
  name: string;
  continent: string;
  flag: string;
  proxyUrl?: string; // Optional proxy endpoint for this region
}

export const AVAILABLE_REGIONS: Region[] = [
  // North America
  {
    code: 'us-east',
    name: 'US East (Virginia)',
    continent: 'North America',
    flag: '🇺🇸',
  },
  {
    code: 'us-west',
    name: 'US West (California)',
    continent: 'North America',
    flag: '🇺🇸',
  },
  {
    code: 'ca-central',
    name: 'Canada (Toronto)',
    continent: 'North America',
    flag: '🇨🇦',
  },
  
  // Europe
  {
    code: 'eu-west',
    name: 'Europe West (Ireland)',
    continent: 'Europe',
    flag: '🇮🇪',
  },
  {
    code: 'eu-central',
    name: 'Europe Central (Frankfurt)',
    continent: 'Europe',
    flag: '🇩🇪',
  },
  {
    code: 'eu-north',
    name: 'Europe North (Stockholm)',
    continent: 'Europe',
    flag: '🇸🇪',
  },
  
  // Asia Pacific
  {
    code: 'ap-south',
    name: 'Asia Pacific (Mumbai)',
    continent: 'Asia Pacific',
    flag: '🇮🇳',
  },
  {
    code: 'ap-southeast',
    name: 'Asia Pacific (Singapore)',
    continent: 'Asia Pacific',
    flag: '🇸🇬',
  },
  {
    code: 'ap-northeast',
    name: 'Asia Pacific (Tokyo)',
    continent: 'Asia Pacific',
    flag: '🇯🇵',
  },
  {
    code: 'ap-east',
    name: 'Asia Pacific (Sydney)',
    continent: 'Asia Pacific',
    flag: '🇦🇺',
  },
  
  // South America
  {
    code: 'sa-east',
    name: 'South America (São Paulo)',
    continent: 'South America',
    flag: '🇧🇷',
  },
  
  // Africa
  {
    code: 'af-south',
    name: 'Africa (Cape Town)',
    continent: 'Africa',
    flag: '🇿🇦',
  },
];

export const REGION_MAP = new Map(
  AVAILABLE_REGIONS.map(region => [region.code, region])
);

export function getRegionByCode(code: string): Region | undefined {
  return REGION_MAP.get(code);
}

export function getRegionsByContinent(continent: string): Region[] {
  return AVAILABLE_REGIONS.filter(r => r.continent === continent);
}

export const CONTINENTS = Array.from(
  new Set(AVAILABLE_REGIONS.map(r => r.continent))
);

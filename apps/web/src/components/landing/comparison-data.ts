export type CompetitorFeature = {
  name: string;
  pulseguard: string | boolean;
  competitor1: string | boolean;
  competitor2: string | boolean;
  competitor3: string | boolean;
  isBattle?: boolean;
};

export type CompetitorInfo = {
  id: string;
  name: string;
  url: string;
  pricingUrl: string;
  description: string;
  badge?: string;
  isPrimary?: boolean;
};

export type FeatureComparisonItem = {
  category: string;
  name: string;
  description?: string;
  pulseguard: string | boolean;
  uptimerobot: string | boolean;
  checkly: string | boolean;
  betteruptime: string | boolean;
  isBattle?: boolean;
  competitor1?: string | boolean;
  competitor2?: string | boolean;
  competitor3?: string | boolean;
};

export const competitors: CompetitorInfo[] = [
  {
    id: "pulseguard",
    name: "PulseGuard",
    url: "https://pulseguard.io",
    pricingUrl: "/pricing",
    description: "Cloudflare edge-native monitoring with 1-min checks and zero false positives.",
    badge: "Recommended",
    isPrimary: true,
  },
  {
    id: "uptimerobot",
    name: "UptimeRobot",
    url: "https://uptimerobot.com",
    pricingUrl: "https://uptimerobot.com/pricing",
    description: "Popular legacy provider with 50 free monitors at 5-min check intervals.",
  },
  {
    id: "checkly",
    name: "Checkly",
    url: "https://checklyhq.com",
    pricingUrl: "https://www.checklyhq.com/pricing",
    description: "API & Playwright synthetic monitoring (10 monitors, 2-min check interval).",
  },
  {
    id: "betteruptime",
    name: "Better Uptime",
    url: "https://betteruptime.com",
    pricingUrl: "https://betterstack.com/uptime/pricing",
    description: "Modern incident management UI (10 monitors, 5-min check interval).",
  },
];

export const featureComparisons: FeatureComparisonItem[] = [
  {
    category: "Core Monitoring",
    name: "Free Check Interval",
    description: "Frequency of synthetic ping & health checks on free plan",
    pulseguard: "1 minute",
    uptimerobot: "5 minutes",
    checkly: "2 minutes",
    betteruptime: "5 minutes",
    competitor1: "5 minutes",
    competitor2: "5 minutes",
    competitor3: "1 minute",
    isBattle: true,
  },
  {
    category: "Core Monitoring",
    name: "Free Monitor Limit",
    description: "Number of active monitors allowed without paying",
    pulseguard: "50",
    uptimerobot: "50",
    checkly: "10",
    betteruptime: "10",
    competitor1: "50",
    competitor2: "10",
    competitor3: "Unlimited",
    isBattle: false,
  },
  {
    category: "Core Monitoring",
    name: "Multi-Region Checks",
    description: "Distribution of global probe locations for zero false positives",
    pulseguard: "50+ global regions",
    uptimerobot: "3 regions",
    checkly: "15 regions",
    betteruptime: "6 regions",
    competitor1: "3 regions",
    competitor2: "6 regions",
    competitor3: "Limited",
    isBattle: false,
  },
  {
    category: "Monitor Types",
    name: "SSL Certificate Monitoring",
    pulseguard: true,
    uptimerobot: true,
    checkly: true,
    betteruptime: true,
    competitor1: true,
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    category: "Monitor Types",
    name: "Port / TCP Monitoring",
    pulseguard: true,
    uptimerobot: true,
    checkly: false,
    betteruptime: true,
    competitor1: true,
    competitor2: false,
    competitor3: true,
    isBattle: false,
  },
  {
    category: "Monitor Types",
    name: "DNS Monitoring",
    pulseguard: true,
    uptimerobot: false,
    checkly: false,
    betteruptime: true,
    competitor1: false,
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    category: "Advanced Features",
    name: "Browser / Synthetic Testing",
    description: "Run real headless browser end-to-end user journeys",
    pulseguard: true,
    uptimerobot: false,
    checkly: true,
    betteruptime: false,
    competitor1: false,
    competitor2: false,
    competitor3: false,
    isBattle: false,
  },
  {
    category: "Advanced Features",
    name: "Private Probe Agents",
    description: "Deploy internal probes inside private VPCs or homelabs",
    pulseguard: true,
    uptimerobot: false,
    checkly: "Enterprise",
    betteruptime: false,
    competitor1: false,
    competitor2: "Paid",
    competitor3: true,
    isBattle: false,
  },
  /*
  {
    category: "Advanced Features",
    name: "AI Root Cause Diagnosis",
    description: "LLM-assisted stack trace & latency anomaly breakdown",
    pulseguard: true,
    uptimerobot: false,
    checkly: false,
    betteruptime: false,
    competitor1: false,
    competitor2: false,
    competitor3: false,
    isBattle: false,
  },
  */
  {
    category: "Status Pages & Alerts",
    name: "Status Page (Custom Domain)",
    pulseguard: true,
    uptimerobot: "Paid Only",
    checkly: "Paid Only",
    betteruptime: true,
    competitor1: "Paid only",
    competitor2: "Paid only",
    competitor3: true,
    isBattle: false,
  },
  {
    category: "Status Pages & Alerts",
    name: "Slack / Discord Alerts",
    pulseguard: true,
    uptimerobot: "Paid Only",
    checkly: true,
    betteruptime: true,
    competitor1: "Paid only",
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
];

export const intervalComparison = {
  pulseguard: { label: "PulseGuard Free", interval: 60, color: "bg-primary" },
  competitors: [
    { label: "UptimeRobot", interval: 300, color: "bg-red-500/60" },
    { label: "Better Uptime", interval: 300, color: "bg-yellow-500/60" },
    { label: "OpenStatus", interval: 60, color: "bg-blue-500/60" },
  ],
};

export type DowntimeScenario = {
  name: string;
  description: string;
  downtimeStart: number;
  recoveryStart: number;
  competitorLabel: string;
  competitorDetect: number;
  pulseguardLabel: string;
  pulseguardDetect: number;
};

export const downtimeScenarios: DowntimeScenario[] = [
  {
    name: "Partial Outage",
    description:
      "A single server crashes during a deployment. Takes 8 minutes to identify and roll back.",
    downtimeStart: 0,
    recoveryStart: 8,
    competitorLabel: "Competitor (5min check)",
    competitorDetect: 5,
    pulseguardLabel: "PulseGuard (3min check)",
    pulseguardDetect: 3,
  },
  {
    name: "DNS Propagation Delay",
    description:
      "DNS record changes take effect gradually. A 12-minute window where traffic hits stale records.",
    downtimeStart: 0,
    recoveryStart: 12,
    competitorLabel: "Competitor (5min check)",
    competitorDetect: 5,
    pulseguardLabel: "PulseGuard (3min check)",
    pulseguardDetect: 3,
  },
  {
    name: "Database Failover",
    description: "Primary database goes down. Replica promotion takes 15 minutes.",
    downtimeStart: 0,
    recoveryStart: 15,
    competitorLabel: "Competitor (5min check)",
    competitorDetect: 5,
    pulseguardLabel: "PulseGuard (3min check)",
    pulseguardDetect: 3,
  },
];

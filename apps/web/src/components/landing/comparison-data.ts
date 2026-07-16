export type CompetitorFeature = {
  name: string;
  pulseguard: string | boolean;
  competitor1: string | boolean;
  competitor2: string | boolean;
  competitor3: string | boolean;
  isBattle: boolean;
};

export type CompetitorInfo = {
  id: string;
  name: string;
  url: string;
  description: string;
};

export const competitors: CompetitorInfo[] = [
  {
    id: "uptimerobot",
    name: "UptimeRobot",
    url: "https://uptimerobot.com",
    description: "The incumbent — popular but stuck at 5-minute free checks since 2015.",
  },
  {
    id: "betteruptime",
    name: "Better Uptime",
    url: "https://betteruptime.com",
    description:
      "Modern competitor with solid UX, but free tier still limited to 5-minute intervals.",
  },
  {
    id: "openstatus",
    name: "OpenStatus",
    url: "https://openstatus.dev",
    description: "Open-source alternative with 1-minute free checks, but limited global regions.",
  },
];

export const featureComparisons: CompetitorFeature[] = [
  {
    name: "Free Tier Check Interval",
    pulseguard: "1 minute",
    competitor1: "5 minutes",
    competitor2: "5 minutes",
    competitor3: "1 minute",
    isBattle: true,
  },
  {
    name: "Free Tier Monitor Limit",
    pulseguard: "50",
    competitor1: "50",
    competitor2: "10",
    competitor3: "Unlimited",
    isBattle: false,
  },
  {
    name: "Multi-Region Checks",
    pulseguard: "50+ global regions",
    competitor1: "3 regions",
    competitor2: "6 regions",
    competitor3: "Limited",
    isBattle: false,
  },
  {
    name: "SSL Certificate Monitoring",
    pulseguard: true,
    competitor1: true,
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Port / TCP Monitoring",
    pulseguard: true,
    competitor1: true,
    competitor2: false,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "DNS Monitoring",
    pulseguard: true,
    competitor1: false,
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Heartbeat / Cron Monitoring",
    pulseguard: true,
    competitor1: false,
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Status Page (Custom Domain)",
    pulseguard: true,
    competitor1: "Paid only",
    competitor2: "Paid only",
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Incident Management",
    pulseguard: true,
    competitor1: true,
    competitor2: true,
    competitor3: false,
    isBattle: false,
  },
  {
    name: "Slack / Discord Alerts",
    pulseguard: true,
    competitor1: "Paid only",
    competitor2: true,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "SMS / Phone Alerts",
    pulseguard: "Paid",
    competitor1: "Paid",
    competitor2: "Paid",
    competitor3: false,
    isBattle: false,
  },
  {
    name: "API Sequence Checks",
    pulseguard: true,
    competitor1: false,
    competitor2: false,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Browser / Synthetic Testing",
    pulseguard: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
    isBattle: false,
  },
  {
    name: "Private Probe Agents",
    pulseguard: true,
    competitor1: false,
    competitor2: "Paid",
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Data Export (No Lock-In)",
    pulseguard: true,
    competitor1: false,
    competitor2: false,
    competitor3: true,
    isBattle: false,
  },
  {
    name: "Cyberpunk Aesthetic",
    pulseguard: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
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

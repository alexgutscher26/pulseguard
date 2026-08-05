import type { DashboardStatsData } from "@/components/dashboard/stats";
import type { MonitorInsight } from "@/components/dashboard/ai-insights";
import type { OnboardingStatus } from "@/actions/onboarding";

export const DEMO_STATS: DashboardStatsData = {
  activeMonitors: 8,
  globalUptime: 99.98,
  avgLatency: 14,
  activeAlerts: 1,
};

export const DEMO_ONBOARDING_STATUS: OnboardingStatus = {
  hasCreatedMonitor: true,
  hasConfiguredAlert: true,
  hasSharedStatusPage: true,
  monitorsCount: 8,
  channelsCount: 3,
  statusPagesCount: 2,
  completedCount: 3,
  totalCount: 3,
  isComplete: true,
};

export const DEMO_INSIGHTS: MonitorInsight[] = [
  {
    id: "insight-demo-1",
    monitorId: "demo-mon-1",
    type: "ANOMALY",
    severity: "CRITICAL",
    message:
      "Latent TCP spike detected on Stripe Gateway. US-East edge probe observed a +340ms latency anomaly following upstream BGP rerouting.",
    createdAt: new Date(),
    monitor: {
      name: "Stripe Payment Gateway",
    },
  },
  {
    id: "insight-demo-2",
    monitorId: "demo-mon-4",
    type: "PREDICTION",
    severity: "WARNING",
    message:
      "SSL certificate for auth.pulseguard.io expires in 12 days. Trigger ACME renewal daemon.",
    createdAt: new Date(),
    monitor: {
      name: "OAuth2 Auth Service",
    },
  },
];

export const DEMO_MONITORS = [
  {
    id: "demo-mon-1",
    name: "Stripe Payment Gateway",
    url: "https://api.stripe.com/v1/health",
    type: "HTTP",
    status: "UP",
    interval: 60,
    uptime24h: 99.99,
    latency: 18,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central", "AP-Tokyo"],
  },
  {
    id: "demo-mon-2",
    name: "Cloudflare Edge CDN",
    url: "https://cdn.pulseguard.io/ping",
    type: "PING",
    status: "UP",
    interval: 60,
    uptime24h: 100.0,
    latency: 6,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "US-West", "EU-Central", "SA-East"],
  },
  {
    id: "demo-mon-3",
    name: "PostgreSQL Primary Cluster",
    url: "db-primary.internal.pulseguard:5432",
    type: "PORT",
    status: "UP",
    interval: 60,
    uptime24h: 99.95,
    latency: 11,
    lastCheck: new Date().toISOString(),
    regions: ["US-East"],
  },
  {
    id: "demo-mon-4",
    name: "OAuth2 Auth Service",
    url: "https://auth.pulseguard.io/health",
    type: "SSL",
    status: "UP",
    interval: 300,
    uptime24h: 100.0,
    latency: 24,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central"],
  },
  {
    id: "demo-mon-5",
    name: "User Portal Checkout Sequence",
    url: "https://app.pulseguard.io/api/checkout/verify",
    type: "SEQUENCE",
    status: "UP",
    interval: 180,
    uptime24h: 99.92,
    latency: 85,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central"],
  },
  {
    id: "demo-mon-6",
    name: "Redis Session Store (Private Probe)",
    url: "redis-cache.vpc-prod.internal:6379",
    type: "PORT",
    status: "UP",
    interval: 60,
    uptime24h: 100.0,
    latency: 2,
    lastCheck: new Date().toISOString(),
    regions: ["Private-VPC"],
  },
  {
    id: "demo-mon-7",
    name: "GraphQL Federation Mesh",
    url: "https://graphql.pulseguard.io/graphql",
    type: "HTTP",
    status: "DEGRADED",
    interval: 60,
    uptime24h: 98.4,
    latency: 185,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central", "AP-Tokyo"],
  },
  {
    id: "demo-mon-8",
    name: "Webhooks Dispatch Queue",
    url: "https://hooks.pulseguard.io/healthz",
    type: "HTTP",
    status: "UP",
    interval: 60,
    uptime24h: 100.0,
    latency: 14,
    lastCheck: new Date().toISOString(),
    regions: ["US-East"],
  },
];

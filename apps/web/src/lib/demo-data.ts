import type { DashboardStatsData } from "@/components/dashboard/stats";
import type { MonitorInsight } from "@/components/dashboard/ai-insights";
import type { OnboardingStatus } from "@/actions/onboarding";

function generateEvents(status: "UP" | "DOWN" | "DEGRADED", baseLatency: number) {
  const events = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now - i * 60 * 1000);
    let eventStatus = "UP";
    let latency = baseLatency + Math.floor(Math.random() * 6) - 3;

    if (status === "DEGRADED" && i < 5) {
      eventStatus = "UP";
      latency = baseLatency + Math.floor(Math.random() * 80) + 120;
    } else if (status === "DOWN" && i < 3) {
      eventStatus = "DOWN";
      latency = 0;
    }

    events.push({
      id: `evt-${i}`,
      status: eventStatus,
      latency: Math.max(1, latency),
      timestamp,
    });
  }
  return events;
}

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
  onboardingCompleted: true,
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
      "SSL certificate for auth.steadystack.dev expires in 12 days. Trigger ACME renewal daemon.",
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
    events: generateEvents("UP", 18),
  },
  {
    id: "demo-mon-2",
    name: "Cloudflare Edge CDN",
    url: "https://cdn.steadystack.dev/ping",
    type: "PING",
    status: "UP",
    interval: 60,
    uptime24h: 100.0,
    latency: 6,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "US-West", "EU-Central", "SA-East"],
    events: generateEvents("UP", 6),
  },
  {
    id: "demo-mon-3",
    name: "PostgreSQL Primary Cluster",
    url: "db-primary.internal.steadystack:5432",
    type: "PORT",
    status: "UP",
    interval: 60,
    uptime24h: 99.95,
    latency: 11,
    lastCheck: new Date().toISOString(),
    regions: ["US-East"],
    events: generateEvents("UP", 11),
  },
  {
    id: "demo-mon-4",
    name: "OAuth2 Auth Service",
    url: "https://auth.steadystack.dev/health",
    type: "SSL",
    status: "UP",
    interval: 300,
    uptime24h: 100.0,
    latency: 24,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central"],
    events: generateEvents("UP", 24),
  },
  {
    id: "demo-mon-5",
    name: "User Portal Checkout Sequence",
    url: "https://app.steadystack.dev/api/checkout/verify",
    type: "SEQUENCE",
    status: "UP",
    interval: 180,
    uptime24h: 99.92,
    latency: 85,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central"],
    events: generateEvents("UP", 85),
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
    events: generateEvents("UP", 2),
  },
  {
    id: "demo-mon-7",
    name: "GraphQL Federation Mesh",
    url: "https://graphql.steadystack.dev/graphql",
    type: "HTTP",
    status: "DEGRADED",
    interval: 60,
    uptime24h: 98.4,
    latency: 185,
    lastCheck: new Date().toISOString(),
    regions: ["US-East", "EU-Central", "AP-Tokyo"],
    events: generateEvents("DEGRADED", 185),
  },
  {
    id: "demo-mon-8",
    name: "Webhooks Dispatch Queue",
    url: "https://hooks.steadystack.dev/healthz",
    type: "HTTP",
    status: "UP",
    interval: 60,
    uptime24h: 100.0,
    latency: 14,
    lastCheck: new Date().toISOString(),
    regions: ["US-East"],
    events: generateEvents("UP", 14),
  },
];

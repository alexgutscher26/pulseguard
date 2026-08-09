import prisma from "./index.js";
import {
  type MonitorType,
  type MonitorStatus,
  type NotificationType,
  type AlertTrigger,
  type InsightType,
  type InsightSeverity,
  type IncidentStatus,
  type Severity,
  type IncidentEventType,
  type PostMortemStatus,
  type LatencyGranularity,
} from "./generated/client/index.js";

export interface SeedOptions {
  userEmail?: string | undefined;
  cleanExisting?: boolean | undefined;
  resetDb?: boolean | undefined;
  verbose?: boolean | undefined;
}

export async function seedDatabase(options: SeedOptions = {}) {
  const { userEmail, cleanExisting = false, resetDb = false, verbose = true } = options;

  const log = (...args: any[]) => {
    if (verbose) console.log(...args);
  };

  log("🌱 [PulseGuard Seed] Initializing real PulseGuard services, APIs & endpoint seed generator...");

  // 1. Locate or create target user
  let targetUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!targetUser) {
    const defaultEmail = userEmail || "admin@pulseguard.io";
    log(`👤 No user found. Creating default administrative user: ${defaultEmail}`);
    targetUser = await prisma.user.create({
      data: {
        id: "seed-user-admin-01",
        email: defaultEmail,
        name: "PulseGuard Admin",
        emailVerified: true,
        tier: "ADMIN",
        onboardingCompleted: true,
        timezone: "UTC",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
    });
    log(`✅ Created seed user: ${targetUser.email} (${targetUser.id})`);
  } else {
    log(`👤 Target user identified: ${targetUser.email} (${targetUser.id})`);
  }

  const userId = targetUser.id;

  // 2. Clean or Reset previous seed records if requested
  if (cleanExisting || resetDb) {
    log("🧹 [DB Reset] Cleaning previous monitors, telemetry, notifications, and status pages...");
    
    // Status pages & links
    await prisma.statusPageView.deleteMany({});
    await prisma.statusPageMonitor.deleteMany({});
    await prisma.statusPageGroup.deleteMany({});
    await prisma.statusPage.deleteMany({ where: { userId } });

    // Incidents, Post-Mortems, Insights
    await prisma.monitorInsight.deleteMany({});
    await prisma.postMortem.deleteMany({});
    await prisma.incidentEvent.deleteMany({});
    await prisma.regionalIncident.deleteMany({});
    await prisma.incident.deleteMany({});

    // Telemetry & Monitors
    await prisma.maintenanceWindow.deleteMany({});
    await prisma.heartbeatPing.deleteMany({});
    await prisma.dailyMonitorSummary.deleteMany({});
    await prisma.latencyAggregate.deleteMany({});
    await prisma.regionalBaseline.deleteMany({});
    await prisma.monitorEvent.deleteMany({});
    await prisma.alertRule.deleteMany({});
    await prisma.monitor.deleteMany({ where: { userId } });

    // Channels
    await prisma.notificationChannel.deleteMany({ where: { userId } });

    log("✨ [DB Reset] All previous data cleaned successfully.");
  }

  // 3. Create Multi-Channel Notification Endpoints
  log("🔔 Creating Notification Channels across all notification types...");
  const channelsToCreate: { name: string; type: NotificationType; config: any }[] = [
    {
      name: "PulseGuard Security Ops (Primary Email)",
      type: "EMAIL",
      config: { email: targetUser.email },
    },
    {
      name: "PulseGuard Slack #ops-alerts",
      type: "SLACK",
      config: {
        webhookUrl: "https://webhook.pulseguard.internal/integrations/slack",
        channel: "#ops-alerts",
      },
    },
    {
      name: "PulseGuard Discord DevOps Room",
      type: "DISCORD",
      config: {
        webhookUrl: "https://webhook.pulseguard.internal/integrations/discord",
      },
    },
    {
      name: "PulseGuard PagerDuty P1 Bridge",
      type: "WEBHOOK",
      config: {
        url: "https://webhook.pulseguard.internal/integrations/pagerduty",
        headers: { "X-Routing-Key": "pulseguard-ops-bridge" },
      },
    },
    {
      name: "PulseGuard Telegram SRE Bot",
      type: "TELEGRAM",
      config: {
        chatId: "-1001987654321",
        botToken: "mock_telegram_bot_token_pulseguard",
      },
    },
    {
      name: "PulseGuard SMS On-Call Dispatcher",
      type: "SMS",
      config: {
        phoneNumber: "+15550198765",
      },
    },
  ];

  const createdChannels: any[] = [];
  for (const ch of channelsToCreate) {
    const existing = await prisma.notificationChannel.findFirst({
      where: { userId, name: ch.name },
    });
    if (existing) {
      createdChannels.push(existing);
    } else {
      const created = await prisma.notificationChannel.create({
        data: {
          name: ch.name,
          type: ch.type,
          config: ch.config,
          userId,
        },
      });
      createdChannels.push(created);
    }
  }
  log(`✅ Configured ${createdChannels.length} notification channels.`);

  // 4. Define Real PulseGuard Monitor Types & Endpoints
  interface SeedMonitorDef {
    name: string;
    url: string;
    type: MonitorType;
    interval: number;
    timeout: number;
    status: MonitorStatus;
    checkRegions: string[];
    alertThreshold: number;
    dynamicThresholding: boolean;
    runbookUrl?: string;
    method?: string;
    headers?: { key: string; value: string }[];
    body?: string;
    expectation?: any;
    script?: any;
    heartbeatToken?: string;
    tags: string[];
    baseLatencyMs: number;
    isDown?: boolean;
    isMaintenance?: boolean;
  }

  const monitorDefinitions: SeedMonitorDef[] = [
    // ── 1. PulseGuard Core API & Web Services (HTTP) ──────────────────────────────
    {
      name: "PulseGuard Core API Health Check",
      url: "http://localhost:3000/api/health",
      type: "HTTP",
      method: "GET",
      interval: 30,
      timeout: 5,
      status: "UP",
      checkRegions: [
        "us-east-1",
        "eu-central-1",
        "ap-northeast-1",
        "sa-east-1",
        "af-south-1",
        "me-central-1",
      ],
      alertThreshold: 2,
      dynamicThresholding: true,
      runbookUrl: "https://docs.pulseguard.io/runbooks/api-health",
      headers: [
        { key: "Accept", value: "application/json" },
        { key: "X-Watchdog-Source", value: "pulseguard-core" },
      ],
      expectation: {
        body_contains: "ok",
        json_assertions: [
          { path: "$.status", operator: "==", value: "ok" },
          { path: "$.db", operator: "==", value: "connected" },
        ],
      },
      tags: ["api", "health", "database", "redis", "tier-1", "global-mesh"],
      baseLatencyMs: 14,
    },
    {
      name: "PulseGuard Better-Auth Session Service",
      url: "http://localhost:3000/api/auth/session",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "ap-northeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      runbookUrl: "https://docs.pulseguard.io/runbooks/auth-failures",
      headers: [{ key: "Accept", value: "application/json" }],
      tags: ["auth", "better-auth", "session", "security"],
      baseLatencyMs: 22,
    },
    {
      name: "PulseGuard tRPC API Gateway",
      url: "http://localhost:3000/api/trpc/healthCheck",
      type: "HTTP",
      method: "GET",
      interval: 30,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: true,
      expectation: {
        json_assertions: [{ path: "$.result.data", operator: "==", value: "OK" }],
      },
      tags: ["trpc", "api", "type-safe", "backend"],
      baseLatencyMs: 18,
    },
    {
      name: "PulseGuard Web App Dashboard",
      url: "http://localhost:3000/dashboard",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "sa-east-1"],
      alertThreshold: 2,
      dynamicThresholding: false,
      expectation: {
        body_contains: "PulseGuard",
      },
      tags: ["web", "nextjs", "dashboard", "frontend"],
      baseLatencyMs: 32,
    },
    {
      name: "PulseGuard Status Badge SVG Endpoint",
      url: "http://localhost:3000/api/badge/pulseguard-global-status",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      headers: [{ key: "Accept", value: "image/svg+xml" }],
      expectation: {
        body_contains: "<svg",
      },
      tags: ["badge", "svg", "status-page", "public-api"],
      baseLatencyMs: 15,
    },
    {
      name: "PulseGuard Embed Widget JSON Endpoint",
      url: "http://localhost:3000/api/widget/pulseguard-global-status",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "ap-southeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      expectation: {
        json_assertions: [
          { path: "$.statusPage.slug", operator: "==", value: "pulseguard-global-status" },
        ],
      },
      tags: ["widget", "embed", "status-page", "api"],
      baseLatencyMs: 20,
    },
    {
      name: "PulseGuard Stripe Webhook Ingestion",
      url: "http://localhost:3000/api/webhooks/stripe",
      type: "HTTP",
      method: "POST",
      interval: 120,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "Stripe-Signature", value: "t=1720000000,v1=test_signature" },
      ],
      body: JSON.stringify({
        type: "payment_intent.succeeded",
        data: { object: { id: "pi_pulseguard_seed_123" } },
      }),
      tags: ["billing", "stripe", "webhooks", "payments"],
      baseLatencyMs: 28,
    },

    // ── 2. Cloudflare Worker Edge & Probe Engine (HTTP / Worker) ───────────────────
    {
      name: "PulseGuard Worker Check Engine (Edge)",
      url: "http://127.0.0.1:8787/api/check",
      type: "HTTP",
      method: "POST",
      interval: 30,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1", "ap-northeast-1"],
      alertThreshold: 1,
      dynamicThresholding: true,
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: JSON.stringify({ url: "https://1.1.1.1", type: "PING" }),
      tags: ["worker", "cloudflare-edge", "check-engine", "miniflare"],
      baseLatencyMs: 9,
    },
    {
      name: "PulseGuard Docker Private Probe Gateway",
      url: "http://127.0.0.1:8787/api/probes",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "us-west-2"],
      alertThreshold: 1,
      dynamicThresholding: false,
      headers: [{ key: "Authorization", value: "Bearer local-dev-probe-secret" }],
      tags: ["probe", "docker", "private-network", "agent"],
      baseLatencyMs: 12,
    },
    {
      name: "PulseGuard MailHog Email Preview UI (8025)",
      url: "http://localhost:8025",
      type: "HTTP",
      method: "GET",
      interval: 120,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      expectation: {
        body_contains: "MailHog",
      },
      tags: ["mailhog", "email-preview", "web-ui", "port-8025"],
      baseLatencyMs: 8,
    },

    // ── 3. Network PING & Mesh Verification ───────────────────────────────────────
    {
      name: "PulseGuard Cloudflare Anycast CDN Mesh",
      url: "ping://1.1.1.1",
      type: "PING",
      interval: 30,
      timeout: 5,
      status: "UP",
      checkRegions: [
        "us-east-1",
        "us-west-1",
        "eu-west-1",
        "eu-central-1",
        "ap-southeast-1",
        "ap-northeast-1",
        "sa-east-1",
        "af-south-1",
        "me-central-1",
      ],
      alertThreshold: 2,
      dynamicThresholding: true,
      runbookUrl: "https://docs.pulseguard.io/runbooks/anycast-mesh",
      tags: ["network", "cdn", "anycast", "icmp", "global-mesh"],
      baseLatencyMs: 8,
    },
    {
      name: "PulseGuard Local Gateway ICMP Ping",
      url: "ping://127.0.0.1",
      type: "PING",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "us-west-2"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["network", "gateway", "icmp", "local-dev"],
      baseLatencyMs: 3,
    },

    // ── 4. Infrastructure TCP Ports (PORT) ────────────────────────────────────────
    {
      name: "PulseGuard PostgreSQL Database Port (5432)",
      url: "tcp://localhost:5432",
      type: "PORT",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "us-east-2"],
      alertThreshold: 1,
      dynamicThresholding: false,
      runbookUrl: "https://docs.pulseguard.io/runbooks/postgres-port",
      tags: ["database", "postgres", "port-5432", "tier-1", "infrastructure"],
      baseLatencyMs: 6,
    },
    {
      name: "PulseGuard Redis Cache & Queue Port (6379)",
      url: "tcp://localhost:6379",
      type: "PORT",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["redis", "cache", "port-6379", "infrastructure"],
      baseLatencyMs: 5,
    },
    {
      name: "PulseGuard MailHog SMTP Port (1025)",
      url: "tcp://localhost:1025",
      type: "PORT",
      interval: 120,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["mailhog", "smtp", "port-1025", "email"],
      baseLatencyMs: 4,
    },
    {
      name: "PulseGuard Transactional SMTP Gateway (587)",
      url: "tcp://smtp.pulseguard.io:587",
      type: "PORT",
      interval: 300,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["smtp", "email", "port-587", "notifications"],
      baseLatencyMs: 25,
    },

    // ── 5. Synthetic Browser Workflows (BROWSER) ──────────────────────────────────
    {
      name: "Synthetic E2E: User Sign-in & Dashboard Navigation",
      url: "http://localhost:3000/login",
      type: "BROWSER",
      interval: 300,
      timeout: 30,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1", "ap-northeast-1"],
      alertThreshold: 2,
      dynamicThresholding: true,
      runbookUrl: "https://docs.pulseguard.io/runbooks/synthetic-auth",
      script: [
        { action: "goto", value: "http://localhost:3000/login", selector: "" },
        {
          action: "fill",
          value: "admin@pulseguard.io",
          selector: "input[name='email']",
        },
        { action: "fill", value: "SyntheticPass123!", selector: "input[name='password']" },
        { action: "click", value: "", selector: "button[type='submit']" },
        { action: "wait", value: "1500", selector: "" },
        { action: "assert_text", value: "Monitors", selector: "" },
      ],
      tags: ["synthetic", "browser", "playwright", "auth", "critical-journey"],
      baseLatencyMs: 420,
    },
    {
      name: "Synthetic E2E: Onboarding Setup Wizard",
      url: "http://localhost:3000/onboarding",
      type: "BROWSER",
      interval: 600,
      timeout: 30,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      script: [
        { action: "goto", value: "http://localhost:3000/onboarding", selector: "" },
        { action: "click", value: "", selector: "[data-step='first-monitor']" },
        { action: "wait", value: "1000", selector: "" },
        { action: "assert_text", value: "Configure a new endpoint", selector: "" },
      ],
      tags: ["synthetic", "browser", "onboarding", "wizard"],
      baseLatencyMs: 510,
    },

    // ── 6. Chained API Transaction (SEQUENCE) ─────────────────────────────────────
    {
      name: "API Sequence: Auth Session → Health Check → tRPC Query",
      url: "http://localhost:3000",
      type: "SEQUENCE",
      interval: 120,
      timeout: 20,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1", "ap-southeast-1"],
      alertThreshold: 2,
      dynamicThresholding: true,
      runbookUrl: "https://docs.pulseguard.io/runbooks/api-chain",
      script: [
        {
          name: "1. Query Better-Auth Session Endpoint",
          method: "GET",
          url: "/api/auth/session",
          headers: [{ key: "Accept", value: "application/json" }],
          body: "",
          assertions: [{ type: "status_code", path: "", value: "200" }],
          extractions: [{ name: "session_token", source: "header", path: "set-cookie" }],
        },
        {
          name: "2. Verify Core API Health with Context",
          method: "GET",
          url: "/api/health",
          headers: [
            { key: "Authorization", value: "Bearer {{session_token}}" },
            { key: "Accept", value: "application/json" },
          ],
          body: "",
          assertions: [
            { type: "status_code", path: "", value: "200" },
            { type: "json_path", path: "status", value: "ok" },
          ],
          extractions: [],
        },
        {
          name: "3. Execute tRPC Procedure HealthCheck",
          method: "GET",
          url: "/api/trpc/healthCheck",
          headers: [{ key: "Accept", value: "application/json" }],
          body: "",
          assertions: [
            { type: "status_code", path: "", value: "200" },
            { type: "json_path", path: "result.data", value: "OK" },
          ],
          extractions: [],
        },
      ],
      tags: ["sequence", "api-chain", "synthetic", "trpc", "auth"],
      baseLatencyMs: 180,
    },

    // ── 7. TLS/SSL Certificate Watchdogs (SSL) ───────────────────────────────────
    {
      name: "PulseGuard Production Edge TLS 1.3 Certificate Watchdog",
      url: "https://pulseguard.io",
      type: "SSL",
      interval: 3600,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "ap-northeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      runbookUrl: "https://docs.pulseguard.io/runbooks/ssl-renewal",
      tags: ["security", "ssl", "tls-1.3", "certificates"],
      baseLatencyMs: 35,
    },
    {
      name: "PulseGuard Auth Subdomain Wildcard SSL Watchdog",
      url: "https://auth.pulseguard.io",
      type: "SSL",
      interval: 3600,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["security", "ssl", "subdomain", "auth"],
      baseLatencyMs: 38,
    },

    // ── 8. Authoritative DNS & Anti-Poisoning (DNS) ───────────────────────────────
    {
      name: "PulseGuard Authoritative DNS & Name Resolution Watchdog",
      url: "pulseguard.io",
      type: "DNS",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "ap-southeast-1", "sa-east-1", "af-south-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      expectation: {
        expectedIPs: ["104.21.55.10", "172.67.182.20"],
      },
      runbookUrl: "https://docs.pulseguard.io/runbooks/dns-security",
      tags: ["dns", "nameserver", "anti-poisoning", "expected-ips"],
      baseLatencyMs: 11,
    },

    // ── 9. Dead Man's Snitch / Cron Heartbeats (HEARTBEAT) ────────────────────────
    {
      name: "PulseGuard Worker Cron Dead Man's Snitch",
      url: "heartbeat://pulseguard-worker-snitch-live",
      heartbeatToken: "pulseguard-worker-snitch-live",
      type: "HEARTBEAT",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: [],
      alertThreshold: 1,
      dynamicThresholding: false,
      runbookUrl: "https://docs.pulseguard.io/runbooks/worker-cron-snitch",
      tags: ["heartbeat", "deadmans-snitch", "worker", "cron"],
      baseLatencyMs: 2,
    },
    {
      name: "PulseGuard Nightly Database S3 Backup Snitch",
      url: "heartbeat://pulseguard-nightly-db-backup",
      heartbeatToken: "pulseguard-nightly-db-backup",
      type: "HEARTBEAT",
      interval: 86400,
      timeout: 30,
      status: "UP",
      checkRegions: [],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["heartbeat", "backup", "disaster-recovery", "cron"],
      baseLatencyMs: 3,
    },

    // ── 10. AI Agent Protocol Sentinel (MCP) ──────────────────────────────────────
    {
      name: "PulseGuard MCP AI Tool Sentinel (tools/list)",
      url: "http://localhost:3000/api/mcp",
      type: "MCP",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      script: {
        method: "tools/list",
        params: { category: "pulseguard-tools" },
      },
      expectation: {
        assertions: [
          { type: "tool_exists", name: "check_monitor" },
          { type: "schema_valid", strict: true },
        ],
      },
      tags: ["ai", "mcp", "agent-sentinel", "tools-list"],
      baseLatencyMs: 65,
    },

    // ── 11. GraphQL Federation Gateway (GRAPHQL) ──────────────────────────────────
    {
      name: "PulseGuard GraphQL Federation Gateway",
      url: "http://localhost:3000/api/graphql",
      type: "GRAPHQL",
      method: "POST",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "ap-northeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: JSON.stringify({
        query:
          "query HealthCheck { __typename systemHealth { database cache scheduler } }",
      }),
      expectation: {
        assertions: [
          { path: "data.systemHealth.database", operator: "==", value: "connected" },
        ],
      },
      tags: ["graphql", "api", "query-assertions"],
      baseLatencyMs: 40,
    },

    // ── 12. Real-Time WebSocket Streaming (WEBSOCKET) ─────────────────────────────
    {
      name: "PulseGuard Live Telemetry WebSocket Stream",
      url: "ws://127.0.0.1:8787/api/broadcast",
      type: "WEBSOCKET",
      interval: 60,
      timeout: 10,
      status: "UP",
      checkRegions: ["us-east-1", "eu-central-1", "ap-southeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      expectation: {
        event: "ping",
        timeoutMs: 5000,
        payload_contains: "connected",
      },
      tags: ["websocket", "durable-objects", "realtime", "telemetry"],
      baseLatencyMs: 15,
    },

    // ── 13. Direct Database Health Probe (DATABASE) ───────────────────────────────
    {
      name: "PulseGuard PostgreSQL Activity & Connection Pool Probe",
      url: "postgresql://pulseguard:pulseguard@localhost:5432/pulseguard",
      type: "DATABASE",
      interval: 60,
      timeout: 5,
      status: "UP",
      checkRegions: ["us-east-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      body: "SELECT count(*) AS pool_connections, pg_is_in_recovery() AS is_replica FROM pg_stat_activity;",
      expectation: {
        assertions: [{ column: "is_replica", operator: "==", value: "false" }],
      },
      tags: ["database", "postgres", "sql-probe", "connection-pool"],
      baseLatencyMs: 8,
    },

    // ── 14. BGP Autonomous System Route Watchdog (BGP) ───────────────────────────
    {
      name: "PulseGuard Cloudflare AS13335 BGP Route & RPKI Sentinel",
      url: "AS13335",
      type: "BGP",
      interval: 300,
      timeout: 15,
      status: "UP",
      checkRegions: ["us-east-1", "eu-west-1", "ap-southeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      expectation: {
        expected_upstream: ["AS174", "AS3356", "AS2914"],
        rpki_required: true,
      },
      tags: ["network", "bgp", "rpki", "anti-hijack"],
      baseLatencyMs: 120,
    },

    // ── 15. Domain WHOIS Expiration Watchdog (DOMAIN) ─────────────────────────────
    {
      name: "PulseGuard Domain Registration & WHOIS Expiration Watchdog",
      url: "pulseguard.io",
      type: "DOMAIN",
      interval: 86400,
      timeout: 15,
      status: "UP",
      checkRegions: ["us-east-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["domain", "whois", "registrar", "expiration"],
      baseLatencyMs: 95,
    },

    // ── 16. Outage & Maintenance Edge Cases ───────────────────────────────────────
    {
      name: "PulseGuard Legacy Telemetry Ingester (Simulated Incident)",
      url: "http://localhost:3000/api/legacy-ingest",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 10,
      status: "DOWN",
      checkRegions: ["us-east-1", "eu-central-1", "ap-northeast-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      runbookUrl: "https://docs.pulseguard.io/runbooks/ingester-outage",
      tags: ["legacy", "ingest", "incident", "simulated-down"],
      baseLatencyMs: 0,
      isDown: true,
    },
    {
      name: "PulseGuard Billing Webhook Gateway (Scheduled Maintenance)",
      url: "http://localhost:3000/api/billing-gateway",
      type: "HTTP",
      method: "GET",
      interval: 60,
      timeout: 10,
      status: "MAINTENANCE",
      checkRegions: ["us-east-1", "eu-west-1"],
      alertThreshold: 1,
      dynamicThresholding: false,
      tags: ["billing", "maintenance-window", "scheduled"],
      baseLatencyMs: 0,
      isMaintenance: true,
    },
  ];

  log(
    `📡 Seeding ${monitorDefinitions.length} Real PulseGuard Monitors across all types and verification configurations...`,
  );

  const seededMonitors: any[] = [];

  for (const def of monitorDefinitions) {
    // Check if monitor exists by name + userId
    let monitor = await prisma.monitor.findFirst({
      where: { userId, name: def.name },
    });

    const monitorData = {
      name: def.name,
      url: def.url,
      type: def.type,
      interval: def.interval,
      timeout: def.timeout,
      status: def.status,
      userId,
      checkRegions: def.checkRegions.length > 0 ? JSON.stringify(def.checkRegions) : null,
      alertThreshold: def.alertThreshold,
      dynamicThresholding: def.dynamicThresholding,
      runbookUrl: def.runbookUrl || null,
      method: def.method || "GET",
      headers: def.headers ? JSON.stringify(def.headers) : null,
      body: def.body || null,
      expectation: def.expectation ? JSON.stringify(def.expectation) : null,
      script: def.script ? JSON.stringify(def.script) : null,
      heartbeatToken: def.heartbeatToken || null,
      tags: def.tags,
      lastCheck: new Date(),
      nextCheck: new Date(Date.now() + def.interval * 1000),
    };

    if (monitor) {
      monitor = await prisma.monitor.update({
        where: { id: monitor.id },
        data: monitorData,
      });
    } else {
      monitor = await prisma.monitor.create({
        data: monitorData,
      });
    }

    seededMonitors.push({ ...monitor, def });

    // 5. Attach Default Alert Rules
    await prisma.alertRule.deleteMany({ where: { monitorId: monitor.id } });
    await prisma.alertRule.create({
      data: {
        monitorId: monitor.id,
        trigger: (def.type === "SSL"
          ? "SSL_EXPIRY"
          : def.type === "DNS"
            ? "DNS_WATCHDOG"
            : def.type === "DOMAIN"
              ? "DOMAIN_EXPIRY"
              : "STATUS_CHANGE") as AlertTrigger,
        threshold: def.type === "SSL" ? 14 : def.type === "DOMAIN" ? 30 : null,
        targetStatus: "DOWN",
        enabled: true,
        channels: {
          connect: createdChannels.slice(0, 3).map((ch) => ({ id: ch.id })),
        },
      },
    });

    // 6. Generate Realistic Time-Series Telemetry Events
    await prisma.monitorEvent.deleteMany({ where: { monitorId: monitor.id } });

    const now = Date.now();
    const eventCount = 30;
    const eventsToCreate: any[] = [];
    const regions = def.checkRegions.length > 0 ? def.checkRegions : ["us-east-1"];

    for (let i = 0; i < eventCount; i++) {
      const timestamp = new Date(now - i * (def.interval * 1000 || 60000));
      const region = regions[i % regions.length] ?? "us-east-1";

      // Regional latency multiplier
      let regionMultiplier = 1.0;
      if (region.startsWith("eu")) regionMultiplier = 3.5;
      else if (region.startsWith("ap")) regionMultiplier = 6.2;
      else if (region.startsWith("sa")) regionMultiplier = 8.5;
      else if (region.startsWith("af") || region.startsWith("me")) regionMultiplier = 9.8;

      let eventStatus: MonitorStatus = def.status;
      let latency = Math.max(
        1,
        Math.round(def.baseLatencyMs * regionMultiplier + (Math.random() * 8 - 4)),
      );
      let errorReason: string | null = null;

      if (def.isDown && i < 8) {
        eventStatus = "DOWN";
        latency = 0;
        errorReason = "HTTP_503_SERVICE_UNAVAILABLE";
      } else if (def.isMaintenance) {
        eventStatus = "MAINTENANCE";
        latency = 0;
      }

      eventsToCreate.push({
        monitorId: monitor.id,
        status: eventStatus,
        latency,
        errorReason,
        timestamp,
        region,
      });
    }

    await prisma.monitorEvent.createMany({
      data: eventsToCreate,
    });

    // 7. Seed Heartbeat Pings if Heartbeat monitor
    if (def.type === "HEARTBEAT") {
      await prisma.heartbeatPing.deleteMany({ where: { monitorId: monitor.id } });
      const pings: any[] = [];
      for (let p = 0; p < 15; p++) {
        pings.push({
          monitorId: monitor.id,
          pingedAt: new Date(now - p * (def.interval * 1000)),
          sourceIp: `198.51.100.${10 + p}`,
          userAgent: "PulseGuard-Cron-Snitch/2.4 (Bun-Edge)",
        });
      }
      await prisma.heartbeatPing.createMany({ data: pings });
    }

    // 8. Seed Regional Baselines & Latency Aggregates
    await prisma.regionalBaseline.deleteMany({ where: { monitorId: monitor.id } });
    await prisma.latencyAggregate.deleteMany({ where: { monitorId: monitor.id } });

    for (const r of regions) {
      let rMult = 1.0;
      if (r.startsWith("eu")) rMult = 3.5;
      else if (r.startsWith("ap")) rMult = 6.2;
      else if (r.startsWith("sa")) rMult = 8.5;
      else if (r.startsWith("af") || r.startsWith("me")) rMult = 9.8;

      const baseline = Math.max(1, Math.round(def.baseLatencyMs * rMult));

      await prisma.regionalBaseline.create({
        data: {
          monitorId: monitor.id,
          region: r,
          baselineLatency: baseline,
        },
      });

      // Insert Hourly Latency Aggregates for the past 24 hours
      const aggregates: any[] = [];
      for (let h = 0; h < 24; h++) {
        const aggTime = new Date(now - h * 3600 * 1000);
        aggregates.push({
          monitorId: monitor.id,
          region: r,
          timestamp: aggTime,
          granularity: "ONE_HOUR" as LatencyGranularity,
          avgLatency: baseline + (Math.random() * 6 - 3),
          minLatency: Math.max(1, baseline - 4),
          maxLatency: baseline + 18,
          p50Latency: baseline,
          p95Latency: baseline + 8,
          p99Latency: baseline + 15,
          sampleCount: 60,
          successRate: def.isDown ? 0.88 : 0.999,
        });
      }
      await prisma.latencyAggregate.createMany({ data: aggregates });
    }

    // 9. Seed 7-Day Daily Summaries
    await prisma.dailyMonitorSummary.deleteMany({ where: { monitorId: monitor.id } });
    const dailySummaries: any[] = [];
    for (let d = 0; d < 7; d++) {
      const summaryDate = new Date(now - d * 86400 * 1000);
      dailySummaries.push({
        monitorId: monitor.id,
        date: summaryDate,
        uptimePct: def.isDown && d === 0 ? 94.25 : 99.98,
        avgLatency: Math.max(1, def.baseLatencyMs * 1.8),
        checksTotal: 2880,
        checksUp: def.isDown && d === 0 ? 2714 : 2879,
        checksDown: def.isDown && d === 0 ? 166 : 1,
        downDuration: def.isDown && d === 0 ? 9960 : 60,
      });
    }
    await prisma.dailyMonitorSummary.createMany({ data: dailySummaries });

    // 10. Seed Outage Incident and Maintenance Window for edge-case monitors
    if (def.isDown) {
      await prisma.incident.deleteMany({ where: { monitorId: monitor.id } });
      const incident = await prisma.incident.create({
        data: {
          monitorId: monitor.id,
          status: "INVESTIGATING" as IncidentStatus,
          severity: "HIGH" as Severity,
          title: "Elevated Error Rates on Legacy Ingestion Pipeline",
          description:
            "Automated watchdog triggered HTTP 503 response code anomaly across edge verification mesh.",
          startedAt: new Date(now - 15 * 60 * 1000),
          events: {
            create: [
              {
                type: "STATE_CHANGE" as IncidentEventType,
                message: "Watchdog detected HTTP 503 Service Unavailable from us-east-1 and eu-central-1.",
                createdAt: new Date(now - 15 * 60 * 1000),
              },
              {
                type: "ALERT_SENT" as IncidentEventType,
                message: "On-call engineer alert sent via PagerDuty and Slack webhooks.",
                createdAt: new Date(now - 10 * 60 * 1000),
              },
              {
                type: "COMMENT" as IncidentEventType,
                message: "Triaging upstream database connection saturation in legacy worker pool.",
                createdAt: new Date(now - 5 * 60 * 1000),
              },
            ],
          },
        },
      });

      // Seed Regional Incident
      await prisma.regionalIncident.deleteMany({ where: { monitorId: monitor.id } });
      await prisma.regionalIncident.create({
        data: {
          monitorId: monitor.id,
          region: "us-east-1",
          status: "INVESTIGATING" as IncidentStatus,
          startedAt: new Date(now - 15 * 60 * 1000),
          avgLatency: 0,
          latencyThreshold: 150,
        },
      });

      // Seed Incident Post-Mortem draft
      await prisma.postMortem.deleteMany({ where: { incidentId: incident.id } });
      await prisma.postMortem.create({
        data: {
          incidentId: incident.id,
          summary: "Upstream connection pool exhaustion in legacy ingestion service.",
          rootCause: "Unbounded query retry loop triggered connection pool starvation.",
          impactScope: "Legacy telemetry ingest degraded for 15 minutes.",
          detectionMethod: "PulseGuard HTTP Synthetic Watchdog",
          timeline: "T-15m: Watchdog triggered -> T-10m: Acked -> T-5m: Investigation underway",
          actionItems: "1. Add exponential backoff to query retries.\n2. Scale connection pool limit.",
          status: "DRAFT" as PostMortemStatus,
        },
      });
    }

    if (def.isMaintenance) {
      await prisma.maintenanceWindow.deleteMany({ where: { monitorId: monitor.id } });
      await prisma.maintenanceWindow.create({
        data: {
          monitorId: monitor.id,
          description: "Scheduled database partition maintenance and cluster index optimization",
          startAt: new Date(now - 10 * 60 * 1000),
          endAt: new Date(now + 50 * 60 * 1000),
        },
      });
    }
  }

  // 11. Generate AI Insights for the Monitors
  log("🧠 Generating AI Monitor Insights...");
  await prisma.monitorInsight.deleteMany({
    where: { monitor: { userId } },
  });

  const apiMonitor = seededMonitors.find((m) => m.def.name === "PulseGuard Core API Health Check");
  if (apiMonitor) {
    await prisma.monitorInsight.create({
      data: {
        monitorId: apiMonitor.id,
        type: "ANOMALY" as InsightType,
        severity: "INFO" as InsightSeverity,
        message:
          "P95 latency decreased by 12% following edge route optimization in eu-central-1.",
        metadata: JSON.stringify({ improvementPct: 12, region: "eu-central-1" }),
      },
    });
  }

  const sslMonitor = seededMonitors.find(
    (m) => m.def.name === "PulseGuard Production Edge TLS 1.3 Certificate Watchdog",
  );
  if (sslMonitor) {
    await prisma.monitorInsight.create({
      data: {
        monitorId: sslMonitor.id,
        type: "PREDICTION" as InsightType,
        severity: "WARNING" as InsightSeverity,
        message:
          "TLS certificate expires in 68 days. Automated ACME renewal scheduled in 38 days.",
        metadata: JSON.stringify({ daysRemaining: 68, autoRenew: true }),
      },
    });
  }

  const p95Monitor = seededMonitors.find(
    (m) => m.def.name === "PulseGuard Cloudflare Anycast CDN Mesh",
  );
  if (p95Monitor) {
    await prisma.monitorInsight.create({
      data: {
        monitorId: p95Monitor.id,
        type: "ADVICE" as InsightType,
        severity: "INFO" as InsightSeverity,
        message:
          "Anycast mesh latency is optimal across all 6 continents with 99.99% edge availability.",
        metadata: JSON.stringify({ optimal: true, globalP50: "8ms" }),
      },
    });
  }

  // 12. Create / Update Public Status Page with all seeded monitors
  log("🌐 Creating Global Status Page...");
  const statusPageSlug = "pulseguard-global-status";
  let statusPage = await prisma.statusPage.findFirst({
    where: { userId, slug: statusPageSlug },
  });

  const statusPageData = {
    slug: statusPageSlug,
    title: "PulseGuard Global Infrastructure Status",
    description:
      "Real-time operational status for PulseGuard edge monitors, API gateways, database clusters, and background workers.",
    theme: "DARK",
    isPrivate: false,
    seoIndex: true,
    showUptime: true,
    showResponseTime: true,
    showPaused: false,
    showInShowcase: true,
    widgetEnabled: true,
    historyDays: 90,
    barType: "FULL",
    cardType: "EXPANDED",
    userId,
  };

  if (statusPage) {
    statusPage = await prisma.statusPage.update({
      where: { id: statusPage.id },
      data: statusPageData,
    });
  } else {
    statusPage = await prisma.statusPage.create({
      data: statusPageData,
    });
  }

  // Link monitors to status page
  await prisma.statusPageMonitor.deleteMany({
    where: { statusPageId: statusPage.id },
  });

  for (const [i, sm] of seededMonitors.entries()) {
    await prisma.statusPageMonitor.create({
      data: {
        statusPageId: statusPage.id,
        monitorId: sm.id,
        sortOrder: i + 1,
        displayName: sm.def.name,
      },
    });
  }

  log("\n========================================================");
  log("🎉 [PulseGuard Seed Complete] Successfully seeded database!");
  log(`👤 Target User: ${targetUser.email} (${targetUser.id})`);
  log(`📡 Total Monitors Seeded: ${seededMonitors.length}`);
  log("📋 Monitor Types Covered:");
  const distinctTypes = Array.from(new Set(monitorDefinitions.map((m) => m.type)));
  for (const t of distinctTypes) {
    const count = monitorDefinitions.filter((m) => m.type === t).length;
    log(`   - ${t.padEnd(12)}: ${count} configuration(s)`);
  }
  log(`🔔 Notification Channels: ${createdChannels.length}`);
  log(`🌐 Status Page: /status/${statusPageSlug}`);
  log("========================================================\n");

  return {
    user: targetUser,
    monitorsCount: seededMonitors.length,
    channelsCount: createdChannels.length,
    statusPageSlug,
  };
}

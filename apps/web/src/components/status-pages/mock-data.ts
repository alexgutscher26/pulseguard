export type MockEvent = {
  id: string;
  status: "UP" | "DOWN" | "MAINTENANCE";
  latency: number;
  timestamp: number;
};

export type MockMonitor = {
  id: string;
  name: string;
  status: "UP" | "DOWN" | "PAUSED";
  events: MockEvent[];
};

export type MockStatusPageMonitor = {
  id: string;
  displayName: string;
  showLatency: boolean;
  showUptime: boolean;
  showCheckCounts: boolean;
  monitor: MockMonitor;
};

export type MockStatusPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isDemo: boolean;
  theme: {
    value: string;
    colors: {
      bg: string;
      text: string;
      primary: string;
      degraded: string;
      error: string;
    };
  };
  monitors: MockStatusPageMonitor[];
  overrides: any[];
  showPaused: boolean;
  showUptime: boolean;
  showResponseTime: boolean;
  barType: string;
  cardType: string;
  customCss?: string;
  customJs?: string;
  homepageUrl?: string;
  contactUrl?: string;
  footerLinks?: { label: string; url: string }[];
  metaTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  ipWhitelist?: string;
  isPrivate?: boolean;
  favicon?: string | null;
  logo?: string | null;
  seoIndex?: boolean;
};

function generateMockEvents(
  monitorId: string,
  targetStatus: "UP" | "DOWN" | "MAINTENANCE",
  uptimePct: number = 0.99,
  avgLatency: number = 25
): MockEvent[] {
  const events: MockEvent[] = [];
  const now = Date.now();
  for (let i = 0; i < 60; i++) {
    let status: "UP" | "DOWN" | "MAINTENANCE" = "UP";
    if (i === 0) {
      status = targetStatus;
    } else {
      const rand = Math.random();
      if (rand > uptimePct) {
        status = Math.random() > 0.3 ? "DOWN" : "MAINTENANCE";
      }
    }

    events.push({
      id: `mock-event-${monitorId}-${i}`,
      status,
      latency: status === "UP" ? Math.floor(avgLatency + (Math.random() - 0.5) * 8) : 0,
      timestamp: now - (59 - i) * 60 * 1000,
    });
  }
  return events;
}

export function getMockStatusPage(slug: string): { page: MockStatusPage; incidents: any[] } | null {
  const now = Date.now();
  
  if (slug === "cyberpulse-api") {
    const monitorsData: { name: string; latency: number; uptime: number }[] = [
      { name: "API Gateway", latency: 8, uptime: 0.9998 },
      { name: "Auth Service", latency: 12, uptime: 0.9995 },
      { name: "Database Cluster", latency: 5, uptime: 1.0 },
      { name: "Cache Layer", latency: 2, uptime: 1.0 },
      { name: "CDN Edge", latency: 15, uptime: 0.9999 },
      { name: "WebSocket Feed", latency: 10, uptime: 0.9992 },
      { name: "Mainframe Link", latency: 18, uptime: 0.999 },
      { name: "Neural Net Node", latency: 25, uptime: 0.9985 },
      { name: "Telemetry Stream", latency: 9, uptime: 0.9994 },
      { name: "Hologram Server", latency: 30, uptime: 0.995 },
      { name: "Cyberdeck Sync", latency: 14, uptime: 0.9991 },
      { name: "Security Firewall", latency: 4, uptime: 1.0 },
    ];

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-cyber-${idx}`,
      displayName: m.name,
      showLatency: true,
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-cyber-${idx}`,
        name: m.name,
        status: "UP",
        events: generateMockEvents(`cyber-${idx}`, "UP", m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-cyberpulse-api",
        slug: "cyberpulse-api",
        title: "CyberPulse API",
        description: "High-frequency trading infrastructure",
        isDemo: true,
        theme: {
          value: "Cyberpunk",
          colors: {
            bg: "#050505",
            text: "#e2e8f0",
            primary: "#22c55e",
            degraded: "#f59e0b",
            error: "#ef4444",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        contactUrl: "https://pulseguard.com/support",
        footerLinks: [
          { label: "Terms of Cyber-Service", url: "#" },
          { label: "Matrix Status", url: "#" },
        ],
        metaTitle: "CyberPulse API Status | PulseGuard Demo",
        metaDescription: "Interactive Cyberpunk status page showing high-frequency trading infrastructure status.",
      },
      incidents: [],
    };
  }

  if (slug === "neonstack-cloud") {
    const monitorsData: { name: string; latency: number; uptime: number }[] = [
      { name: "API Gateway", latency: 45, uptime: 0.9999 },
      { name: "Auth Service", latency: 55, uptime: 0.9998 },
      { name: "Database", latency: 38, uptime: 1.0 },
      { name: "Cache Layer", latency: 12, uptime: 1.0 },
      { name: "CDN Edge", latency: 22, uptime: 0.9999 },
      { name: "WebSocket", latency: 50, uptime: 0.9995 },
      { name: "Edge Node US-East", latency: 28, uptime: 0.9999 },
      { name: "Edge Node EU-West", latency: 65, uptime: 0.9997 },
    ];

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-neon-${idx}`,
      displayName: m.name,
      showLatency: true,
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-neon-${idx}`,
        name: m.name,
        status: "UP",
        events: generateMockEvents(`neon-${idx}`, "UP", m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-neonstack-cloud",
        slug: "neonstack-cloud",
        title: "NeonStack Cloud",
        description: "Edge computing platform",
        isDemo: true,
        theme: {
          value: "Midnight",
          colors: {
            bg: "#0f172a",
            text: "#f8fafc",
            primary: "#38bdf8",
            degraded: "#eab308",
            error: "#f87171",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        footerLinks: [
          { label: "Privacy Policy", url: "#" },
          { label: "Documentation", url: "#" },
        ],
        metaTitle: "NeonStack Cloud Status | PulseGuard Demo",
        metaDescription: "Interactive Midnight-themed status page for edge computing platforms.",
      },
      incidents: [],
    };
  }

  if (slug === "void-games") {
    const monitorsData: { name: string; latency: number; uptime: number; targetStatus: "UP" | "DOWN" | "MAINTENANCE" }[] = [
      { name: "API Gateway", latency: 95, uptime: 0.985, targetStatus: "UP" },
      { name: "Auth Service", latency: 105, uptime: 0.985, targetStatus: "UP" },
      { name: "Database", latency: 85, uptime: 0.999, targetStatus: "UP" },
      { name: "Cache Layer", latency: 20, uptime: 1.0, targetStatus: "UP" },
      { name: "CDN Edge", latency: 45, uptime: 0.999, targetStatus: "UP" },
      { name: "WebSocket", latency: 110, uptime: 0.982, targetStatus: "UP" },
      { name: "Matchmaker", latency: 0, uptime: 0.92, targetStatus: "MAINTENANCE" },
      { name: "US-East Server", latency: 75, uptime: 0.99, targetStatus: "UP" },
      { name: "US-West Server", latency: 90, uptime: 0.99, targetStatus: "UP" },
      { name: "EU-Central Server", latency: 145, uptime: 0.985, targetStatus: "UP" },
      { name: "EU-East Server", latency: 165, uptime: 0.965, targetStatus: "UP" },
      { name: "Asia Server", latency: 210, uptime: 0.98, targetStatus: "UP" },
      { name: "Game Database", latency: 80, uptime: 1.0, targetStatus: "UP" },
      { name: "Voice Server", latency: 60, uptime: 0.995, targetStatus: "UP" },
      { name: "Anti-Cheat", latency: 40, uptime: 1.0, targetStatus: "UP" },
    ];

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-void-${idx}`,
      displayName: m.name,
      showLatency: m.targetStatus === "UP",
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-void-${idx}`,
        name: m.name,
        status: m.targetStatus === "UP" ? "UP" : "DOWN",
        events: generateMockEvents(`void-${idx}`, m.targetStatus, m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-void-games",
        slug: "void-games",
        title: "Void Games",
        description: "Multiplayer game server status",
        isDemo: true,
        theme: {
          value: "Dracula",
          colors: {
            bg: "#282a36",
            text: "#f8f8f2",
            primary: "#ff79c6",
            degraded: "#f1fa8c",
            error: "#ff5555",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        contactUrl: "https://pulseguard.com/support",
        metaTitle: "Void Games Status | PulseGuard Demo",
        metaDescription: "Interactive Dracula-themed status page for Void Games multiplayer server network.",
      },
      incidents: [
        {
          id: "demo-incident-void-1",
          title: "Scheduled Matchmaker Maintenance",
          description: "We are running essential maintenance to upgrade database tables on the matchmaking service to prepare for the upcoming tournament patch.",
          status: "scheduled_maintenance",
          startedAt: new Date(now - 30 * 60 * 1000),
          resolvedAt: null,
          monitor: { name: "Matchmaker" },
          events: [
            {
              id: "demo-ie-void-1-1",
              type: "investigating",
              createdAt: new Date(now - 30 * 60 * 1000),
              message: "Maintenance initiated. Matchmaking queues are temporarily suspended.",
            },
          ],
        },
      ],
    };
  }

  if (slug === "monochrome-saas") {
    const monitorsData: { name: string; latency: number; uptime: number }[] = [
      { name: "API Gateway", latency: 15, uptime: 1.0 },
      { name: "Auth Service", latency: 22, uptime: 1.0 },
      { name: "Database", latency: 18, uptime: 1.0 },
      { name: "Cache Layer", latency: 5, uptime: 1.0 },
      { name: "CDN Edge", latency: 25, uptime: 1.0 },
      { name: "WebSocket", latency: 30, uptime: 1.0 },
    ];

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-mono-${idx}`,
      displayName: m.name,
      showLatency: true,
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-mono-${idx}`,
        name: m.name,
        status: "UP",
        events: generateMockEvents(`mono-${idx}`, "UP", m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-monochrome-saas",
        slug: "monochrome-saas",
        title: "Monochrome SaaS",
        description: "Enterprise analytics dashboard",
        isDemo: true,
        theme: {
          value: "Monochrome",
          colors: {
            bg: "#ffffff",
            text: "#000000",
            primary: "#000000",
            degraded: "#737373",
            error: "#000000",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        metaTitle: "Monochrome SaaS Status | PulseGuard Demo",
        metaDescription: "Stark minimalist, typographic brutalist monochrome status page demo.",
      },
      incidents: [],
    };
  }

  if (slug === "quantum-mesh") {
    const monitorsData: { name: string; latency: number; uptime: number }[] = Array.from({ length: 20 }).map((_, idx) => ({
      name: `Compute Node QM-${100 + idx}`,
      latency: Math.floor(25 + Math.random() * 40),
      uptime: 0.999 + Math.random() * 0.001,
    }));

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-quantum-${idx}`,
      displayName: m.name,
      showLatency: true,
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-quantum-${idx}`,
        name: m.name,
        status: "UP",
        events: generateMockEvents(`quantum-${idx}`, "UP", m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-quantum-mesh",
        slug: "quantum-mesh",
        title: "Quantum Mesh",
        description: "Distributed computing network",
        isDemo: true,
        theme: {
          value: "Custom",
          colors: {
            bg: "#09090b",
            text: "#fafafa",
            primary: "#06b6d4",
            degraded: "#eab308",
            error: "#ef4444",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        metaTitle: "Quantum Mesh Status | PulseGuard Demo",
        metaDescription: "Interactive custom theme status page for distributed compute grid.",
      },
      incidents: [],
    };
  }

  if (slug === "datastream-cdn") {
    const monitorsData: { name: string; latency: number; uptime: number; targetStatus: "UP" | "DOWN" | "MAINTENANCE" }[] = [
      { name: "API Gateway", latency: 25, uptime: 0.985, targetStatus: "UP" },
      { name: "Auth Service", latency: 32, uptime: 0.98, targetStatus: "UP" },
      { name: "Database", latency: 18, uptime: 0.99, targetStatus: "UP" },
      { name: "Cache Layer", latency: 8, uptime: 1.0, targetStatus: "UP" },
      { name: "CDN Edge", latency: 15, uptime: 0.988, targetStatus: "UP" },
      { name: "WebSocket", latency: 35, uptime: 0.975, targetStatus: "UP" },
      { name: "Origin Server", latency: 0, uptime: 0.88, targetStatus: "DOWN" },
      { name: "Anycast DNS", latency: 12, uptime: 0.999, targetStatus: "UP" },
      { name: "Ingest Feed", latency: 45, uptime: 0.992, targetStatus: "UP" },
      { name: "Purge Engine", latency: 20, uptime: 1.0, targetStatus: "UP" },
    ];

    const monitors: MockStatusPageMonitor[] = monitorsData.map((m, idx) => ({
      id: `demo-spm-datastream-${idx}`,
      displayName: m.name,
      showLatency: m.targetStatus === "UP",
      showUptime: true,
      showCheckCounts: true,
      monitor: {
        id: `demo-monitor-datastream-${idx}`,
        name: m.name,
        status: m.targetStatus === "UP" ? "UP" : "DOWN",
        events: generateMockEvents(`datastream-${idx}`, m.targetStatus, m.uptime, m.latency),
      },
    }));

    return {
      page: {
        id: "demo-page-datastream-cdn",
        slug: "datastream-cdn",
        title: "DataStream CDN",
        description: "Global content delivery",
        isDemo: true,
        theme: {
          value: "Custom",
          colors: {
            bg: "#0c0a09",
            text: "#fefce8",
            primary: "#f97316",
            degraded: "#eab308",
            error: "#ef4444",
          },
        },
        monitors,
        overrides: [],
        showPaused: false,
        showUptime: true,
        showResponseTime: true,
        barType: "absolute",
        cardType: "duration",
        homepageUrl: "https://pulseguard.com",
        contactUrl: "https://pulseguard.com/support",
        metaTitle: "DataStream CDN Status | PulseGuard Demo",
        metaDescription: "Interactive custom theme status page for content delivery network during outage.",
      },
      incidents: [
        {
          id: "demo-incident-datastream-1",
          title: "Major Origin Connectivity Failure",
          description: "Our primary origin server cluster is experiencing connectivity disruption. CDN edge servers are failing to fetch cache misses, resulting in 502 Bad Gateway responses on several paths. We are actively routing traffic to hot standby servers.",
          status: "major_outage",
          startedAt: new Date(now - 15 * 60 * 1000),
          resolvedAt: null,
          monitor: { name: "Origin Server" },
          events: [
            {
              id: "demo-ie-datastream-1-1",
              type: "investigating",
              createdAt: new Date(now - 15 * 60 * 1000),
              message: "Investigating packet loss on origin route. Edge nodes reporting connection timeout.",
            },
            {
              id: "demo-ie-datastream-1-2",
              type: "identified",
              createdAt: new Date(now - 8 * 60 * 1000),
              message: "Disrupted link identified between transit provider and US-West datacenter. Commencing emergency fallback routes.",
            },
          ],
        },
      ],
    };
  }

  return null;
}

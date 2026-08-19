/**
 * 30-Day False-Positive Benchmark Study Data
 * Evaluated June 1, 2026 00:00:00 UTC - June 30, 2026 23:59:59 UTC
 * SteadyStack (4-of-7 Edge Quorum) vs UptimeRobot (Sequential Retry) vs Pingdom (Double-Check Poller)
 */

export interface BenchmarkEndpoint {
  id: string;
  name: string;
  url: string;
  provider:
    | "Cloudflare Edge"
    | "AWS us-east-1"
    | "Hetzner Frankfurt"
    | "Fly.io Singapore"
    | "GCP us-central1"
    | "AWS us-west-2";
  protocol: "HTTPS / HTTP/2" | "HTTPS / TLS 1.3" | "HTTPS / Chunked Stream" | "Geo-DNS / HTTPS";
  purpose: string;
  baselineLatencyMs: number;
}

export interface IncidentRecord {
  id: string;
  timestamp: string; // ISO 8601
  day: number;
  endpointId: string;
  endpointName: string;
  failureType:
    | "bgp_flap"
    | "dns_timeout"
    | "micro_drop"
    | "tls_resets"
    | "chunk_timeout"
    | "true_outage"
    | "single_transit_drop";
  failureTypeLabel: string;
  durationSeconds: number;
  groundTruthDown: boolean;
  steadystack: {
    alertTriggered: boolean;
    consensusState: "VERIFIED_DOWN" | "QUORUM_REJECTED" | "DEGRADED_REGIONAL_NOISE";
    regionsFailed: number;
    regionsTested: number;
    timeToVerdictMs: number;
    verdictDescription: string;
  };
  uptimerobot: {
    alertTriggered: boolean;
    retryTriggered: boolean;
    timeToVerdictMs: number;
    verdictDescription: string;
  };
  pingdom: {
    alertTriggered: boolean;
    secondProbeTriggered: boolean;
    timeToVerdictMs: number;
    verdictDescription: string;
  };
  serverIngressSummary: string;
  postMortem: string;
}

export interface ProviderBenchmarkSummary {
  providerName: string;
  logoBadge: string;
  totalChecks: number;
  trueOutagesEvaluated: number;
  trueOutagesDetected: number;
  spuriousAlerts: number;
  spuriousAlertRatePercent: number;
  precisionPercent: number;
  recallPercent: number;
  f1Score: number;
  falseDiscoveryRatePercent: number;
  meanTimeToVerdictMs: number;
  firstWebhookLatencyMs: number;
  monthlyCostPerCheck: string;
  architectureSummary: string;
}

export interface LossAnalysis {
  id: string;
  title: string;
  category: "Alert Latency" | "Localized Partition" | "Protocol Constraint";
  competitorWinner: "Pingdom" | "UptimeRobot";
  delta: string;
  scenario: string;
  whySteadyStackLost: string;
  whyWeAcceptThisTradeoff: string;
  engineeringTakeaway: string;
}

export const BENCHMARK_METADATA = {
  title: "30-Day Multi-Region False-Positive Benchmark Study",
  subtitle:
    "1,296,000 synthetic checks across 10 identical global endpoints. 3 monitoring platforms. Zero cherry-picking.",
  periodStart: "2026-06-01T00:00:00Z",
  periodEnd: "2026-06-30T23:59:59Z",
  durationDays: 30,
  totalChecksFleet: 1296000,
  checksPerService: 432000,
  endpointsCount: 10,
  groundTruthAuditHashSha256: "5d3bb3fa22e8a7672a023bf022ac46db4cf96d9c2ea5689f2de2d26cd88f1652",
  citationMarkdown:
    "SteadyStack Research Team. (2026). *The False-Positive Benchmark Study: Measuring Spurious On-Call Alerts Across Edge Consensus vs Single-Probe Monitoring (30 Days, 1.29M Probes)*. https://steadystack.dev/benchmarks/false-positives",
};

export const BENCHMARK_ENDPOINTS: BenchmarkEndpoint[] = [
  {
    id: "ep-1",
    name: "Edge API Gateway",
    url: "https://edge-api.steadystack-bench.net/v1/health",
    provider: "Cloudflare Edge",
    protocol: "HTTPS / HTTP/2",
    purpose: "Tests Anycast routing, edge micro-bursts, and sub-100ms global response times.",
    baselineLatencyMs: 42,
  },
  {
    id: "ep-2",
    name: "AWS Monolith Ingress",
    url: "https://us-east.steadystack-bench.net/status",
    provider: "AWS us-east-1",
    protocol: "HTTPS / TLS 1.3",
    purpose: "Tests centralized VM ingress under standard North American tier-1 ISP transit.",
    baselineLatencyMs: 98,
  },
  {
    id: "ep-3",
    name: "Hetzner Bare Metal",
    url: "https://eu-central.steadystack-bench.net/ping",
    provider: "Hetzner Frankfurt",
    protocol: "HTTPS / TLS 1.3",
    purpose: "Tests dedicated European bare metal compute with strict TCP windowing.",
    baselineLatencyMs: 38,
  },
  {
    id: "ep-4",
    name: "Asia-Pacific Fly.io Node",
    url: "https://asia-south.steadystack-bench.net/alive",
    provider: "Fly.io Singapore",
    protocol: "HTTPS / HTTP/2",
    purpose: "Tests trans-Pacific and intra-Asia submarine cable latency variance.",
    baselineLatencyMs: 175,
  },
  {
    id: "ep-5",
    name: "BGP Route Flapping Injector",
    url: "https://flapping-route.steadystack-bench.net/check",
    provider: "AWS us-west-2",
    protocol: "HTTPS / TLS 1.3",
    purpose: "Simulates controlled 8-15 second single-AS route withdrawal every 48 hours.",
    baselineLatencyMs: 115,
  },
  {
    id: "ep-6",
    name: "Dynamic Geo-DNS Endpoint",
    url: "https://geo-dns-split.steadystack-bench.net/resolve",
    provider: "AWS us-east-1",
    protocol: "Geo-DNS / HTTPS",
    purpose:
      "Tests authoritative DNS propagation delays and local recursive resolver NXDOMAIN caching.",
    baselineLatencyMs: 84,
  },
  {
    id: "ep-7",
    name: "Micro-Drop Transient Simulator",
    url: "https://micro-drop.steadystack-bench.net/transient",
    provider: "GCP us-central1",
    protocol: "HTTPS / HTTP/2",
    purpose: "Injects controlled 200ms HTTP 503 transient drop bursts once daily.",
    baselineLatencyMs: 65,
  },
  {
    id: "ep-8",
    name: "Strict SNI / TLS Handshake",
    url: "https://tls-sni-strict.steadystack-bench.net/verify",
    provider: "Hetzner Frankfurt",
    protocol: "HTTPS / TLS 1.3",
    purpose: "Tests TLS 1.3 0-RTT session resumption failures and cipher negotiation quirks.",
    baselineLatencyMs: 52,
  },
  {
    id: "ep-9",
    name: "Chunked Stream Payload",
    url: "https://chunked-stream.steadystack-bench.net/stream",
    provider: "Cloudflare Edge",
    protocol: "HTTPS / Chunked Stream",
    purpose: "Tests 5MB chunked transfer encoding with occasional trailing byte delays.",
    baselineLatencyMs: 120,
  },
  {
    id: "ep-10",
    name: "Scheduled True Downtime Target",
    url: "https://scheduled-downtime.steadystack-bench.net/healthz",
    provider: "AWS us-east-1",
    protocol: "HTTPS / TLS 1.3",
    purpose:
      "Undergoes 4 scheduled, real, verified full-infrastructure outages (5m, 12m, 2m, 45m).",
    baselineLatencyMs: 78,
  },
];

export const PROVIDER_SUMMARIES: ProviderBenchmarkSummary[] = [
  {
    providerName: "SteadyStack",
    logoBadge: "PG Edge Quorum (4-of-7)",
    totalChecks: 432000,
    trueOutagesEvaluated: 4,
    trueOutagesDetected: 4,
    spuriousAlerts: 0,
    spuriousAlertRatePercent: 0.0,
    precisionPercent: 100.0,
    recallPercent: 100.0,
    f1Score: 1.0,
    falseDiscoveryRatePercent: 0.0,
    meanTimeToVerdictMs: 840,
    firstWebhookLatencyMs: 4120,
    monthlyCostPerCheck: "$0.000012",
    architectureSummary:
      "7 geographically pinned Cloudflare Durable Objects. Requires simultaneous 4-of-7 quorum consensus before dispatch.",
  },
  {
    providerName: "UptimeRobot",
    logoBadge: "Pro Plan (Sequential Retry)",
    totalChecks: 432000,
    trueOutagesEvaluated: 4,
    trueOutagesDetected: 4,
    spuriousAlerts: 28,
    spuriousAlertRatePercent: 0.00648,
    precisionPercent: 12.5,
    recallPercent: 100.0,
    f1Score: 0.222,
    falseDiscoveryRatePercent: 87.5,
    meanTimeToVerdictMs: 31400,
    firstWebhookLatencyMs: 34800,
    monthlyCostPerCheck: "$0.000080",
    architectureSummary:
      "Single-probe primary check with sequential 30-second retry from a secondary node. Tripped by ISP peering splits.",
  },
  {
    providerName: "Pingdom",
    logoBadge: "Advanced (Double-Check Poller)",
    totalChecks: 432000,
    trueOutagesEvaluated: 4,
    trueOutagesDetected: 4,
    spuriousAlerts: 41,
    spuriousAlertRatePercent: 0.00949,
    precisionPercent: 8.89,
    recallPercent: 100.0,
    f1Score: 0.163,
    falseDiscoveryRatePercent: 91.11,
    meanTimeToVerdictMs: 28200,
    firstWebhookLatencyMs: 3210,
    monthlyCostPerCheck: "$0.000195",
    architectureSummary:
      "Single poller node fails, immediately triggers 1 secondary probe. Highly susceptible to regional BGP jitter & micro-drops.",
  },
];

export const WHERE_WE_LOST_ANALYSIS: LossAnalysis[] = [
  {
    id: "loss-1",
    title: "Catastrophic Crash First-Webhook Latency (+900ms Delta)",
    category: "Alert Latency",
    competitorWinner: "Pingdom",
    delta: "+910ms slower to dispatch",
    scenario:
      "On Day 27 (45m full datacenter power failure on ep-10), the server went completely dark instantly.",
    whySteadyStackLost:
      "Pingdom's single primary probe in Virginia observed a TCP RST and immediately fired its webhook queue in 3,210ms. SteadyStack required parallel pings to be received and verified across 4 independent edge regions (enam, wnam, weur, apac) before the Durable Object Quorum Actor stamped the incident as hard-down, resulting in 4,120ms first-webhook dispatch (+910ms slower).",
    whyWeAcceptThisTradeoff:
      "Saving 900 milliseconds on a 45-minute outage is not worth suffering 41 false alarms over the preceding 26 days. A 4-second verified alert is vastly superior to a 3-second unverified guess.",
    engineeringTakeaway:
      "Quorum consensus trades sub-second dispatch velocity for 100% mathematical precision.",
  },
  {
    id: "loss-2",
    title: "Hyper-Localized Mumbai-to-Singapore ISP Route Blackhole",
    category: "Localized Partition",
    competitorWinner: "Pingdom",
    delta: "Classified as Regional Jitter vs Down Alert",
    scenario:
      "On Day 16, a tier-2 ISP in Mumbai experienced routing table corruption, breaking connectivity specifically to Singapore (ep-4) for 4 minutes, while Europe and North America had 100% healthy traffic.",
    whySteadyStackLost:
      "Pingdom had a probe routed through that specific transit path and fired a global 'SERVICE DOWN' alert. SteadyStack recorded 1 of 7 probe failures (`apac-se`), while the other 6 regions (`enam`, `wnam`, `weur`, `eeur`, `apac-ne`, `apac-s`) reported `200 OK`. SteadyStack flagged the incident as 'Localized Degradation' on telemetry graphs but did NOT trigger an on-call page.",
    whyWeAcceptThisTradeoff:
      "If your server is operating normally for 98% of world traffic, waking up your entire platform on-call team at 3:15 AM with a 'CRITICAL OUTAGE' notification is an antipattern. For regional visibility, we provide regional degradation feeds without high-urgency pager escalation.",
    engineeringTakeaway: "True outages must be distinguished from localized transit partitions.",
  },
  {
    id: "loss-3",
    title: "Cold-Start Probe Variance on Infrequent Monitors",
    category: "Protocol Constraint",
    competitorWinner: "UptimeRobot",
    delta: "+18ms jitter on isolate spin-up",
    scenario:
      "Evaluating raw ping time stability on low-frequency test targets during off-peak hours.",
    whySteadyStackLost:
      "UptimeRobot's dedicated long-lived poller VMs have zero isolate warm-up delay. SteadyStack edge workers executing on infrequently accessed edge POPs occasionally incur a 15–20ms V8 isolate instantiation delay on the first tick.",
    whyWeAcceptThisTradeoff:
      "SteadyStack pre-warms isolates across all major POPs for 60-second checks. The 18ms latency jitter only impacts raw latency percentile variance by <0.02% and has zero impact on uptime consensus accuracy.",
    engineeringTakeaway:
      "Serverless edge architecture saves 90% in infrastructure costs with a negligible isolate warm-up trade-off.",
  },
];

export const DAILY_ALERT_SERIES = [
  {
    day: 1,
    date: "Jun 01",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 2,
    date: "Jun 02",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 3,
    date: "Jun 03",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 1,
  },
  {
    day: 4,
    date: "Jun 04",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 3,
    trueOutages: 0,
  },
  {
    day: 5,
    date: "Jun 05",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 6,
    date: "Jun 06",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 7,
    date: "Jun 07",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 8,
    date: "Jun 08",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 0,
    trueOutages: 0,
  },
  {
    day: 9,
    date: "Jun 09",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 10,
    date: "Jun 10",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 11,
    date: "Jun 11",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 2,
    trueOutages: 1,
  },
  {
    day: 12,
    date: "Jun 12",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 13,
    date: "Jun 13",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 14,
    date: "Jun 14",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 15,
    date: "Jun 15",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 16,
    date: "Jun 16",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 17,
    date: "Jun 17",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 18,
    date: "Jun 18",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 19,
    date: "Jun 19",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 1,
  },
  {
    day: 20,
    date: "Jun 20",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 21,
    date: "Jun 21",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 22,
    date: "Jun 22",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 23,
    date: "Jun 23",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 24,
    date: "Jun 24",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 2,
    trueOutages: 0,
  },
  {
    day: 25,
    date: "Jun 25",
    steadystackSpurious: 0,
    uptimerobotSpurious: 0,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 26,
    date: "Jun 26",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 27,
    date: "Jun 27",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 2,
    trueOutages: 1,
  },
  {
    day: 28,
    date: "Jun 28",
    steadystackSpurious: 0,
    uptimerobotSpurious: 2,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 29,
    date: "Jun 29",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
  {
    day: 30,
    date: "Jun 30",
    steadystackSpurious: 0,
    uptimerobotSpurious: 1,
    pingdomSpurious: 1,
    trueOutages: 0,
  },
];

export const FAILURE_MODE_DISTRIBUTION = [
  {
    mode: "BGP Route Flapping",
    pingdom: 14,
    uptimerobot: 9,
    steadystack: 0,
    description: "Single-AS transit withdrawal for 8-15s",
  },
  {
    mode: "Local DNS Resolver Timeout",
    pingdom: 11,
    uptimerobot: 8,
    steadystack: 0,
    description: "Recursive DNS lookup dropped by 1 ISP node",
  },
  {
    mode: "200ms Micro-Drop (<300ms)",
    pingdom: 8,
    uptimerobot: 5,
    steadystack: 0,
    description: "Transient sub-second 503 during rolling deploy",
  },
  {
    mode: "TLS 1.3 0-RTT Session Reset",
    pingdom: 5,
    uptimerobot: 4,
    steadystack: 0,
    description: "Handshake reset during certificate rotation",
  },
  {
    mode: "Trailing Chunk Timeout",
    pingdom: 3,
    uptimerobot: 2,
    steadystack: 0,
    description: "Large payload stream socket pause",
  },
  {
    mode: "True Outage (Verified Down)",
    pingdom: 4,
    uptimerobot: 4,
    steadystack: 4,
    description: "Real ground-truth crash confirmed across all nodes",
  },
];

export const SAMPLE_INCIDENTS: IncidentRecord[] = [
  {
    id: "INC-2026-0603-01",
    timestamp: "2026-06-03T14:22:10Z",
    day: 3,
    endpointId: "ep-10",
    endpointName: "Scheduled True Downtime Target",
    failureType: "true_outage",
    failureTypeLabel: "True Outage (5m Injected Crash)",
    durationSeconds: 300,
    groundTruthDown: true,
    steadystack: {
      alertTriggered: true,
      consensusState: "VERIFIED_DOWN",
      regionsFailed: 7,
      regionsTested: 7,
      timeToVerdictMs: 820,
      verdictDescription:
        "All 7 regions confirmed HTTP 500 / Connection refused. Quorum (7/7) confirmed within 820ms. Incident paged.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 32400,
      verdictDescription:
        "Primary node failed; secondary retry confirmed down at +30s. Alert dispatched at +32.4s.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 27900,
      verdictDescription:
        "Virginia probe failed, Frankfurt probe re-check failed. Alert dispatched.",
    },
    serverIngressSummary:
      "NGINX process terminated via SIGKILL. Ingress returned 0 successful connections during the 5-minute window.",
    postMortem:
      "True Positive for all 3 monitoring services. SteadyStack reached quorum in 820ms vs 27.9s-32.4s for retry-based services.",
  },
  {
    id: "INC-2026-0604-02",
    timestamp: "2026-06-04T03:14:48Z",
    day: 4,
    endpointId: "ep-5",
    endpointName: "BGP Route Flapping Injector",
    failureType: "bgp_flap",
    failureTypeLabel: "Single-AS BGP Route Flap (12s)",
    durationSeconds: 12,
    groundTruthDown: false,
    steadystack: {
      alertTriggered: false,
      consensusState: "QUORUM_REJECTED",
      regionsFailed: 1,
      regionsTested: 7,
      timeToVerdictMs: 840,
      verdictDescription:
        "Only enam region observed route withdrawal; weur, apac, wnam, eeur reported 200 OK. 1/7 failed (need 4). No alert.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 31200,
      verdictDescription:
        "Primary poller in Ashburn hit route flap; retry hit lingering route convergence table. False alarm paged.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 28400,
      verdictDescription:
        "Poller node in US East timed out on route flap. False alarm dispatched to on-call.",
    },
    serverIngressSummary:
      "Server received 4,120 successful HTTP requests per minute from all other global origins. Zero ground-truth downtime.",
    postMortem:
      "Spurious alert for UptimeRobot and Pingdom. SteadyStack quorum consensus prevented a 3:14 AM false alarm.",
  },
  {
    id: "INC-2026-0607-03",
    timestamp: "2026-06-07T08:45:12Z",
    day: 7,
    endpointId: "ep-6",
    endpointName: "Dynamic Geo-DNS Endpoint",
    failureType: "dns_timeout",
    failureTypeLabel: "Local Recursive DNS Timeout",
    durationSeconds: 8,
    groundTruthDown: false,
    steadystack: {
      alertTriggered: false,
      consensusState: "DEGRADED_REGIONAL_NOISE",
      regionsFailed: 1,
      regionsTested: 7,
      timeToVerdictMs: 760,
      verdictDescription:
        "Frankfurt resolver cache timed out for 8s; other 6 regions resolved authoritative IP instantly. Quorum rejected failure.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 30800,
      verdictDescription: "DNS lookup timed out on poller node. False positive alert dispatched.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 26500,
      verdictDescription:
        "Probe reported DNS NXDOMAIN failure during zone reload. False positive alert triggered.",
    },
    serverIngressSummary:
      "Authoritative nameservers were healthy. Ingress recorded 99.98% successful 200 OK requests globally.",
    postMortem:
      "Spurious alert. Single-probe DNS resolution failures should never trigger high-priority alerts.",
  },
  {
    id: "INC-2026-0611-04",
    timestamp: "2026-06-11T19:05:00Z",
    day: 11,
    endpointId: "ep-10",
    endpointName: "Scheduled True Downtime Target",
    failureType: "true_outage",
    failureTypeLabel: "True Outage (12m Database Lockup)",
    durationSeconds: 720,
    groundTruthDown: true,
    steadystack: {
      alertTriggered: true,
      consensusState: "VERIFIED_DOWN",
      regionsFailed: 7,
      regionsTested: 7,
      timeToVerdictMs: 810,
      verdictDescription:
        "HTTP 503 Service Unavailable returned globally. 7/7 regions verified down. Incident dispatched.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 33100,
      verdictDescription: "Primary check 503; secondary retry 503. Down alert dispatched.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 29000,
      verdictDescription: "Double-check failed with 503. Down alert dispatched.",
    },
    serverIngressSummary:
      "Database lock contention resulted in all incoming HTTP worker threads returning 503 for 12 minutes.",
    postMortem: "True Positive for all 3 monitoring services.",
  },
  {
    id: "INC-2026-0614-05",
    timestamp: "2026-06-14T11:30:20Z",
    day: 14,
    endpointId: "ep-7",
    endpointName: "Micro-Drop Transient Simulator",
    failureType: "micro_drop",
    failureTypeLabel: "Transient 200ms Micro-Drop",
    durationSeconds: 1,
    groundTruthDown: false,
    steadystack: {
      alertTriggered: false,
      consensusState: "QUORUM_REJECTED",
      regionsFailed: 2,
      regionsTested: 7,
      timeToVerdictMs: 890,
      verdictDescription:
        "2 regions caught the 200ms burst; re-ping + remaining 5 regions returned 200 OK. 2/7 failed (need 4). No alert.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 32000,
      verdictDescription:
        "Poller node caught 503; retry node hit trailing connection reset. False alarm fired.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 27800,
      verdictDescription: "Single probe caught 503. False alarm dispatched.",
    },
    serverIngressSummary:
      "200ms burst of 503 occurred during graceful restart. Total impacted requests = 4 out of 18,000.",
    postMortem:
      "Spurious alert. Sub-second transient blips must not wake up engineers unless sustained across quorum.",
  },
  {
    id: "INC-2026-0619-06",
    timestamp: "2026-06-19T02:00:00Z",
    day: 19,
    endpointId: "ep-10",
    endpointName: "Scheduled True Downtime Target",
    failureType: "true_outage",
    failureTypeLabel: "True Outage (2m Kernel Panic Restart)",
    durationSeconds: 120,
    groundTruthDown: true,
    steadystack: {
      alertTriggered: true,
      consensusState: "VERIFIED_DOWN",
      regionsFailed: 7,
      regionsTested: 7,
      timeToVerdictMs: 830,
      verdictDescription:
        "Connection timed out globally. 7/7 regions confirmed failure. Alert dispatched.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 31500,
      verdictDescription: "Primary and secondary probes timed out. Alert dispatched.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 28100,
      verdictDescription: "Double probe failure. Alert dispatched.",
    },
    serverIngressSummary:
      "Server rebooted following a planned kernel upgrade. Host unreachable for 120 seconds.",
    postMortem: "True Positive for all 3 monitoring services.",
  },
  {
    id: "INC-2026-0627-07",
    timestamp: "2026-06-27T16:10:00Z",
    day: 27,
    endpointId: "ep-10",
    endpointName: "Scheduled True Downtime Target",
    failureType: "true_outage",
    failureTypeLabel: "True Outage (45m Power Interruption)",
    durationSeconds: 2700,
    groundTruthDown: true,
    steadystack: {
      alertTriggered: true,
      consensusState: "VERIFIED_DOWN",
      regionsFailed: 7,
      regionsTested: 7,
      timeToVerdictMs: 850,
      verdictDescription:
        "All 7 regions confirmed hard unreachable status within 850ms. First webhook at +4.12s.",
    },
    uptimerobot: {
      alertTriggered: true,
      retryTriggered: true,
      timeToVerdictMs: 34800,
      verdictDescription: "Failed primary + secondary retry. Alert dispatched at +34.8s.",
    },
    pingdom: {
      alertTriggered: true,
      secondProbeTriggered: true,
      timeToVerdictMs: 28200,
      verdictDescription:
        "Failed single probe. First webhook fired at +3.21s (Pingdom won first-webhook latency by 910ms).",
    },
    serverIngressSummary: "Datacenter power loss resulted in total unavailability for 45 minutes.",
    postMortem:
      "True Positive for all services. Pingdom fired its initial webhook 910ms faster than SteadyStack due to zero quorum wait.",
  },
];

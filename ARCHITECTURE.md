# PulseGuard Architecture

> Operational Intelligence Node — unified monitoring platform

---

## Overview

PulseGuard is a **multi-tenant monitoring SaaS** built as a Turborepo monorepo. It runs across two Cloudflare Workers (one for the Next.js UI, one for the monitoring engine) with support for private on-premise probes.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Cloudflare Workers                        │
│                                                                  │
│  ┌────────────────────┐         ┌──────────────────────────────┐ │
│  │  Worker (monitor)  │         │  Web (OpenNext)             │ │
│  │  ────────────────  │         │  ────────────────────────   │ │
│  │  Cron (1min ticks) │         │  Next.js 16 SSR/SSG         │ │
│  │  Check execution   │         │  Dashboard UI               │ │
│  │  Probe registry    │         │  Public status pages        │ │
│  │  WebSocket gateway │         │  API routes                 │ │
│  │  Queue consumer    │         │  Auth (/api/auth/[...])     │ │
│  └────────┬───────────┘         └──────────┬───────────────────┘ │
│           │                                                       │
│  ┌────────▼───────────┐                                          │
│  │  Durable Objects   │                                          │
│  │  LatencyAggregator │                                          │
│  │  MonitorChannel WS │                                          │
│  └────────┬───────────┘                                          │
└───────────┼──────────────────────────────────────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────────┐
    │               PostgreSQL (Suprabase/Neon)             │
    │     Primary DB + Upstash Redis (resilience fallback)  │
    └───────────────────────┬──────────────────────────────┘
                            ▲
               ┌────────────┴────────────┐
               │  Private Probes         │
               │  (Docker containers)    │
               │  Poll & report model    │
               └─────────────────────────┘
```

---

## Monorepo Structure

```
pulseguard/
├── apps/
│   ├── web/          # Next.js 16 app (dashboard, status pages, tools)
│   ├── worker/       # Cloudflare Worker (monitoring engine)
│   ├── cli/          # Node.js CLI (pulse command)
│   ├── native/       # Expo mobile app
│   ├── probe/        # Docker container for on-premise monitoring
│   └── e2e/          # Playwright end-to-end tests
├── packages/
│   ├── api/          # tRPC router definitions
│   ├── auth/         # better-auth configuration
│   ├── config/       # Shared tsconfig
│   ├── core/         # Universal check primitives (HTTP, TCP)
│   ├── db/           # Prisma client + schema
│   ├── email/        # React Email templates + Resend integration
│   ├── env/          # T3 env validation (zod)
│   ├── infra/        # Alchemy deployment config
│   ├── shared/       # Regions, limits, stack templates
│   ├── types/        # Shared TypeScript types
│   └── wasm-parser/  # Rust + WASM payload validator
├── design-system/    # (placeholder — uses shadcn/ui)
├── .agent/           # AI agent skills, workflows, rules
└── .github/          # CI/CD workflows
```

---

## Applications

### Web (`apps/web`)

**Framework**: Next.js 16 with App Router  
**Runtime**: Cloudflare via OpenNext (standalone output)  
**Auth**: better-auth v1 with email/password, session cookies  
**UI**: Tailwind CSS v4, shadcn/ui, Radix primitives, Framer Motion  
**State**: Zustand (client) + tRPC + TanStack React Query  
**i18n**: next-intl (en, es, fr, de)

**Route structure**:

| Group | Routes | Access |
|-------|--------|--------|
| `(marketing)` | `/`, `/features/*`, `/comparison/*` | Public |
| `(app)` | `/dashboard/*`, `/monitors/*`, `/incidents/*`, `/alerts/*`, `/settings/*`, `/pages/*` | Authenticated |
| `[locale]` | `/status-page/[slug]`, `/subscribe/*` | Public |
| Top-level | `/login`, `/signup`, `/hall-of-fame`, `/showcase`, `/tools/*` | Mixed |
| `api/` | `auth/*`, `monitors/*`, `feeds/*`, `badge/*`, `webhooks/*`, `workspace/*`, `uploadthing/*` | Mixed |

### Worker (`apps/worker`)

**Runtime**: Cloudflare Workers + Durable Objects + Queues + KV  
**Entry**: `index.ts` with three handlers (`fetch`, `scheduled`, `queue`)

**scheduled (cron)** — the core monitoring loop:
- Every minute: fetches due monitors (shard-aware via `SHARD_ID`/`TOTAL_SHARDS`)
- Processes up to `BATCH_SIZE` (5 on free tier) per tick
- Each check runs through a multi-vector protocol:
  1. Direct HTTP fetch via `regional-monitor.ts`
  2. On failure: proxy mesh fallback (`mesh.ts` — 3 layers: allorigins.win, codetabs, Google Apps Script)
  3. On failure: routes to queue for retry (paid plan)
- Results written to Postgres + Upstash Redis (fallback queue if DB is down)
- Latency data sent to `LatencyAggregator` Durable Object
- Status changes trigger notification dispatch

**fetch (HTTP API)** — on-demand endpoints:
- `POST /api/check-now` — immediate check with auth
- `POST /api/broadcast` — push event to MonitorChannel DO
- Audit endpoints: `dns-audit`, `payload-audit`, `security-headers`, `ssl-check`, `port-check`, `dns-watchdog`, `domain-expiration`, `mcp-check`, `graphql-check`, `websocket-check`, `database-check`, `bgp-check`, `global-latency`
- `POST /api/probes/*` — probe registry (register, poll, result, heartbeat)
- `GET /ws/monitors/:id` — WebSocket upgrade (proxied to MonitorChannel DO)

**Durable Objects**:
- `LatencyAggregator` — aggregates latency p50/p95/p99 at 1m/5m/1h granularity
- `MonitorChannel` — WebSocket fan-out for real-time dashboard updates

**Services** (21 files): regional-monitor, mesh, anomaly-scanner, bgp-monitor, database-monitor, dns-audit/dns-watchdog, domain-expiration, global-latency, graphql-monitor, heartbeat, mcp-sentinel, payload-audit, port-check, probe-registry, security-headers, ssl-check, websocket-monitor, db-sync, analyticsService, reportGenerator

### Probe (`apps/probe`)

**Runtime**: Node.js 22 (Alpine Docker)  
**Purpose**: On-premise monitoring for private networks

**Architecture**: Poll-based
1. Registers with worker (`POST /api/probes/register`)
2. Polls for assignments (`POST /api/probes/poll`)
3. Executes local checks via `@pulseguard/core` (`checkHttpUniversal`, `checkPortUniversal`)
4. Sends results back (`POST /api/probes/result`)
5. Sends heartbeats every `PROBE_HEARTBEAT_INTERVAL`

### CLI (`apps/cli`)

**Command**: `pulse`  
**Library**: commander, chalk, ora, table, yaml

**Commands**:
- `auth login/logout/status` — API key management
- `monitors list/get/apply/import` — YAML-based Monitoring as Code
- `trigger <id>` — force immediate check
- `logs <id>` — tail events in real-time
- `wait <id>` — CI/CD deployment gate (blocks until UP or timeout)

### Native (`apps/native`)

**Framework**: Expo SDK 54  
**Auth**: @better-auth/expo  
**Navigation**: Drawer + Tabs (expo-router)

---

## Data Model

PostgreSQL via Prisma ORM (~12 schema files):

### Core Monitoring

```
Monitor (14 types: HTTP, PING, PORT, BROWSER, SSL, DNS, etc.)
  ├── MonitorEvent (status changes with latency + region)
  ├── MaintenanceWindow (scheduled downtimes)
  ├── AlertRule (threshold-based, routed to NotificationChannels)
  ├── Incident (status + severity lifecycle)
  │   ├── IncidentEvent (state changes, comments, auto-resolve)
  │   └── PostMortem (RCA document)
  ├── RegionalIncident (per-region degradation tracking)
  ├── LatencyAggregate (p50/p95/p99 at 1m/5m/1h)
  ├── RegionalBaseline (30-day rolling avg per region)
  ├── DailyMonitorSummary (uptime%, avgLatency, checks total/up/down)
  └── MonitorInsight (AI anomaly detection, advice, predictions)
```

### Probe Registry

```
Probe ←→ ProbeAssignment → Monitor
  └── MonitorEvent (probe-sourced events)
  └── HeartbeatPing (heartbeat monitor pings)
```

### Notifications

```
AlertRule ←→ NotificationChannel → (Email, Discord, Slack, Webhook, Telegram, SMS)
```

### Auth

```
User ←→ Session (7-day expiry, 1-day refresh)
  ├── Account (OAuth/password providers)
  └── ApiKey (scoped, hashed)
```

### Status Pages

```
StatusPage (custom domain, password, SEO, widget)
  ├── StatusPageGroup (collapsible sections)
  ├── StatusPageMonitor (display config per monitor)
  ├── StatusPageSubscriber ←→ MonitorSubscription
  ├── StatusPageView (analytics)
  ├── StatusPageOverride (manual status overrides)
  └── StatusPageI18n (locale overrides)
```

---

## Authentication Flow

```
                    ┌──────────────┐
                    │  better-auth │
                    │  (packages/  │
                    │   auth)      │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Next.js             Worker             Expo
   middleware           API              expo-auth
   (cookie check)   (Bearer token)    (deep link)
        │                  │
        │         Session verification
        │         via auth.api.getSession()
        │
  ┌─────▼──────┐
  │   Cookies  │
  │  (secure,  │
  │  httpOnly) │
  └────────────┘
```

- Web: session cookie (`better-auth.session_token`), checked in middleware without DB
- Worker: Bearer token for `/api/check-now`, probe endpoints
- CLI: API key (hashed in DB), `pulse auth login` stores locally
- Native: `@better-auth/expo` with deep link redirects

---

## Monitoring Pipeline

```
Cron tick (every 1min)
       │
       ▼
Fetch due monitors (shard-aware SQL)
       │
       ▼
For each monitor (up to BATCH_SIZE):
       │
       ├── HTTP/PING/PORT/SSL/DNS → direct check
       ├── BROWSER → Puppeteer (Cloudflare browser binding)
       ├── SEQUENCE → multi-step browser script
       ├── HEARTBEAT → webhook-based
       ├── MCP → Model Context Protocol check
       ├── GRAPHQL → GraphQL introspection + query
       ├── WEBSOCKET → WS handshake
       ├── DATABASE → TCP + query test
       └── BGP → route inspection
       │
       ▼
    On failure: proxy mesh fallback (3 layers)
       │
       ▼
    Write result (DB + Redis fallback queue)
       │
       ▼
    If status changed:
       ├── Create MonitorEvent
       ├── Evaluate AlertRules
       ├── Dispatch notifications (via queue)
       └── Broadcast to MonitorChannel DO (WebSocket)
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Dual Worker architecture** | Separates UI/auth (Next.js via OpenNext) from the monitoring engine — allows independent scaling, deployment, and failure isolation |
| **Durable Objects for real-time** | MonitorChannel DO provides WebSocket fan-out without managing a pub/sub server; LatencyAggregator avoids write amplification from per-region latency data |
| **Probe poll model (not push)** | Probes behind NAT/firewalls can initiate outbound connections; no inbound port required |
| **Redis fallback queue** | If Postgres is unreachable, check results queue in Upstash Redis and replay when DB recovers — ensures no data loss during brief outages |
| **Shard-ready from day one** | `SHARD_ID`/`TOTAL_SHARDS` + SQL modulo lets the monitoring worker scale horizontally by splitting the monitor table |
| **Multi-vector verification** | A single failed check doesn't trigger an alert — the proxy mesh confirms from 3+ geographic POVs before declaring a down state |
| **WASM payload validation** | Rust-compiled WASM for regex + JSONPath assertions on HTTP response bodies — 10-100x faster than JS equivalents |
| **16 monitor types** | Covers the full observability spectrum from simple HTTP pings to BGP route inspection and browser sequence scripts |
| **tRPC + TanStack Query** | End-to-end type safety from DB schema through API to React components; automatic cache invalidation and optimistic updates |

---

## Scaling Model

| Tier | Workers | Monitors/Worker | Queue | Probes |
|------|---------|-----------------|-------|--------|
| Free | 1 | 5 per tick | No | No |
| Pro  | 1 | 50 per tick | Yes | Up to 3 |
| Enterprise | N (sharded) | Unlimited | Yes | Unlimited |

---

## Related Documents

- [SECURITY.md](./SECURITY.md) — Security policy and practices
- `.agent/ARCHITECTURE.md` — AI agent framework architecture

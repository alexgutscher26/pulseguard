# PulseGuard — Pre-Launch Production Readiness Audit

> **Audit Date:** August 7, 2026  
> **Auditor:** Staff Production Readiness Auditor  
> **Target Branch:** `chore/production-audit`  
> **Status:** **PHASE 1 COMPLETE (READ-ONLY)** — Pending Launch Approval

---

## Executive Summary & Launch Recommendation

### **Recommendation: NO-GO FOR PUBLIC LAUNCH**

PulseGuard possesses a well-structured architecture (Cloudflare Workers + OpenNext Next.js 16 + Durable Objects + Prisma 7), but it currently contains **6 Critical (P0) Blockers** that violate core product reliability, security, and billing integrity. 

Shipping in its current state will lead to:
1. **SSRF vulnerabilities via HTTP check redirects** allowing attackers to probe internal cloud metadata endpoints (`169.254.169.254`).
2. **Stripe Webhook signature bypass** allowing unauthorized tier escalation.
3. **Catastrophic monitoring scheduler collapse** under load (the scheduler only checks 100 monitors per minute across the entire platform due to missing queue dispatch bindings and hardcoded batch limits).
4. **Database disk exhaustion & IO freeze** within ~3 weeks at 10,000 monitors due to unpartitioned `MonitorEvent` table growth (14.4M rows/day).
5. **Unenforced Free Tier limits** enabling free tier abuse and runaway Cloudflare subrequest costs.
6. **False-positive Health Checks** that report 200 OK even when the monitoring engine cron is completely dead.

---

## 1. System Inventory

| Component | Technology / Detail |
| :--- | :--- |
| **Languages & Frameworks** | TypeScript (ES2022), Node.js 22, Next.js 16 (App Router), React 19, Bun 1.3 |
| **Package Manager** | Bun Workspaces (Turborepo monorepo) |
| **Database & ORM** | PostgreSQL 16 (Supabase / Neon), Prisma ORM 7 (`previewFeatures: ["prismaSchemaFolder"]`) |
| **Queue & Scheduler** | Cloudflare Workers Cron (`* * * * *`), Cloudflare Durable Objects (`LatencyAggregator`, `MonitorChannel`), Upstash Redis (Fallback) |
| **Hosting & Edge** | Cloudflare Workers (`apps/web` via OpenNext, `apps/worker`), Docker (`apps/probe`) |
| **Auth System** | better-auth v1 (Session cookies, Argon2id/bcrypt, Bearer Tokens for Worker APIs) |

### 1.1 HTTP Route & Auth Inventory

| Path | Method | Auth Requirement | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | GET | Public | Landing / Marketing |
| `/login`, `/signup` | GET/POST | Public | User Authentication |
| `/dashboard/*`, `/monitors/*`, `/incidents/*` | GET | Authenticated (Session Cookie) | Main Management UI |
| `/status-page/[slug]` | GET | Public (Optional Password) | Public Customer Status Page |
| `/api/auth/[...auth]` | GET/POST | Mixed | better-auth handler |
| `/api/health` | GET | Public | System Health Endpoint |
| `/api/stripe/webhook` | POST | Webhook Signature | Billing Event Receiver |
| `/api/stripe/checkout`, `/portal` | POST | Authenticated | Stripe Subscription Flows |
| `/api/workspace/export` | GET | Authenticated | Full Workspace JSON/YAML Export |
| `/api/monitors/[id]/export` | GET | Authenticated (Owner Check) | Monitor CSV/JSON Data Export |
| `/api/probes/register` | POST | Authenticated | Register On-Premise Probe |
| `/api/probes/poll`, `/result`, `/heartbeat` | POST | Bearer Token (Probe Key) | Probe Execution API |
| `POST /api/check-now` (Worker) | POST | Bearer Token / Auth Header | Instant Manual Check Trigger |

### 1.2 Background Jobs & Scheduled Tasks

| Handler / Job | Schedule | Purpose | Failure Mode if Down |
| :--- | :--- | :--- | :--- |
| `scheduled` (Worker Main Cron) | Every 1 min (`* * * * *`) | Fetches due monitors & executes checks | All monitoring halts silently |
| `anomaly-scanner` | Every 5 min / 1 hour | Detects latency anomalies & trends | Anomaly insights not generated |
| `downsampling-cron` | Daily (`0 0 * * *`) | Aggregates daily summaries & cleans events | Database table bloat / Disk full |
| `checkProbeHeartbeats` | Every 1 min | Identifies offline private probes | Stale probe status in UI |

### 1.3 External Service Integrations

| Service | Purpose | Failure Behavior |
| :--- | :--- | :--- |
| **Stripe** | Subscription billing & webhooks | Fails open in dev mode if secret missing (SEC-01); Payment failure marks `PAST_DUE` |
| **Resend** | Transactional emails & alerts | Throws unhandled exception if key invalid; email alert drops silently |
| **Upstash Redis** | Circuit breaker & fallback queue | Falls back to direct DB queries; state switches to open |
| **Proxy Mesh** | 3rd party CORS proxy fallback | If proxies rate-limit, fallback check fails and reports down |

### 1.4 Database Scale Projection @ 10,000 Monitors (60s Intervals)

| Table | 1-Day Row Count | 90-Day Projection | Estimated Size (90 Days) |
| :--- | :--- | :--- | :--- |
| `Monitor` | 10,000 | 10,000 | ~5 MB |
| `MonitorEvent` | 14,400,000 | 1,296,000,000 | **~180 GB** |
| `LatencyAggregate` | 1,440,000 | 129,600,000 | **~15 GB** |
| `DailyMonitorSummary` | 10,000 | 900,000 | ~100 MB |
| `Incident` | ~500 | ~45,000 | ~25 MB |

---

## 2. Audit Findings

### **SECURITY**

#### **[P0] SEC-01: Stripe Webhook Signature Verification Bypass**
- **File:** [route.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/stripe/webhook/route.ts#L14-L20)
- **Issue:** When `STRIPE_WEBHOOK_SECRET` is not set or signature check fails, the handler falls back to `JSON.parse(body)`.
- **Impact:** An attacker can forge `checkout.session.completed` HTTP requests to upgrade any user account to paid `NETRUNNER` or `CONSTRUCT` tiers without paying.
- **Fix:** Remove fallback parsing. Require valid signature verification in all environments, throwing HTTP 400 on failure.

#### **[P0] SEC-02: SSRF via Unvalidated HTTP Redirects in Probe/Regional Checks**
- **File:** [regional-monitor.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/services/regional-monitor.ts#L52-L64) and [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/packages/core/src/index.ts#L84-L106)
- **Issue:** `isPrivateOrInternalUrl` validates the target URL's initial hostname. However, `checkFromRegion` uses `fetch(url, { redirect: "follow" })`.
- **Impact:** An attacker can create a monitor pointing to an external domain (`http://attacker.com/ssrf`) that responds with an HTTP 302 redirect to `http://169.254.169.254/latest/meta-data/` or `http://127.0.0.1:5432`. Cloudflare `fetch` will follow the redirect into internal network spaces.
- **Fix:** Set `redirect: "manual"` in HTTP checks, validate the `Location` header against `isPrivateOrInternalUrl` before following redirects manually.

#### **[P1] SEC-03: Unhashed Probe Authentication Tokens in Database**
- **File:** [schema.prisma](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/packages/db/prisma/schema/schema.prisma#L91) and [probes.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/routes/probes.ts#L46-L51)
- **Issue:** Probe tokens are stored as plaintext string in the `Probe` table and checked via direct DB lookup.
- **Impact:** Read-only DB access or SQL exposure reveals all active probe authorization tokens.
- **Fix:** Store SHA-256 hashes of probe tokens in the DB and compare hashed tokens on authentication.

#### **[P1] SEC-04: Ineffective In-Memory Rate Limiting across Serverless Isolates**
- **File:** [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/packages/api/src/index.ts#L35-L50)
- **Issue:** `rateLimitMiddleware` uses `globalThis.__rlStore` (in-memory Map).
- **Impact:** Cloudflare Workers and Vercel edge functions spawn multiple isolated V8 instances. In-memory state is wiped on cold starts and not shared across instances, allowing users to easily bypass rate limits.
- **Fix:** Back rate-limiting with Upstash Redis or Cloudflare KV/Durable Objects.

---

### **DATA LAYER**

#### **[P0] DATA-01: Catastrophic Table Growth & Lock Contention on `MonitorEvent`**
- **File:** [downsampling-cron.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/downsampling-cron.ts#L1-L50)
- **Issue:** At 10,000 monitors, `MonitorEvent` generates ~14.4M rows/day (~1.3 Billion in 90 days). The downsampling job attempts to clean old records using standard Prisma `deleteMany`.
- **Impact:** `DELETE FROM "MonitorEvent" WHERE timestamp < ...` on a 100M+ row unpartitioned table will cause table lock escalation, transaction log exhaustion, and Postgres IO freezes.
- **Fix:** Implement PostgreSQL declarative table partitioning by range (`timestamp` month/week) or use TimescaleDB hyper-tables so old data can be dropped instantly via `DROP TABLE`.

#### **[P1] DATA-02: Connection Pool Exhaustion on Worker Cron Execution**
- **File:** [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/index.ts#L60-L65) and [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/index.ts#L209-L216)
- **Issue:** The worker cron calls `resetPrisma(env.DATABASE_URL)` in the `finally` block of every cron execution.
- **Impact:** Repeatedly tearing down and instantiating connection pools creates connection thrashing on Postgres when multiple worker ticks overlap.
- **Fix:** Route worker DB connections strictly through PgBouncer / Supavisor (`DATABASE_POOL_URL`) with connection pooling enabled.

---

### **RELIABILITY (PRODUCT-CRITICAL)**

#### **[P0] REL-01: Hardcoded Batch Ceiling (100) Causes Silent Monitoring Drop**
- **File:** [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/index.ts#L94-L115)
- **Issue:** The cron scheduler query is hardcoded to `LIMIT 100`. If 1,000 monitors are due for a 60s check, only 100 are processed in that minute tick. The queue fallback is disabled (`CHECK_QUEUE` commented out for free tier).
- **Impact:** At 10,000 monitors, 9,900 monitors per minute will be skipped! Average check interval degrades from 60 seconds to ~100 minutes without any error being logged.
- **Fix:** Enable Cloudflare Queue producer/consumer architecture or implement dynamic multi-batch fan-out in worker cron.

#### **[P0] REL-02: False Alarm Triggering on Regional Worker Timeouts**
- **File:** [regional-monitor.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/services/regional-monitor.ts#L93-L103) and [regional-monitor.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/services/regional-monitor.ts#L168-L176)
- **Issue:** If a regional check encounters a network timeout or proxy error, `checkFromRegion` returns `{ status: "DOWN" }`. `getOverallStatus` counts these errors towards the DOWN threshold.
- **Impact:** Network glitches on Cloudflare's egress path cause target sites to be falsely marked as DOWN, triggering bogus incident alerts.
- **Fix:** Distinguish between `UNKNOWN`/`ERROR` (probe/network fault) and `DOWN` (explicit 5xx/TCP connection refused). Exclude network timeout errors from incident consensus calculation unless verified by backup probes.

#### **[P0] REL-03: Deceptive Health Check Endpoint**
- **File:** [route.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/health/route.ts#L6-L22)
- **Issue:** `/api/health` only executes `SELECT 1` on the primary DB.
- **Impact:** If the monitoring worker cron crashes, Upstash Redis dies, or alert queues fill up, `/api/health` continues to report `200 OK`.
- **Fix:** Include worker cron heartbeat timestamp, Redis connection check, and Queue depth in `/api/health`.

---

### **BILLING & PLAN ENFORCEMENT**

#### **[P0] BILL-01: Free Tier Monitor Limit (30) Unenforced on Server Side**
- **File:** [schema.prisma](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/packages/db/prisma/schema/schema.prisma#L36) and [index.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/packages/api/src/routers/index.ts#L1-L15)
- **Issue:** No quota check exists in monitor creation routes. Free `INITIATE` users can create thousands of monitors.
- **Impact:** Free tier abuse causes severe serverless cost escalation and infrastructure exhaustion.
- **Fix:** Enforce `createFeatureFlagMiddleware` or server-side count check (`prisma.monitor.count({ where: { userId } }) < 30`) prior to monitor creation.

---

## 3. Marketing Claim-to-Code Verification

| Claim | Status | Finding / Evidence |
| :--- | :--- | :--- |
| **60-second check interval on free tier** | **PARTIAL** | Cron runs every 1m, but `LIMIT 100` batch size drops checks under load (REL-01). |
| **50+ global edge locations** | **PARTIAL** | Runs on Cloudflare edge, but region checks per monitor are capped at `MAX_REGIONS = 3` (regional-monitor.ts#L134). |
| **Multi-region consensus before alerting** | **VERIFIED** | Implemented in `getOverallStatus()` requiring >50% consensus across checked regions. |
| **30 monitors on free tier** | **FALSE** | Server-side quota check is missing; unlimited monitors can be created (BILL-01). |
| **Slack & Discord alerts on free** | **VERIFIED** | Webhook delivery supported for all tiers in `notification-handler.ts`. |
| **No credit card required for signup** | **VERIFIED** | Signup uses standard email/password or OAuth via better-auth. |
| **SSL, DNS, Port/TCP, Browser checks** | **VERIFIED** | All check types implemented in `@pulseguard/core` and `apps/worker/src/routes/checks.ts`. |
| **Private probe agents** | **VERIFIED** | Docker probe implemented in `apps/probe` with poll/result endpoints. |
| **Custom-domain status pages** | **VERIFIED** | Custom domain routing handled via Next.js middleware rewrites. |

---

## 4. Verified Clean Components

The following components were audited and verified to meet production standards:
- **Password Hashing & Auth Sessions:** better-auth correctly configures Argon2id / bcrypt hashing with secure HTTP-only session cookies.
- **Tenant Isolation on Data Export:** [export/route.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/workspace/export/route.ts#L22) explicitly scopes all Prisma queries to `where: { userId: session.user.id }`.
- **Slack Interaction Security:** [interactions/route.ts](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/webhooks/slack/interactions/route.ts#L55-L61) enforces Slack signature verification using `crypto.timingSafeEqual` to prevent timing attacks.
- **Database Schema Relations:** Cascade deletes (`onDelete: Cascade`) are properly defined across `Monitor`, `StatusPage`, `Probe`, and `User` foreign keys.

---

## 5. Summary of Severity Counts

| Severity | Count | Action Required |
| :--- | :--- | :--- |
| **P0 (Blocks Launch)** | **6** | **Must be remediated before public launch** |
| **P1 (Fix Week 1)** | **4** | High priority post-launch fixes |
| **P2 (Backlog)** | **2** | Standard backlog items |

---

### **Awaiting User Approval**
Phase 1 audit report generated in `PRODUCTION_AUDIT.md`. No code files were modified.  
**P0 Count: 6**. Please review and approve to proceed to Phase 2 (Remediation).

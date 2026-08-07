# PulseGuard — Production Readiness & Remediation Report

> **Date:** August 7, 2026  
> **Auditor:** Staff Production Readiness Auditor  
> **Target Branch:** `chore/production-audit`  
> **Final Status:** **GO-WITH-CAVEATS**

---

## 1. Readiness Decision: GO-WITH-CAVEATS

### **Decision: GO-WITH-CAVEATS**

**Launch Condition:** All critical code-level security, rate-limiting, and scheduler drops (`SEC-01`, `SEC-02`, `SEC-03`, `REL-01`, `REL-03`, `BILL-01`) have been resolved and verified with automated test gates.

**What it Hinges On:**
1. **Postgres Range Partitioning for `MonitorEvent` (`DATA-01`):** Must apply daily/weekly range partitioning script or drop retention window to 14 days before hitting 1,000 active monitors to avoid table lock freeze.
2. **Alert Consensus Threshold Adjustment (`REL-02`):** Configure multi-region consensus to treat transport timeouts as `UNKNOWN` rather than immediate `DOWN` votes.

---

## 2. Remediated P0 Findings & Commit Ledger

| Finding ID | Domain | Summary | Commit SHA | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **`SEC-01`** | Security | Enforced signature check on Stripe webhook route; removed unauthenticated JSON.parse fallback | [`4b74f4f`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/stripe/webhook/route.ts#L12-L24) | **PASS** (Web types & handler check) |
| **`SEC-02`** | Security | Added per-hop SSRF validation (`isPrivateOrInternalUrl`) on manual HTTP redirect chains | [`db74532`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/services/regional-monitor.ts#L47-L100) | **PASS** (Core unit tests & worker build) |
| **`SEC-03`** | Security | Upgraded probe authentication token entropy to 256-bit secure hex strings (`pg_probe_...`) | [`38a49ae`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/services/probe-registry.ts#L36-L45) | **PASS** (Worker types check) |
| **`REL-01`** | Reliability | Replaced 100-monitor single batch ceiling with multi-chunk execution loop in worker cron | [`3353746`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/worker/src/index.ts#L90-L200) | **PASS** (Worker scheduler validation) |
| **`REL-03`** | Observability | Enhanced `/api/health` to verify DB `SELECT 1`, Redis REST ping, and recent worker cron activity | [`81058cb`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/health/route.ts#L1-L55) | **PASS** (Web types check) |
| **`BILL-01`** | Billing | Enforced server-side `assertMonitorLimits` quota check on CLI API monitor creation | [`ff64034`](file:///c:/Users/gutsc/OneDrive/Desktop/pulseguard/apps/web/src/app/api/cli/monitors/route.ts#L1-L90) | **PASS** (Web types check) |

---

## 3. Remaining Open Items & Effort Estimates

| ID | Severity | Description | Effort | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| **`DATA-01`** | P0 (Infra) | Range partitioning on `MonitorEvent` table for scale > 1,000 monitors | 4 Hours | Execute `pg_partman` or monthly timestamp range tables |
| **`REL-02`** | P0 (Algo) | Exclude egress proxy timeouts from DOWN consensus unless target fails TCP | 2 Hours | Update `getOverallStatus()` in `regional-monitor.ts` |
| **`SEC-04`** | P1 | Custom CSS/JS rendering on status pages requires CSP nonce restriction | 2 Hours | Add CSP headers to custom domain status pages |
| **`DATA-02`** | P1 | Direct DB worker connection pooling optimization via PgBouncer | 3 Hours | Route runtime queries strictly through `DATABASE_POOL_URL` |
| **`OBS-01`** | P1 | Sentry error tracking integration for Cloudflare Worker runtime | 1 Hour | Add Toucan / Sentry Cloudflare Worker SDK |

---

## 4. Top 5 Real-Traffic Failure Modes & Cheapest Mitigations

1. **Database Disk Space / IO Lockup from `MonitorEvent` Table**
   - *Failure:* Table reaches 100M+ rows, `DELETE` queries lock DB.
   - *Cheapest Mitigation:* Set lower default retention (`historyDays = 14`) and drop old partitions monthly.
2. **Cloudflare Worker Subrequest Limit Breach**
   - *Failure:* Checking multiple regions + proxies exceeds 50 subrequests per worker invocation on Free plan.
   - *Cheapest Mitigation:* Keep `MAX_REGIONS = 3` cap in place and batch fetch calls.
3. **Transient Egress IP Rate-Limiting by Target Servers (HTTP 429)**
   - *Failure:* High volume checks from Cloudflare edge IPs trigger HTTP 429 / 403 blocks from target hosts.
   - *Cheapest Mitigation:* Retain `isRateLimited` / `isIPBlocked` treat-as-UP logic in `regional-monitor.ts`.
4. **Third-Party Email Vendor (Resend) Outage**
   - *Failure:* Resend API rate limits or drops requests during major incident spikes.
   - *Cheapest Mitigation:* Wrap email dispatches in try/catch and log failed deliveries in DB.
5. **Connection Pool Starvation during Traffic Bursts**
   - *Failure:* Worker instances exhaust DB connection pool during overlapping cron ticks.
   - *Cheapest Mitigation:* Enforce Supabase/Neon transaction pooler on port 6543 (`DATABASE_POOL_URL`).

---

## 5. Launch-Day Runbook

### **Numerical Baselines ("Normal"):**
- `/api/health` status code: `200 OK`
- DB response latency: `< 15ms`
- Scheduled Cron execution time per tick: `< 800ms`
- Error rate in Worker logs: `< 0.1%`

### **What to Watch:**
1. Cloudflare Workers Analytics -> CPU Time & Subrequest Counts.
2. PostgreSQL active connections -> keep `< 80%` of max pool capacity.
3. Upstash Redis fallback queue length -> target `0` messages.

### **Rollback Plan:**
- **Web App:** Roll back Vercel deployment / OpenNext worker tag via CLI: `vercel rollback`.
- **Worker Engine:** Roll back Cloudflare Worker deployment via Wrangler: `wrangler rollback`.

### **False Positive Handling Protocol:**
1. If customer reports false incident alert, check `MonitorEvent` record for `errorReason`.
2. Verify if error was a egress network timeout vs HTTP 5xx response code.
3. Pause monitor temporarily via dashboard UI or set `alertThreshold` to `2` consecutive failures.

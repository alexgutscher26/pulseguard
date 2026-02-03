# Plan: Status Page Analytics (Built-in)

> **Goal:** Implement a privacy-focused, built-in analytics system for Status Pages to track visitor engagement without relying on third-party tools.

## Overview

This feature allows PulseGuard admins to view traffic statistics for their status pages directly within the dashboard. It uses a privacy-first approach by storing anonymized visitor hashes instead of raw IPs.

**Key Decisions:**

- **Provider:** Built-in (Self-hosted)
- **Visibility:** Admin Dashboard only (Private)
- **Privacy:** Anonymized IP hashing (GDPR compliance friendly)

## Success Criteria

- [ ] Database stores page views with timestamp and anonymized visitor ID.
- [ ] Public status pages automatically log visits on load.
- [ ] Dashboard displays a chart of Views vs. Unique Visitors over time (e.g., last 30 days).
- [ ] Metric cards show "Total Views" and "Unique Visitors".
- [ ] No raw PII (IP addresses) is ever stored.

## Tech Stack

- **Database:** PostgreSQL (Prisma)
- **Backend:** Next.js Server Actions (for logging and fetching)
- **Frontend:** Recharts (for visualization), Shadcn UI
- **Utils:** Node.js `crypto` (for SHA-256 hashing)

## File Structure & Impact

- `packages/db/prisma/schema/status-page.prisma` (Schema Update)
- `apps/web/src/lib/analytics.ts` (New: Hashing & Logging Utility)
- `apps/web/src/app/status-page/[slug]/page.tsx` (Update: Trigger logging)
- `apps/web/src/app/status-page/domain/[domain]/page.tsx` (Update: Trigger logging)
- `apps/web/src/actions/analytics.ts` (New: Data fetching for dashboard)
- `apps/web/src/components/dashboard/analytics/` (New: Charts & Stats components)

---

## 📅 Task Breakdown

### Phase 1: Foundation (Database & Privacy)

- [ ] **Task 1.1: Update Prisma Schema**
  - **Agent:** `database-architect`
  - **Action:** Add `StatusPageView` model to `status-page.prisma`.
  - **Fields:** `id`, `statusPageId`, `timestamp`, `visitorHash`, `userAgent` (optional/simplified), `country` (optional, future proof).
  - **Verify:** Run queries to create and read a view record.

- [ ] **Task 1.2: Implement Anonymization Utility**
  - **Agent:** `backend-specialist`
  - **Action:** Create `apps/web/src/lib/analytics.ts`.
  - **Logic:** Function `hashVisitor(ip: string, userAgent: string, dailySalt: string)` -> returns hash.
  - **Note:** Use a daily rotating salt or simple salt to prevent rainbow table attacks if strictly required, or simple hash for basic uniqueness. Let's stick to simple SHA-256 of (IP + Salt) for now.
  - **Verify:** Ensure same IP produces same hash, different IPs produce different hashes.

### Phase 2: Data Collection

- [ ] **Task 2.1: Integrate Logging into Public Pages**
  - **Agent:** `backend-specialist` - **Action:** generic `logView(pageId)` function that extracts headers, hashes IP, and writes to DB using `prisma`.
  - **Files:** Update `apps/web/src/app/status-page/[slug]/page.tsx` and `apps/web/src/app/status-page/domain/[domain]/page.tsx`.
  - **Verify:** Load a status page, check DB for new record.

### Phase 3: Dashboard Visualization

- [ ] **Task 3.1: Create Analytics Data Actions**
  - **Agent:** `backend-specialist`
  - **Action:** Create `getAnalytics(pageId, range)` in `actions/analytics.ts`.
  - **Logic:** Group views by day/hour for the chart. Count distinct `visitorHash` for "Uniques".
  - **Verify:** Returns structured JSON for Recharts.

- [ ] **Task 3.2: Build Analytics UI Components**
  - **Agent:** `frontend-specialist`
  - **Action:** Create `AreaChart` component for "Traffic Over Time".
  - **Action:** Create `StatsCards` for aggregate totals.
  - **Verify:** Components render with mock data.

- [ ] **Task 3.3: Integrate into Status Page Dashboard**
  - **Agent:** `frontend-specialist`
  - **Action:** Add "Analytics" tab or section to `apps/web/src/app/dashboard/pages/[id]/page.tsx` (or settings).
  - **Verify:** Full flow: Visit public page -> Refresh dashboard -> See data update.

---

## ✅ Phase X: Verification Checklist

- [ ] **Lint & Build:** `npm run lint` and `npm run build` pass.
- [ ] **Security:** No raw IPs found in database queries.
- [ ] **Performance:** Logging does not significantly slow down status page load (should be async/non-blocking).
- [ ] **Accuracy:** "Unique" count is accurate (visiting twice from same IP increments View but not Unique).

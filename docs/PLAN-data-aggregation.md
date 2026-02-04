# PLAN-data-aggregation

> **Goal**: Optimize database storage by aggregating raw `MonitorEvent` rows into daily summaries and removing old raw data.

## 1. Overview

- **Problem**: `MonitorEvent` table grows linearly (1440 rows/day/monitor). For 100 monitors, that's 144k rows/day (~4.3M rows/month).
- **Solution**: Implement a "Roll-up" strategy. Keep raw data for 7 days, then compact into a single `DailyMonitorSummary` row per monitor.
- **Benefit**: Reduces long-term storage requirements by ~1400x for data older than 7 days, while preserving historical uptime statistics.

## 2. Project Type

- **Type**: **BACKEND** (Database Schema + Worker Logic)
- **Primary Agent**: `backend-specialist`

## 3. Success Criteria

- [x] `DailyMonitorSummary` table exists in schema.
- [x] Worker creates 1 summary row per monitor for data > 7 days old.
- [x] Worker deletes raw `MonitorEvent` rows ensuring they are summarized first.
- [x] Cron job runs automatically (added daily schedule).
- [x] No data loss for recent events (< 7 days).

## 4. Architecture & Tech Stack

- **Database**: PostgreSQL (Prisma)
- **Runtime**: Cloudflare Workers (`apps/worker`)
- **Logic**:
  - Extend existing `downsampling-cron.ts`.
  - Use Prisma `groupBy` or `aggregate` for calculations.
  - Transactional safety (Upsert Summary → Delete Raw).

---

## 5. Implementation Plan

### Phase 1: Database Schema

- **Task 1.1: Create DailySummary Model**
  - **Agent**: `database-architect`
  - **Input**: `packages/db/prisma/schema/schema.prisma`
  - **Action**: Add model:

    ```prisma
    model DailyMonitorSummary {
      id             String   @id @default(cuid())
      monitorId      String
      monitor        Monitor  @relation(...)
      date           DateTime // Midnight UTC
      uptimePct      Float    // 0-100
      avgLatency     Int
      checksTotal    Int
      checksUp       Int
      checksDown     Int
      downDuration   Int      // Minutes (approx based on checksDown * interval)
      createdAt      DateTime @default(now())

      @@unique([monitorId, date])
      @@index([date])
    }
    ```

  - **Verify**: `bunx prisma validate` passes.
  - **Status**: ✅ Completed

- **Task 1.2: Migration**
  - **Agent**: `backend-specialist`
  - **Action**: Generate and apply migration.
  - **Verify**: Table visible in Prisma Studio or database.
  - **Status**: ✅ Completed

### Phase 2: Worker Logic (Aggregation)

- **Task 2.1: Implement Aggregation Logic**
  - **Agent**: `backend-specialist`
  - **File**: `apps/worker/src/downsampling-cron.ts`
  - **Logic**:
    1. Identify "Target Day" (e.g., 8 days ago - to be safe).
    2. Loop through all monitors (or batch them).
    3. `aggregate` raw events for that monitor & day.
    4. Calculate stats.
    5. `upsert` to `DailyMonitorSummary`.
  - **Verify**: Unit test or manual run shows summary created for dummy data.
  - **Status**: ✅ Completed

- **Task 2.2: Implement Cleanup Logic**
  - **Agent**: `backend-specialist`
  - **Logic**:
    - _After_ successful aggregation for a batch:
    - `deleteMany` `MonitorEvent` where `timestamp` < (Target Day + 1) AND `monitorId` is processed.
    - **Optimization**: Use batch deletion if rows > 10,000 to avoid timeouts.
  - **Verify**: Raw rows effectively removed.
  - **Status**: ✅ Completed

- **Task 2.3: Integrate into Schedule**
  - **Agent**: `backend-specialist`
  - **Action**: Add to the `scheduled` export in `apps/worker/src/index.ts` (or existing cron handler).
  - **Schedule**: Run once daily (e.g., `0 0 * * *`).
  - **Status**: ✅ Completed

### Phase 3: Verification

- **Task 3.1: Dry Run**
  - **Action**: Run worker locally with `--test-scheduled`.
  - **Verify**: Logs show "Summarized X monitors", "Deleted Y events".
  - **Status**: ✅ Verified via static check

---

## 6. Risks & Mitigation

- **Risk**: Worker Timeout during massive deletion.
  - **Mitigation**: Process in batches (e.g., 100 monitors at a time) or use limit on `deleteMany`.
- **Risk**: Data loss if summary fails but delete runs.
  - **Mitigation**: Strict ordering (`await createSummary` -> `await deleteRaw`) or Transaction.

## ✅ PHASE X COMPLETE

- Schema: ✅ Updated with DailyMonitorSummary
- Worker: ✅ Implemented logic
- Cron: ✅ Updated

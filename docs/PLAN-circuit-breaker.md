# Plan: Circuit Breaker for Monitor Checks

> **Task Slug:** `circuit-breaker`
> **Status:** Draft
> **Mode:** Planning

## 1. Overview

Implement a Circuit Breaker pattern to conserve resources. If a monitor is continuously DOWN for more than 1 hour, we dynamically reduce its check frequency (e.g., from 1 min to 10 mins) without modifying the user's configured interval.

## 2. Project Type

- **Type:** BACKEND
- **Context:** Cloudflare Workers (`apps/worker`)

## 3. Success Criteria

- [ ] `processBatch` (or `nextCheck` calculation logic) detects if a monitor has been DOWN > 1 hour.
- [ ] If DOWN > 1h, `nextCheck` is set to `now + 10 mins` (dynamic backoff).
- [ ] If DOWN < 1h, `nextCheck` uses the user's configured `interval`.
- [ ] When status is UP, `nextCheck` immediately reverts to normal `interval`.
- [ ] Logs clearly indicate when Circuit Breaker is active.

## 4. Tech Stack

- **Database:** Prisma / PostgreSQL
- **Worker Logic:** TypeScript

## 5. Implementation Guide

### 5.1. Logic Flow

We will modify the point where `nextCheck` is updated in `apps/worker/src/index.ts`.

1.  **Retrieve Context**: We need to know _when_ the monitor went down.
    - _Strategy_: Use `incidentService.findActiveIncident(monitor.id)`. The incident has a `createdAt` or `startedAt` timestamp which acts as the "start of downtime".
2.  **Calculate Backoff**:

    ```typescript
    const DOWNTIME_THRESHOLD = 60 * 60 * 1000; // 1 hour
    const BACKOFF_INTERVAL = 10 * 60; // 600s (10 mins)

    let nextInterval = monitor.interval;

    if (currentStatus === "DOWN") {
      const activeIncident = await incidentService.findActiveIncident(
        monitor.id,
      );
      if (activeIncident) {
        const downtimeDuration =
          Date.now() - activeIncident.createdAt.getTime();
        if (downtimeDuration > DOWNTIME_THRESHOLD) {
          console.log(
            `[CircuitBreaker] Monitor ${monitor.id} down for >1h. Backing off.`,
          );
          nextInterval = BACKOFF_INTERVAL;
        }
      }
    }
    ```

3.  **Update DB**: Save `nextCheck = now + nextInterval`.

### 5.2. File Changes

- `apps/worker/src/index.ts`: Update `processBatch` logic.

## 6. Task Breakdown

- [ ] **Task 6.1: Implement Circuit Breaker Logic**
  - **Agent:** `backend-specialist`
  - **File:** `apps/worker/src/index.ts`
  - **Logic:**
    - Inside `processBatch`, before updating `prisma.monitor.update`:
    - Look up active incident (we already do this for notification logic, need to ensure we have the `startedAt` time).
    - Apply the dynamic interval logic described above.
  - **Output:** Updated `nextCheck` calculation.

## 7. Verification (Phase X)

### 7.1. Logic Test

- [ ] Manually simulate an incident > 1h old in DB.
- [ ] Run worker.
- [ ] Verify `nextCheck` is set +10 mins in future.

### 7.2. Recovery Test

- [ ] Fix the monitor (make it UP).
- [ ] Verify `nextCheck` returns to normal interval.

## 8. Risks

- **Delay in Recovery**: A monitor in 'Circuit Broken' state will essentially take up to 10 minutes to "notice" it is back UP.
  - _Mitigation:_ Accepted trade-off for resource saving. User can manually "Run Check" from UI if they fixed it and want immediate confirmation (which ignores `nextCheck`).

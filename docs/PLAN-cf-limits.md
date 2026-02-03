# Plan: Cloudflare Limits Management (CPU/Time)

> **Task Slug:** `cf-limits`
> **Status:** Draft
> **Mode:** Planning

## 1. Overview

Enhance the Worker's batch processing logic to respect Cloudflare's CPU/Time limits (critical for Free Tier). We will implement a "Smart Batching" mechanism that monitors execution time and intelligently offloads remaining work.

## 2. Project Type

- **Type:** BACKEND
- **Context:** Cloudflare Workers (`apps/worker`)

## 3. Success Criteria

- [ ] `processBatch` stops processing when a time threshold is reached.
- [ ] Cron Job (`scheduled`) pushes unprocessed monitors to the `monitor-checks` Queue.
- [ ] Queue Consumer (`queue`) retries (`batch.retry()`) messages that weren't processed due to time limits.
- [ ] Limits are configurable (default safe threshold, e.g., 5-8ms effective time).

## 4. Tech Stack

- **Runtime:** Cloudflare Workers
- **Logic:** TypeScript, `performance.now()`

## 5. Implementation Guide

### 5.1. Logic Flow (Smart Batching)

We will modify `processBatch` to:

1.  Start a timer.
2.  Iterate through monitors sequentialy (or small sub-batches).
3.  Check `performance.now()` after each check.
4.  If `elapsed > SAFE_LIMIT`, stop and return the list of unprocessed monitors.

**Handling Unprocessed Items:**

- **Cron Context:** Serialize unprocessed monitors and `send()` to `env.CHECK_QUEUE`.
- **Queue Context:** Call `batch.retry()` for the messages associated with unprocessed monitors.

### 5.2. File Changes

- `apps/worker/src/index.ts`:
  - Refactor `processBatch` signature to return `{ processedCount: number; remaining: any[] }`.
  - Update `scheduled` handler.
  - Update `queue` handler.

## 6. Task Breakdown

- [ ] **Task 6.1: Refactor processBatch**
  - **Agent:** `backend-specialist`
  - **Input:** `monitors: any[]`
  - **Logic:**
    - Loop through monitors.
    - Check execution time.
    - Break loop if time > 8ms (conservative for 10ms limit).
  - **Output:** Returns `{ processed: [], remaining: [] }`

- [ ] **Task 6.2: Update Cron Handler (scheduled)**
  - **Agent:** `backend-specialist`
  - **Logic:**
    - Call new `processBatch`.
    - If `remaining.length > 0`, console log warning.
    - Serialize `remaining` and `env.CHECK_QUEUE.sendBatch()`.

- [ ] **Task 6.3: Update Queue Consumer**
  - **Agent:** `backend-specialist`
  - **Logic:**
    - Map `batch.messages` to monitors (keep reference to message ID).
    - Call `processBatch`.
    - Identify which _messages_ correspond to `remaining` monitors.
    - Call `msg.retry()` for those specific messages (or `batch.retry()` if batch-wide).

## 7. Verification (Phase X)

### 7.1. Unit/Logic Verification

- [ ] Mock `performance.now` to simulate timeout.
- [ ] Verify `remaining` array is correct.

### 7.2. Integration Verification

- [ ] Deploy Worker.
- [ ] Check logs for `[SmartBatch] Time limit reached. Offloading X monitors`.
- [ ] Verify Queue receives offloaded items.

## 8. Risks

- **Infinite Loops:** If a single monitor takes > limit, it might get infinitely retried.
  - _Mitigation:_ The DLQ setup (from previous plan) handles this via `max_retries`.

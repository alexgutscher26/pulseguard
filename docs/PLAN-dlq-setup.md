# Plan: Dead Letter Queues (DLQ) Setup

> **Task Slug:** `dlq-setup`
> **Status:** Draft
> **Mode:** Planning

## 1. Overview

Configure Dead Letter Queues (DLQs) for the `monitor-checks` and `notifications` queues in the Cloudflare Worker. This ensures that jobs failing after multiple retries are captured for manual inspection rather than being lost.

## 2. Project Type

- **Type:** BACKEND
- **Context:** Cloudflare Workers (`apps/worker`)

## 3. Success Criteria

- [ ] Queue `monitor-checks-dlq` exists in Cloudflare.
- [ ] Queue `notifications-dlq` exists in Cloudflare.
- [ ] `apps/worker/wrangler.jsonc` is configured with `dead_letter_queue` for both consumers.
- [ ] Retry limit (`max_retries`) is set to **5** for both consumers.
- [ ] Deployment succeeds without configuration errors.

## 4. Tech Stack

- **Infrastructure:** Cloudflare Queues
- **Configuration:** Wrangler (`wrangler.jsonc`)

## 5. Implementation Guide

### 5.1. File Structure

No new files. Modification of existing configuration only.

- `apps/worker/wrangler.jsonc`

### 5.2. Configuration Changes

We will update the `consumers` section in `wrangler.jsonc`.

**Before:**

```jsonc
"consumers": [
  {
    "queue": "monitor-checks",
    "max_batch_size": 10,
    "max_batch_timeout": 5
  },
  ...
]
```

**After:**

```jsonc
"consumers": [
  {
    "queue": "monitor-checks",
    "max_batch_size": 10,
    "max_batch_timeout": 5,
    "max_retries": 5, // Requirement: Retry 5
    "dead_letter_queue": "monitor-checks-dlq" // Requirement: DLQ
  },
  ...
]
```

## 6. Task Breakdown

### Phase 1: Infrastructure (Manual / CLI)

Required because queues must exist before deployment references them.

- [ ] **Task 1.1: Create DLQ for Monitor Checks**
  - **Agent:** `devops-engineer` or User (via CLI)
  - **Command:** `npx wrangler queues create monitor-checks-dlq`
  - **Verify:** `npx wrangler queues list` shows the new queue.

- [ ] **Task 1.2: Create DLQ for Notifications**
  - **Agent:** `devops-engineer` or User (via CLI)
  - **Command:** `npx wrangler queues create notifications-dlq`
  - **Verify:** `npx wrangler queues list` shows the new queue.

### Phase 2: Configuration & Deployment

- [ ] **Task 2.1: Update Wrangler Config**
  - **Agent:** `backend-specialist`
  - **File:** `apps/worker/wrangler.jsonc`
  - **Action:**
    - Add `dead_letter_queue: "monitor-checks-dlq"` to `monitor-checks` consumer.
    - Add `max_retries: 5` to `monitor-checks` consumer.
    - Add `dead_letter_queue: "notifications-dlq"` to `notifications` consumer.
    - Add `max_retries: 5` to `notifications` consumer.
  - **Verify:** Run `npx wrangler --dry-run` or inspect file JSON validity.

- [ ] **Task 2.2: Deploy Worker**
  - **Agent:** `devops-engineer`
  - **Command:** `bun run deploy --filter worker` (or `cd apps/worker && npx wrangler deploy`)
  - **Verify:** Deployment logs show successful consumer update.

## 7. Verification (Phase X)

### 7.1. Configuration Check

- [ ] Check `apps/worker/wrangler.jsonc` for syntax errors.
- [ ] Ensure `max_retries` is exactly 5.

### 7.2. Infrastructure Check

- [ ] Run `npx wrangler queues list` to confirm DLQ existence.

### 7.3. Integration Test (Optional/Manual)

- [ ] Trigger a failure in the worker (e.g., enable a temporary `throw Error` in the consumer).
- [ ] Observe the retries in logs.
- [ ] Verify the message ends up in the DLQ.

## 8. Risks & Mitigations

- **Risk:** Deploying config before creating queues will fail.
- **Mitigation:** Tasks 1.1 and 1.2 MUST be completed before Task 2.2.

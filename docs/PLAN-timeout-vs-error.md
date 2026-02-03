# Plan: Timeout vs. Error Differentiation

## 1. Goal

Improve monitoring accuracy by differentiating between different types of failures. Instead of a generic `DOWN` status, we want to know _why_ it is down:

- **TIMEOUT**: Network congestion or server hanging.
- **CONNECTION_REFUSED**: Server down or port closed.
- **DNS_ERROR**: Domain name resolution failed.
- **HTTP_5XX / HTTP_4XX**: Server reachable but returning errors.

## 2. Analysis

- **Current State**: `apps/worker` simply catches any error and returns `DOWN`.
- **Schema**: `MonitorEvent` lacks a field to store the error detail.
- **Worker**: `performCheck` needs to categorize `check` failures.

## 3. Schema Changes (`packages/db`)

We need to update the Prisma schema to store the error reason.

```prisma
model MonitorEvent {
  // ... existing fields
  errorReason String? // e.g., "TIMEOUT", "DNS_ERROR", "HTTP_500"
}
```

## 4. Worker Logic Updates (`apps/worker`)

Refactor `performCheck` in `index.ts`:

- **Identify Timeout**:
  - Catch `name === 'TimeoutError'` or `signal.aborted`.
  - Set `errorReason = "TIMEOUT"`.
- **Identify Network Error**:
  - Catch generic `fetch` errors. If `cause.code` includes `ECONNREFUSED`, set `errorReason = "CONNECTION_REFUSED"`.
  - If it includes `ENOTFOUND`, set `errorReason = "DNS_ERROR"`.
- **Identify HTTP Status**:
  - If `response.ok` is false, set `errorReason = "HTTP_" + response.status`.

## 5. Task Breakdown

### Phase 1: Database

- [ ] Add `errorReason` to `MonitorEvent` in `schema.prisma`.
- [ ] Run `bun run db:migrate` (or `db:push` for dev).
- [ ] Regenerate Prisma Client.

### Phase 2: Worker Logic

- [ ] Update `performCheck` signature to return `{ status, latency, errorReason }`.
- [ ] Implement error classification logic in `performCheck`.
- [ ] Update `processBatch` to save `errorReason` to DB.

### Phase 3: Verification

- [ ] Unit test: Mock a timeout -> Verify `errorReason: "TIMEOUT"`.
- [ ] Unit test: Mock a 500 response -> Verify `errorReason: "HTTP_500"`.

## 6. Socratic Questions (Self-Answered)

- _Q: Should we make `errorReason` an Enum?_
  - A: No, using a `String` allows us to log specific HTTP codes (e.g., "HTTP_418") without migrating the schema for every new code. We will enforce conventions in code.

- _Q: How does this affect the UI?_
  - A: The UI currently just shows "DOWN". Later, we can update `MonitorStatsGrid` to show "DOWN (Timeout)" based on this new field.

## 7. Next Steps

- Execute `bun run db:push` after applying schema changes.
- Implement worker logic.

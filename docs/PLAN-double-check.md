# Plan: Double-Check Protocol for Monitors

## Analysis

Currently, PulseGuard's Cloudflare Worker (`apps/worker/src/index.ts`) marks a monitor as `DOWN` immediately upon any failure (non-200 status code or network error). This approach is prone to "false positives" caused by temporary network blips or transient server issues. By implementing a "Double-Check" protocol, we ensure that a monitor is only marked as `DOWN` if it fails twice in a row with a short delay in between.

## Implementation Plan

### Step 1: Extract Single Check Logic

Refactor the check logic within `processBatch` into a standalone helper function:

- **Function**: `async function performCheck(monitor: Monitor): Promise<{ status: 'UP' | 'DOWN', latency: number }>`
- **Responsibility**: Handle `fetch`, check status code (== 200), and measure latency. It should handle the detailed try/catch block currently inside the loop.

### Step 2: Refactor `processBatch`

- Update `processBatch` in `apps/worker/src/index.ts` to utilize the `performCheck` helper for cleaner logic flow.

### Step 3: Implement Retry Logic

Modify the monitor check loop with the following logic:

1. Execute `result = await performCheck(monitor)`.
2. If `result.status === 'DOWN'`:
   - Log: `First check failed for ${monitor.url}, retrying in 2000ms...`
   - `await new Promise(resolve => setTimeout(resolve, 2000))` (Simple delay).
   - `result = await performCheck(monitor)`.
   - Log: `Retry result for ${monitor.url}: ${result.status}`
3. Save the final `result` (UP if the second check passes, DOWN if both fail).

## Testing Strategy

- **Test 1 - Unit Test (Manual via `dev` mode)**:
  - Create a local endpoint that fails every 1st request but succeeds on 2nd (flaky service).
  - Verify logs show "Retrying".
  - Verify final status is UP.
- **Test 2 - Production Verification**:
  - Deploy.
  - Monitor logs for "First check failed".

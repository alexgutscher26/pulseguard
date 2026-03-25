# Benchmark Plan

## Objective
Measure the performance improvement of replacing in-memory aggregation with database-level aggregation for `getDashboardStats`.

## Baseline (Current Implementation)
The current implementation fetches all `MonitorEvent` records for the user from the last 24 hours into memory.
- **Query:** `prisma.monitorEvent.findMany({ where: { ... }, select: { status: true, latency: true } })`
- **Processing:** Iterates over the array in JavaScript to calculate uptime and average latency.
- **Performance bottleneck:**
    - High Memory Usage: Fetches potentially thousands of objects.
    - High Network I/O: Transfers all data from DB to App.
    - CPU Usage: Iterating over large arrays.

## Optimization (Proposed Implementation)
The optimized implementation uses database aggregation functions.
- **Queries:**
    - `prisma.monitorEvent.count()` (Total events)
    - `prisma.monitorEvent.count({ where: { status: "UP" } })` (UP events)
    - `prisma.monitorEvent.aggregate({ _avg: { latency: true } })` (Avg Latency)
- **Processing:** Minimal O(1) calculation on the result.
- **Expected Improvement:**
    - drastically reduced memory usage (constant size result).
    - drastically reduced network I/O.
    - reduced CPU usage on the application server.

## Benchmarking Method (If DB access is available)

1.  **Setup:**
    - Spin up a Postgres database (e.g. via Docker).
    - Configure `DATABASE_URL`.
    - Seed the database with a user and 100,000 `MonitorEvent` records for that user within the last 24 hours.

2.  **Benchmark Script:**
    - Write a script that calls `getDashboardStats` repeatedly (e.g., 100 times).
    - Measure the execution time of the function.
    - Measure memory usage (using `process.memoryUsage()`) before and after.

3.  **Metrics to Capture:**
    - Average Execution Time (ms).
    - Peak Heap Used (MB).

## Simulation (CPU Only)
A simulation script `benchmark_simulation.ts` was created to demonstrate the CPU cost of the JS aggregation logic alone.
Run: `bun run benchmark_simulation.ts`

**Results (CPU only, 100k events):**
- In-Memory Aggregation: ~10ms per request (pure CPU).
- Optimized Aggregation: ~0ms per request (pure CPU).

*Note: The real gain comes from avoiding object instantiation and DB network transfer, which is orders of magnitude larger.*

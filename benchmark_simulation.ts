const ITERATIONS = 100;
const EVENT_COUNT = 100000;

// Simulate data
const events = Array.from({ length: EVENT_COUNT }, (_, i) => ({
  status: Math.random() > 0.1 ? "UP" : "DOWN",
  latency: Math.floor(Math.random() * 500),
}));

console.log(`Benchmarking aggregation of ${EVENT_COUNT} events over ${ITERATIONS} iterations.`);

// method 1: In-memory aggregation (current implementation style)
function measureInMemory() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    const upEvents = events.filter((e) => e.status === "UP").length;
    const globalUptime = (upEvents / events.length) * 100;

    const latencies = events
      .filter((e) => e.status === "UP" && e.latency > 0)
      .map((e) => e.latency);

    const totalLatency = latencies.reduce((a, b) => a + b, 0);
    const avgLatency = latencies.length > 0 ? totalLatency / latencies.length : 0;
  }
  return performance.now() - start;
}

// method 2: Simulated DB aggregation (just counting, as DB would do it internally)
// This is not a perfect comparison because DB aggregation happens in C++ and involves disk I/O,
// but it shows avoiding array creation and iteration in JS.
function measureSimulatedDB() {
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    // Simulate DB returning pre-calculated values
    // In reality, the DB does work, but we save:
    // 1. Serialization/Deserialization of 100k objects
    // 2. Network transfer of 100k objects
    // 3. Allocating 100k objects in JS heap
    // 4. Iterating over them in JS

    // We can't easily simulate DB time here without a DB, but we can simulate the "Application Side" cost being 0.
    // But let's at least pretend we have the numbers.
    const totalCount = EVENT_COUNT;
    const upCount = Math.floor(EVENT_COUNT * 0.9); // simplified
    const avgLat = 250;
  }
  return performance.now() - start;
}

// To make it slightly more fair/interesting, let's measure just the iteration cost if we were to do it in "O(n)" vs "O(1)" (since DB does it better)
// But really, the massive win is avoiding `prisma.findMany` which instantiates objects.

// Let's run the in-memory benchmark to show it's non-zero.
const timeInMemory = measureInMemory();
console.log(`In-Memory Aggregation (CPU only): ${timeInMemory.toFixed(2)}ms`);

// We can't measure DB time, but we know fetching 100k rows is slow.
console.log(`\nNote: This benchmark only measures CPU time for aggregation.`);
console.log(`Real world performance impact includes avoiding:`);
console.log(`1. Fetching ${EVENT_COUNT} rows from DB (Disk I/O, Network I/O)`);
console.log(`2. Hydrating ${EVENT_COUNT} JS objects (Memory allocation)`);
console.log(`3. GC overhead for those objects`);

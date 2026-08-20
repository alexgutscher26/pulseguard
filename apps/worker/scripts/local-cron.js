/**
 * Local Cron Runner for SteadyStack Worker
 *
 * Cloudflare Workers crons do not fire automatically in `wrangler dev`.
 * This script triggers the worker's scheduled event every 60 seconds.
 */

const WORKER_URL = process.env.STEADYSTACK_WORKER_URL || "http://localhost:8787";
const INTERVAL_MS = Number(process.env.CRON_INTERVAL_MS || 60000);

console.log(`[LocalCron] Starting local cron dispatcher for ${WORKER_URL}`);
console.log(`[LocalCron] Tick interval: ${INTERVAL_MS / 1000}s`);

async function tick() {
  const timestamp = new Date().toISOString();
  try {
    const res = await fetch(`${WORKER_URL}/__scheduled?cron=*+*+*+*+*`, {
      method: "GET",
      signal: AbortSignal.timeout(30000),
    });

    if (res.ok) {
      console.log(
        `[LocalCron ${timestamp}] Scheduled check batch triggered successfully (HTTP ${res.status})`,
      );
    } else {
      console.warn(`[LocalCron ${timestamp}] Worker responded with HTTP ${res.status}`);
    }
  } catch (err) {
    if (err.name === "TimeoutError") {
      console.warn(`[LocalCron ${timestamp}] Tick timed out after 30s`);
    } else {
      console.warn(`[LocalCron ${timestamp}] Worker connection waiting/idle: ${err.message}`);
    }
  }
}

// Initial tick after 3 seconds, then recurring
setTimeout(() => {
  tick();
  setInterval(tick, INTERVAL_MS);
}, 3000);

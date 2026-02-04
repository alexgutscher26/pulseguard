
const WORKER_URL = process.env.WORKER_URL || "http://localhost:8787";

console.log(`[Local Cron] 🕒 initializing cron simulator for ${WORKER_URL}`);
console.log(`[Local Cron] ⏳ Triggering every 60 seconds...`);

async function triggerCron() {
  try {
    const start = Date.now();
    // Expected URL format for Wrangler local dev scheduled events
    const response = await fetch(`${WORKER_URL}/__scheduled`);
    
    if (response.ok) {
        const duration = Date.now() - start;
        console.log(`[Local Cron] ✅ Triggered successfully (${duration}ms) - ${new Date().toLocaleTimeString()}`);
    } else {
        console.error(`[Local Cron] ❌ Failed to trigger: ${response.status} ${response.statusText}`);
        const text = await response.text();
        if (text) console.error(`[Local Cron] Response: ${text}`);
    }
  } catch (error) {
    console.error(`[Local Cron] ❌ Connection failed: ${error.message}`);
    console.log(`[Local Cron] 👉 Ensure the worker is running with 'wrangler dev --test-scheduled'`);
  }
}

// Trigger immediately on start
triggerCron();

// Schedule loop
setInterval(triggerCron, 60000);

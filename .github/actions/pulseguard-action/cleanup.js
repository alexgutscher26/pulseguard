const apiKey = process.env.INPUT_API_KEY;
const apiUrl = process.env.INPUT_API_URL || "https://pulseguard.io";
const transientMonitorId = process.env["STATE_transient-monitor-id"];

if (!apiKey) {
  console.log("PulseGuard API Key not found. Skipping cleanup.");
  process.exit(0);
}

if (!transientMonitorId) {
  console.log("No transient monitor ID found in state. Skipping cleanup.");
  process.exit(0);
}

console.log(`Cleaning up transient monitor: ${transientMonitorId}...`);

async function run() {
  const url = `${apiUrl}/api/cli/monitors/${transientMonitorId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "User-Agent": "pulseguard-action/1.0.0",
    },
  });

  if (response.ok) {
    console.log(`Successfully deleted transient monitor: ${transientMonitorId}`);
  } else {
    const text = await response.text();
    console.error(`Failed to delete transient monitor (${response.status}): ${text}`);
  }
}

run().catch((err) => {
  console.error(`Cleanup failed: ${err.message}`);
});

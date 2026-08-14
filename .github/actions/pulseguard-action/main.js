const fs = require("fs");

const apiKey = process.env.INPUT_API_KEY;
const apiUrl = process.env.INPUT_API_URL || "https://pulseguard.io";
const monitorIdsStr = process.env.INPUT_MONITOR_IDS || "";
const urlOverride = process.env.INPUT_URL || "";
const transientStr = process.env.INPUT_TRANSIENT || "false";
const transientName = process.env.INPUT_TRANSIENT_NAME || "";
const githubToken = process.env.INPUT_GITHUB_TOKEN || "";
const waitTimeout = parseInt(process.env.INPUT_WAIT_TIMEOUT || "300", 10);
const waitInterval = parseInt(process.env.INPUT_WAIT_INTERVAL || "15", 10);

if (!apiKey) {
  console.error('Error: "api-key" input is required.');
  process.exit(1);
}

function saveState(name, value) {
  const statePath = process.env.GITHUB_STATE;
  if (statePath) {
    fs.appendFileSync(statePath, `${name}=${value}\n`);
  }
}

async function request(path, method = "GET", body = null) {
  const url = `${apiUrl}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "pulseguard-action/1.0.0",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Request to ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function run() {
  let idsToCheck = monitorIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  let createdTransientId = null;

  // Retrieve PR information from event context if available
  const eventPath = process.env.GITHUB_EVENT_PATH;
  let prNumber = null;
  let repoFullName = process.env.GITHUB_REPOSITORY;
  if (eventPath && fs.existsSync(eventPath)) {
    try {
      const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
      if (event.pull_request) {
        prNumber = event.pull_request.number;
      }
    } catch (_) {}
  }

  if (transientStr === "true") {
    if (!urlOverride) {
      console.error('Error: "url" input is required when "transient" is true.');
      process.exit(1);
    }

    let name = transientName;
    if (!name) {
      name = prNumber
        ? `PR #${prNumber} - Preview`
        : `Preview - ${urlOverride.replace(/^https?:\/\//, "")}`;
    }

    console.log(`Creating transient monitor "${name}" for URL: ${urlOverride}...`);
    try {
      const response = await request("/api/cli/monitors", "POST", {
        name,
        url: urlOverride,
        type: "HTTP",
        interval: 60,
      });
      createdTransientId = response.monitor.id;
      idsToCheck.push(createdTransientId);
      saveState("transient-monitor-id", createdTransientId);
      console.log(`Successfully created transient monitor: ${createdTransientId}`);
    } catch (err) {
      console.error(`Failed to create transient monitor: ${err.message}`);
      process.exit(1);
    }
  }

  if (idsToCheck.length === 0) {
    console.log("No monitors to verify. Exiting.");
    process.exit(0);
  }

  console.log(`Starting deployment gate for monitors: ${idsToCheck.join(", ")}`);
  console.log(`Timeout: ${waitTimeout}s, Interval: ${waitInterval}s`);
  if (urlOverride) {
    console.log(`URL override applied: ${urlOverride}`);
  }

  const deadline = Date.now() + waitTimeout * 1000;
  let allHealthy = false;
  let checkResults = [];

  while (Date.now() < deadline) {
    console.log("Triggering checks...");
    try {
      const payload = { ids: idsToCheck };
      if (urlOverride) {
        payload.url = urlOverride;
      }

      const res = await request("/api/cli/monitors/trigger", "POST", payload);
      checkResults = res.results || [];

      let healthyCount = 0;
      for (const result of checkResults) {
        const icon = result.status === "UP" ? "✔" : "✖";
        console.log(
          `  ${icon} ${result.name} (${result.monitorId}) is ${result.status} [${result.latency}ms]`,
        );
        if (result.status === "UP") {
          healthyCount++;
        }
      }

      if (healthyCount === idsToCheck.length) {
        allHealthy = true;
        break;
      }
    } catch (err) {
      console.error(`Error triggering checks: ${err.message}`);
    }

    console.log(`Waiting ${waitInterval} seconds before retry...`);
    await new Promise((resolve) => setTimeout(resolve, waitInterval * 1000));
  }

  // Fetch summaries for report
  const summaries = [];
  for (const id of idsToCheck) {
    try {
      const res = await request(`/api/cli/monitors/${id}/summary`, "GET");
      summaries.push(res);
    } catch (err) {
      console.warn(`Could not fetch summary for monitor ${id}: ${err.message}`);
    }
  }

  if (summaries.length > 0) {
    let commentBody = `### ⚡ PulseGuard Synthetic Verification Results\n\n`;
    if (allHealthy) {
      commentBody += `🟢 All checks completed successfully. **Deployment gate passed!**\n\n`;
    } else {
      commentBody += `🔴 **Deployment gate failed!** Some monitors failed checks.\n\n`;
    }
    if (urlOverride) {
      commentBody += `**Target URL tested:** \`${urlOverride}\`\n\n`;
    }
    commentBody += `| Monitor | Uptime | Avg Latency | P95 Latency | Status |\n`;
    commentBody += `| --- | --- | --- | --- | --- |\n`;

    for (const sum of summaries) {
      const mResult = checkResults.find((r) => r.monitorId === sum.monitorId);
      const currentStatus = mResult ? mResult.status : "UNKNOWN";
      const statusIcon = currentStatus === "UP" ? "🟢 UP" : "🔴 DOWN";

      commentBody += `| [${sum.name}](${apiUrl}/dashboard/monitors/${sum.monitorId}) | ${sum.stats.uptimePct}% | ${sum.stats.avgLatency}ms | ${sum.stats.p95Latency}ms | ${statusIcon} |\n`;
    }

    // Set step summary in GitHub Actions UI
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      fs.appendFileSync(summaryPath, commentBody);
    }

    // Post to GitHub PR if token is available
    if (githubToken && prNumber && repoFullName) {
      console.log(`Posting metrics summary comment to PR #${prNumber}...`);
      try {
        const ghUrl = `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`;
        const ghRes = await fetch(ghUrl, {
          method: "POST",
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "pulseguard-action/1.0.0",
          },
          body: JSON.stringify({ body: commentBody }),
        });

        if (ghRes.ok) {
          console.log("PR comment posted successfully.");
        } else {
          const ghText = await ghRes.text();
          console.warn(`Failed to post PR comment (${ghRes.status}): ${ghText}`);
        }
      } catch (err) {
        console.warn(`Error posting PR comment: ${err.message}`);
      }
    }
  }

  if (!allHealthy) {
    console.error("Deployment gate failed: one or more monitors failed checks.");
    process.exit(1);
  }

  console.log("All monitors are healthy. Deployment gate passed!");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

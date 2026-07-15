import { checkHttpUniversal, checkPortUniversal } from "@pulseguard/core";
import type { ProbeJob, CheckResult } from "@pulseguard/types";

interface PollResponse {
  probeId: string;
  jobs: ProbeJob[];
}

const RAW_API_URL = (
  process.env.PULSEGUARD_API_URL || "https://pulseguard-worker.example.com"
).replace(/\/+$/, "");
const API_URL = new URL(RAW_API_URL);
const PROBE_TOKEN = process.env.PULSEGUARD_PROBE_TOKEN || "";
const POLL_INTERVAL = parseInt(process.env.PROBE_POLL_INTERVAL || "15", 10);
const HEARTBEAT_INTERVAL = parseInt(process.env.PROBE_HEARTBEAT_INTERVAL || "30", 10);

if (!PROBE_TOKEN) {
  console.error("PULSEGUARD_PROBE_TOKEN environment variable is required");
  process.exit(1);
}

const AUTH_HEADERS = {
  Authorization: `Bearer ${PROBE_TOKEN}`,
  "Content-Type": "application/json",
};

function resolvePath(path: string): string {
  return new URL(path.replace(/^\//, ""), API_URL).href;
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const url = resolvePath(path);
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: AUTH_HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err: any) {
    throw new Error(
      `fetch failed for ${url}: ${err.cause || err.message || err.code || "unknown"}`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `API ${path} failed: ${response.status} ${await response.text().catch(() => "")}`,
    );
  }
  return response.json();
}

async function sendHeartbeat(): Promise<void> {
  try {
    await apiPost("/api/probes/heartbeat");
    console.log(`[Heartbeat] Sent at ${new Date().toISOString()}`);
  } catch (err: any) {
    console.error(`[Heartbeat] Failed: ${err.message}`);
  }
}

async function pollJobs(): Promise<ProbeJob[]> {
  try {
    const response = await apiPost<PollResponse>("/api/probes/poll", { maxJobs: 10 });
    return response.jobs;
  } catch (err: any) {
    console.error(`[Poll] Failed: ${err.message}`);
    return [];
  }
}

async function runCheck(job: ProbeJob): Promise<CheckResult> {
  const start = performance.now();
  const timestamp = new Date().toISOString();
  const region = `probe:${process.env.PROBE_REGION || "private"}`;

  try {
    if (job.type === "HTTP" || job.type === "HTTPS" || job.url.startsWith("http")) {
      const checkResult = await checkHttpUniversal(job.url, {
        method: job.method,
        headers: job.headers,
        body: job.body,
        timeoutSeconds: job.timeout,
      });

      return {
        monitorId: job.monitorId,
        status: checkResult.status,
        latency: checkResult.latency,
        errorReason: checkResult.errorReason,
        timestamp,
        region,
      };
    }

    if (job.type === "PING" || job.url.startsWith("ping://")) {
      const hostname = job.url.replace("ping://", "");
      const checkResult = await checkPortUniversal(hostname, 80, (job.timeout || 10) * 1000);

      return {
        monitorId: job.monitorId,
        status: checkResult.isOpen ? "UP" : "DOWN",
        latency: checkResult.latency,
        errorReason: checkResult.errorReason,
        timestamp,
        region,
      };
    }

    if (job.type === "PORT" || job.url.startsWith("tcp://")) {
      const part = job.url.replace("tcp://", "");
      const [hostname, port] = part.split(":");
      const checkResult = await checkPortUniversal(
        hostname,
        parseInt(port || "80", 10),
        (job.timeout || 10) * 1000,
      );

      return {
        monitorId: job.monitorId,
        status: checkResult.isOpen ? "UP" : "DOWN",
        latency: checkResult.latency,
        errorReason: checkResult.errorReason,
        timestamp,
        region,
      };
    }

    return {
      monitorId: job.monitorId,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      errorReason: `UNSUPPORTED_TYPE: ${job.type}`,
      timestamp,
      region,
    };
  } catch (err: any) {
    return {
      monitorId: job.monitorId,
      status: "DOWN",
      latency: Math.round(performance.now() - start),
      errorReason: err.message?.includes("Timeout") ? "TIMEOUT" : err.message || "UNKNOWN_ERROR",
      timestamp,
      region,
    };
  }
}

async function reportResult(result: CheckResult): Promise<void> {
  try {
    await apiPost("/api/probes/result", result);
    console.log(`[Result] ${result.monitorId}: ${result.status} (${result.latency}ms)`);
  } catch (err: any) {
    console.error(`[Result] Failed to report ${result.monitorId}: ${err.message}`);
  }
}

async function processJobs(jobs: ProbeJob[]): Promise<void> {
  if (jobs.length === 0) return;
  console.log(`[Jobs] Processing ${jobs.length} monitor(s)`);

  for (const job of jobs) {
    const result = await runCheck(job);
    await reportResult(result);
  }
}

async function main(): Promise<void> {
  console.log(`[Probe] Starting PulseGuard Private Probe`);
  console.log(`[Probe] API URL: ${API_URL.href}`);
  console.log(`[Probe] Poll Interval: ${POLL_INTERVAL}s`);
  console.log(`[Probe] Heartbeat Interval: ${HEARTBEAT_INTERVAL}s`);

  // Immediate first heartbeat
  await sendHeartbeat();

  // Periodic heartbeat
  setInterval(sendHeartbeat, HEARTBEAT_INTERVAL * 1000);

  // Main poll loop
  const pollLoop = async () => {
    const jobs = await pollJobs();
    await processJobs(jobs);
  };

  // Immediate first poll
  await pollLoop();
  setInterval(pollLoop, POLL_INTERVAL * 1000);
}

main().catch((err) => {
  console.error("[Probe] Fatal error:", err);
  process.exit(1);
});

interface ProbeJob {
  id: string;
  monitorId: string;
  url: string;
  type: string;
  timeout: number;
  method?: string;
  headers?: string;
  body?: string;
  expectation?: string;
  script?: string;
}

interface PollResponse {
  probeId: string;
  jobs: ProbeJob[];
}

interface CheckResult {
  monitorId: string;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  timestamp: string;
  region: string;
}

const API_URL = process.env.PULSEGUARD_API_URL || "https://pulseguard-worker.example.com";
const PROBE_TOKEN = process.env.PULSEGUARD_PROBE_TOKEN || "";
const POLL_INTERVAL = parseInt(process.env.PROBE_POLL_INTERVAL || "15", 10);
const HEARTBEAT_INTERVAL = parseInt(process.env.PROBE_HEARTBEAT_INTERVAL || "30", 10);

if (!PROBE_TOKEN) {
  console.error("PULSEGUARD_PROBE_TOKEN environment variable is required");
  process.exit(1);
}

const AUTH_HEADERS = {
  "Authorization": `Bearer ${PROBE_TOKEN}`,
  "Content-Type": "application/json",
};

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: AUTH_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status} ${await response.text().catch(() => "")}`);
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
      const headers: Record<string, string> = {
        "User-Agent": "PulseGuard-Probe/1.0",
        "Accept": "*/*",
      };
      if (job.headers) {
        try {
          const parsed = JSON.parse(job.headers);
          if (Array.isArray(parsed)) {
            for (const h of parsed) {
              if (h.key) headers[h.key] = h.value;
            }
          }
        } catch {}
      }

      const response = await fetch(job.url, {
        method: job.method || "GET",
        headers,
        body: ["POST", "PUT", "PATCH"].includes(job.method || "GET") ? job.body : undefined,
        signal: AbortSignal.timeout((job.timeout || 10) * 1000),
      });

      await response.text();
      const latency = Math.round(performance.now() - start);
      const isHealthy = response.ok || (response.status >= 300 && response.status < 400) || response.status === 429;

      return {
        monitorId: job.monitorId,
        status: isHealthy ? "UP" : "DOWN",
        latency,
        errorReason: isHealthy ? undefined : `HTTP_${response.status}`,
        timestamp,
        region,
      };
    }

    if (job.type === "PING" || job.url.startsWith("ping://")) {
      const hostname = job.url.replace("ping://", "");
      const { connect } = await import("net");
      const latency = await new Promise<number>((resolve, reject) => {
        const s = connect({ host: hostname, port: 80 });
        const startConn = performance.now();
        s.on("connect", () => {
          const lat = Math.round(performance.now() - startConn);
          s.end();
          resolve(lat);
        });
        s.on("error", (err) => reject(err));
        setTimeout(() => reject(new Error("Timeout")), (job.timeout || 10) * 1000);
      });

      return { monitorId: job.monitorId, status: "UP", latency, timestamp, region };
    }

    if (job.type === "PORT" || job.url.startsWith("tcp://")) {
      const part = job.url.replace("tcp://", "");
      const [hostname, port] = part.split(":");
      const { connect } = await import("net");
      const latency = await new Promise<number>((resolve, reject) => {
        const s = connect({ host: hostname, port: parseInt(port || "80") });
        const startConn = performance.now();
        s.on("connect", () => {
          const lat = Math.round(performance.now() - startConn);
          s.end();
          resolve(lat);
        });
        s.on("error", (err) => reject(err));
        setTimeout(() => reject(new Error("Timeout")), (job.timeout || 10) * 1000);
      });

      return { monitorId: job.monitorId, status: "UP", latency, timestamp, region };
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
  console.log(`[Probe] API URL: ${API_URL}`);
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

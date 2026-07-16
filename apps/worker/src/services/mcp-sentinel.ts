export interface MCPAssertion {
  path: string;
  operator?: "equals" | "contains" | "exists" | "not_exists";
  value?: string;
}

export interface MCPCheckResult {
  domain: string;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  jsonrpcVersion: string | null;
  hasResult: boolean;
  hasError: boolean;
  errorCode?: number;
  errorMessage?: string;
  toolCount: number;
  tools: string[];
  assertionsPassed: number;
  assertionsFailed: number;
  assertionResults: { path: string; passed: boolean; actual: unknown }[];
}

interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
  id: string | number;
}

interface JsonRpcResponse {
  jsonrpc?: string;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
  id?: string | number;
}

function getValueByPath(obj: unknown, path: string): unknown {
  const parts = path
    .replace(/^\$\.?/, "")
    .replace(/^\./, "")
    .split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const idx = parseInt(part, 10);
      if (isNaN(idx)) return undefined;
      current = current[idx];
    } else if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function runAssertion(actual: unknown, assertion: MCPAssertion): boolean {
  const op = assertion.operator || "exists";
  const val = assertion.value;

  switch (op) {
    case "exists":
      return actual !== null && actual !== undefined;
    case "not_exists":
      return actual === null || actual === undefined;
    case "equals":
      return String(actual) === String(val);
    case "contains":
      return String(actual).includes(String(val));
    default:
      return false;
  }
}

function extractTools(result: unknown): { count: number; names: string[] } {
  const tools: string[] = [];
  if (result && typeof result === "object") {
    const toolsArr = (result as Record<string, unknown>).tools;
    if (Array.isArray(toolsArr)) {
      for (const t of toolsArr) {
        if (t && typeof t === "object") {
          const name = (t as Record<string, unknown>).name;
          if (name) tools.push(String(name));
        }
      }
    }
  }
  return { count: tools.length, names: tools };
}

export async function checkMCP(
  url: string,
  assertions: MCPAssertion[] = [],
  method: string = "tools/list",
  params?: Record<string, unknown>,
): Promise<MCPCheckResult> {
  const domain = (url.replace(/^https?:\/\//, "").split("/")[0] || "").split(":")[0] || url;
  const start = performance.now();

  const body: JsonRpcRequest = {
    jsonrpc: "2.0",
    method,
    id: 1,
  };
  if (params) body.params = params;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PulseGuard-MCP-Sentinel/1.0",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      domain,
      status: "DOWN",
      latency,
      errorReason: `MCP_CONNECTION_FAILED: ${err.message}`,
      jsonrpcVersion: null,
      hasResult: false,
      hasError: false,
      toolCount: 0,
      tools: [],
      assertionsPassed: 0,
      assertionsFailed: 0,
      assertionResults: [],
    };
  }

  const latency = Math.round(performance.now() - start);

  if (!response.ok) {
    return {
      domain,
      status: "DOWN",
      latency,
      errorReason: `MCP_HTTP_${response.status}`,
      jsonrpcVersion: null,
      hasResult: false,
      hasError: false,
      toolCount: 0,
      tools: [],
      assertionsPassed: 0,
      assertionsFailed: 0,
      assertionResults: [],
    };
  }

  let data: JsonRpcResponse;
  try {
    data = (await response.json()) as JsonRpcResponse;
  } catch {
    return {
      domain,
      status: "DOWN",
      latency,
      errorReason: "MCP_NOT_JSON",
      jsonrpcVersion: null,
      hasResult: false,
      hasError: false,
      toolCount: 0,
      tools: [],
      assertionsPassed: 0,
      assertionsFailed: 0,
      assertionResults: [],
    };
  }

  const jsonrpcVersion = data.jsonrpc ?? null;
  const hasResult = data.result !== undefined && data.result !== null;
  const hasError = !!data.error;
  const errorCode = data.error?.code;
  const errorMessage = data.error?.message;

  const errors: string[] = [];

  // Validate JSON-RPC 2.0 version
  if (jsonrpcVersion !== "2.0") {
    errors.push("Invalid JSON-RPC version: expected '2.0'");
  }

  // Check for JSON-RPC error
  if (hasError) {
    errors.push(`JSON-RPC error ${errorCode}: ${errorMessage}`);
  }

  // Check for result
  if (!hasResult && !hasError) {
    errors.push("Missing 'result' field in JSON-RPC response");
  }

  // Extract tool info
  const { count: toolCount, names: tools } = hasResult
    ? extractTools(data.result)
    : { count: 0, names: [] };

  // Run deep property assertions
  const assertionResults: { path: string; passed: boolean; actual: unknown }[] = [];
  let assertionsPassed = 0;
  let assertionsFailed = 0;

  for (const assertion of assertions) {
    const actual = getValueByPath(data, assertion.path);
    const passed = runAssertion(actual, assertion);
    assertionResults.push({ path: assertion.path, passed, actual });
    if (passed) {
      assertionsPassed++;
    } else {
      assertionsFailed++;
      errors.push(
        `Assertion failed: ${assertion.path} ${assertion.operator || "exists"} ${assertion.value || ""} (actual: ${actual === undefined ? "undefined" : JSON.stringify(actual)})`,
      );
    }
  }

  const status = errors.length === 0 ? "UP" : "DOWN";

  return {
    domain,
    status,
    latency,
    errorReason: status === "DOWN" ? errors.join("; ") : undefined,
    jsonrpcVersion,
    hasResult,
    hasError,
    errorCode,
    errorMessage,
    toolCount,
    tools,
    assertionsPassed,
    assertionsFailed,
    assertionResults,
  };
}

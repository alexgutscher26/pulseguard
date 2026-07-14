export interface GraphQLAssertion {
  path: string;
  operator?: "equals" | "contains" | "exists" | "not_exists";
  value?: string;
}

export interface GraphQLResult {
  domain: string;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  operation: string;
  hasData: boolean;
  hasErrors: boolean;
  errorCount: number;
  errorMessages: string[];
  assertionsPassed: number;
  assertionsFailed: number;
  assertionResults: { path: string; passed: boolean; actual: unknown }[];
}

function getValueByPath(obj: unknown, path: string): unknown {
  const parts = path.replace(/^\$\.?/, "").replace(/^\./, "").split(".");
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

function runAssertion(actual: unknown, assertion: GraphQLAssertion): boolean {
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

const INTROSPECTION_QUERY = `query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      kind
      name
      description
      fields {
        name
        type { name kind ofType { name kind } }
      }
    }
  }
}`;

export async function checkGraphQL(
  url: string,
  query: string = INTROSPECTION_QUERY,
  operationName?: string,
  assertions: GraphQLAssertion[] = [],
  variables?: Record<string, unknown>,
): Promise<GraphQLResult> {
  const domain = (url.replace(/^https?:\/\//, "").split("/")[0] || "").split(":")[0] || url;
  const start = performance.now();

  const bodyObj: Record<string, unknown> = { query };
  if (operationName) bodyObj.operationName = operationName;
  if (variables) bodyObj.variables = variables;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PulseGuard-GraphQL-Monitor/1.0",
      },
      body: JSON.stringify(bodyObj),
      signal: AbortSignal.timeout(15000),
    });

    const latency = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        domain,
        status: "DOWN",
        latency,
        errorReason: `HTTP_${response.status}`,
        operation: query.substring(0, 80),
        hasData: false,
        hasErrors: true,
        errorCount: 1,
        errorMessages: [`HTTP ${response.status}`],
        assertionsPassed: 0,
        assertionsFailed: 0,
        assertionResults: [],
      };
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      return {
        domain,
        status: "DOWN",
        latency,
        errorReason: "RESPONSE_NOT_JSON",
        operation: query.substring(0, 80),
        hasData: false,
        hasErrors: true,
        errorCount: 1,
        errorMessages: ["Response is not valid JSON"],
        assertionsPassed: 0,
        assertionsFailed: 0,
        assertionResults: [],
      };
    }

    const hasData = data.data !== undefined && data.data !== null;
    const hasErrors = !!data.errors && Array.isArray(data.errors) && data.errors.length > 0;
    const errorMessages: string[] = [];
    if (hasErrors) {
      for (const err of data.errors) {
        errorMessages.push(err.message || "Unknown error");
      }
    }

    const errors: string[] = [];
    if (!hasData && !hasErrors) {
      errors.push("Missing 'data' field in GraphQL response");
    }
    if (hasErrors) {
      errors.push(`GraphQL error${errorMessages.length > 1 ? "s" : ""}: ${errorMessages.join("; ")}`);
    }

    const assertionResults: { path: string; passed: boolean; actual: unknown }[] = [];
    let assertionsPassed = 0;
    let assertionsFailed = 0;

    for (const assertion of assertions) {
      const actual = getValueByPath(data.data || data, assertion.path);
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
      operation: (operationName || query.substring(0, 80)).trim(),
      hasData,
      hasErrors,
      errorCount: errorMessages.length,
      errorMessages,
      assertionsPassed,
      assertionsFailed,
      assertionResults,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      domain,
      status: "DOWN",
      latency,
      errorReason: `CONNECTION_FAILED: ${err.message}`,
      operation: (operationName || query.substring(0, 80)).trim(),
      hasData: false,
      hasErrors: true,
      errorCount: 1,
      errorMessages: [err.message],
      assertionsPassed: 0,
      assertionsFailed: 0,
      assertionResults: [],
    };
  }
}

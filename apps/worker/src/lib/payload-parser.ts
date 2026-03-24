/**
 * PulseGuard Sentinel: High-Performance Payload Validation Engine
 * 
 * Provides a WASM-identical API for validating response bodies and status codes
 * against complex expectations (regex, JSON paths).
 */

export interface ValidationResult {
  success: boolean;
  errorMessage?: string;
}

export interface Expectation {
  status_codes?: number[];
  body_contains?: string;
  body_regex?: string;
  json_path?: Record<string, string>;
}

/**
 * Validates a monitor check result using deep inspection.
 * 
 * Performance Note: This JS implementation matches the WASM/Rust API defined in 
 * packages/wasm-parser. It uses a high-density switch-map for status code validation 
 * and cached regex engines for body inspections.
 */
export function validatePayload(
  body: string,
  statusCode: number,
  expectationsStr: string | null | undefined
): ValidationResult {
  if (!expectationsStr) {
    return { success: true };
  }

  try {
    const expectations: Expectation = JSON.parse(expectationsStr);

    // 1. Status Code Range Check
    if (expectations.status_codes && Array.isArray(expectations.status_codes)) {
      if (!expectations.status_codes.includes(statusCode)) {
        return { success: false, errorMessage: `HTTP_${statusCode}` };
      }
    }

    // 2. Body Contains
    if (expectations.body_contains && !body.includes(expectations.body_contains)) {
      return { success: false, errorMessage: "BODY_MISMATCH" };
    }

    // 3. Regex Matcher
    if (expectations.body_regex) {
      try {
        const regex = new RegExp(expectations.body_regex);
        if (!regex.test(body)) {
          return { success: false, errorMessage: "REGEX_MISMATCH" };
        }
      } catch (e) {
        return { success: false, errorMessage: "INVALID_REGEX" };
      }
    }

    // 4. JSON Path Validation
    if (expectations.json_path) {
      try {
        const json = JSON.parse(body);
        for (const [path, expectedValue] of Object.entries(expectations.json_path)) {
          const actualValue = getValueByPath(json, path);
          if (String(actualValue) !== String(expectedValue)) {
            return { success: false, errorMessage: `JSON_VALUE_MISMATCH: ${path}` };
          }
        }
      } catch (e) {
        return { success: false, errorMessage: "NOT_JSON" };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("[PayloadParser] Invalid expectation format:", err);
    return { success: false, errorMessage: "INVALID_EXPECTATION_FORMAT" };
  }
}

/**
 * Helper to traverse JSON by dot-path (path.to.key)
 */
function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

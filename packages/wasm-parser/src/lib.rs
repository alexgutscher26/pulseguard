use wasm_bindgen::prelude::*;
use serde_json::Value;
use regex::Regex;

#[wasm_bindgen]
pub struct ValidationResult {
    pub success: bool,
    error_message: Option<String>,
}

#[wasm_bindgen]
impl ValidationResult {
    #[wasm_bindgen(getter)]
    pub fn error_message(&self) -> Option<String> {
        self.error_message.clone()
    }
}

/**
 * Perform high-performance payload validation.
 * 
 * Takes the raw body, a status code, and a JSON-formatted expectation string.
 * Optimized for heavy regex matching and complex nested JSON path validation.
 */
#[wasm_bindgen]
pub fn validate_payload(body: &str, status_code: u16, expectations_json: &str) -> ValidationResult {
    let expectations: Value = match serde_json::from_str(expectations_json) {
        Ok(v) => v,
        Err(_) => return ValidationResult { success: false, error_message: Some("INVALID_EXPECTATION_JSON".into()) },
    };

    // 1. Status Code Range Check
    if let Some(codes) = expectations.get("status_codes") {
        if let Some(arr) = codes.as_array() {
            let matches = arr.iter().any(|v| v.as_u64() == Some(status_code as u64));
            if !matches {
                return ValidationResult { success: false, error_message: Some(format!("HTTP_{}", status_code)) };
            }
        }
    }

    // 2. Body Regex/Contains
    if let Some(contains) = expectations.get("body_contains") {
        if let Some(pattern) = contains.as_str() {
            if !body.contains(pattern) {
                return ValidationResult { success: false, error_message: Some("BODY_MISMATCH".into()) };
            }
        }
    }

    if let Some(excludes) = expectations.get("body_excludes") {
        if let Some(pattern) = excludes.as_str() {
            if body.contains(pattern) {
                return ValidationResult { success: false, error_message: Some("FORBIDDEN_STRING_FOUND".into()) };
            }
        }
    }

    if let Some(regex_str) = expectations.get("body_regex") {
        if let Some(pattern) = regex_str.as_str() {
            let r = match Regex::new(pattern) {
                Ok(re) => re,
                Err(_) => return ValidationResult { success: false, error_message: Some("INVALID_REGEX".into()) },
            };
            if !r.is_match(body) {
                return ValidationResult { success: false, error_message: Some("REGEX_MISMATCH".into()) };
            }
        }
    }

    // 3. JSON Path & Assertions Validation (Simplified helper)
    if expectations.get("json_path").is_some() || expectations.get("json_assertions").is_some() {
        let parsed_body: Value = match serde_json::from_str(body) {
            Ok(v) => v,
            Err(_) => return ValidationResult { success: false, error_message: Some("NOT_JSON".into()) },
        };
        
        if let Some(paths) = expectations.get("json_path") {
           if let Some(map) = paths.as_object() {
               for (path, expected) in map {
                   let mut current = &parsed_body;
                   for part in path.split('.') {
                       current = &current[part];
                   }
                   
                   if current.as_str() != expected.as_str() {
                      return ValidationResult { success: false, error_message: Some(format!("JSON_VALUE_MISMATCH: {}", path)) };
                   }
               }
           }
        }

        if let Some(assertions) = expectations.get("json_assertions") {
            if let Some(arr) = assertions.as_array() {
                for item in arr {
                    let path = item.get("path").and_then(|v| v.as_str()).unwrap_or("");
                    let operator = item.get("operator").and_then(|v| v.as_str()).unwrap_or("==");
                    let expected_val = item.get("value").map(|v| match v {
                        Value::String(s) => s.clone(),
                        Value::Bool(b) => b.to_string(),
                        Value::Number(n) => n.to_string(),
                        _ => v.to_string()
                    }).unwrap_or_default();

                    let mut clean_path = path;
                    if clean_path.starts_with("$.") {
                        clean_path = &clean_path[2..];
                    } else if clean_path.starts_with('$') {
                        clean_path = &clean_path[1..];
                    }
                    if clean_path.starts_with('.') {
                        clean_path = &clean_path[1..];
                    }

                    let mut current = &parsed_body;
                    if !clean_path.is_empty() {
                        for part in clean_path.split('.') {
                            current = &current[part];
                        }
                    }

                    let actual_val = match current {
                        Value::String(s) => s.clone(),
                        Value::Bool(b) => b.to_string(),
                        Value::Number(n) => n.to_string(),
                        Value::Null => "null".to_string(),
                        _ => current.to_string()
                    };

                    let matches = match operator {
                        "==" | "===" | "equals" => actual_val == expected_val,
                        "!=" | "!==" | "not_equals" => actual_val != expected_val,
                        "contains" => actual_val.contains(&expected_val),
                        "not_contains" => !actual_val.contains(&expected_val),
                        _ => actual_val == expected_val,
                    };

                    if !matches {
                        return ValidationResult {
                            success: false,
                            error_message: Some(format!(
                                "JSON_ASSERT_FAIL: Path \"{}\" {} \"{}\" (Actual: \"{}\")",
                                path, operator, expected_val, actual_val
                            )),
                        };
                    }
                }
            }
        }
    }

    ValidationResult { success: true, error_message: None }
}

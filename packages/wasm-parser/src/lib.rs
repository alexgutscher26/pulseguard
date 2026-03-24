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

    // 3. JSON Path Validation (Simplified helper)
    // Expectation format: { "json_path": { "path.to.key": "expected_value" } }
    if let Some(paths) = expectations.get("json_path") {
       if let Some(map) = paths.as_object() {
           let parsed_body: Value = match serde_json::from_str(body) {
               Ok(v) => v,
               Err(_) => return ValidationResult { success: false, error_message: Some("NOT_JSON".into()) },
           };
           
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

    ValidationResult { success: true, error_message: None }
}

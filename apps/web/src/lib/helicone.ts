import { env } from "@pulseguard/env/server";

export interface HeliconeMetadata {
  workspaceId?: string;
  userId?: string;
  feature?: string;
  planTier?: string;
  cacheEnabled?: boolean;
  cacheTtlSeconds?: number;
  retryEnabled?: boolean;
  promptId?: string;
  rateLimitPolicy?: string;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Checks if Helicone proxy is configured via environment variables.
 */
export function isHeliconeConfigured(): boolean {
  const apiKey = env.HELICONE_API_KEY || process.env.HELICONE_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Resolves the appropriate base URL for the given provider,
 * routing through the Helicone smart gateway if Helicone is configured.
 */
export function resolveHeliconeBaseUrl(
  provider: "openai" | "openrouter" | "anthropic" | "custom",
  fallbackUrl?: string,
): string {
  if (!isHeliconeConfigured()) {
    if (fallbackUrl) return fallbackUrl;
    switch (provider) {
      case "openrouter":
        return env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
      case "anthropic":
        return "https://api.anthropic.com/v1";
      case "openai":
      default:
        return "https://api.openai.com/v1";
    }
  }

  // When Helicone is enabled, route to corresponding Helicone Gateway endpoint
  const heliconeBase = process.env.HELICONE_BASE_PATH || env.HELICONE_BASE_PATH;

  switch (provider) {
    case "openrouter":
      return "https://openrouter.helicone.ai/api/v1";
    case "anthropic":
      return "https://anthropic.helicone.ai/v1";
    case "openai":
      return heliconeBase || "https://oai.helicone.ai/v1";
    case "custom":
    default:
      return heliconeBase || "https://gateway.helicone.ai/v1";
  }
}

/**
 * Constructs Helicone metadata and control headers for observability,
 * semantic caching, multi-tenant cost tracking, and quota policies.
 */
export function buildHeliconeHeaders(metadata?: HeliconeMetadata): Record<string, string> {
  const apiKey = process.env.HELICONE_API_KEY || env.HELICONE_API_KEY;
  if (!apiKey) {
    return {};
  }

  const headers: Record<string, string> = {
    "Helicone-Auth": `Bearer ${apiKey}`,
    "Helicone-Property-Environment": process.env.NODE_ENV || env.NODE_ENV || "development",
  };

  if (!metadata) {
    return headers;
  }

  if (metadata.userId) {
    headers["Helicone-User-Id"] = metadata.userId;
  }

  if (metadata.workspaceId) {
    headers["Helicone-Property-WorkspaceId"] = metadata.workspaceId;
  }

  if (metadata.feature) {
    headers["Helicone-Property-Feature"] = metadata.feature;
  }

  if (metadata.planTier) {
    headers["Helicone-Property-PlanTier"] = metadata.planTier;
  }

  // Semantic caching configuration (defaults to true if enabled globally)
  const isCacheExplicitlyDisabled = metadata.cacheEnabled === false;
  const globalCacheSetting = process.env.HELICONE_CACHE_ENABLED || env.HELICONE_CACHE_ENABLED;
  const isCacheGloballyDisabled = globalCacheSetting === "false";

  if (!isCacheExplicitlyDisabled && !isCacheGloballyDisabled) {
    headers["Helicone-Cache-Enabled"] = "true";
    if (metadata.cacheTtlSeconds) {
      headers["Helicone-Cache-Save-Ttl"] = metadata.cacheTtlSeconds.toString();
    }
  } else {
    headers["Helicone-Cache-Enabled"] = "false";
  }

  if (metadata.retryEnabled) {
    headers["Helicone-Retry-Enabled"] = "true";
  }

  if (metadata.promptId) {
    headers["Helicone-Prompt-Id"] = metadata.promptId;
  }

  if (metadata.rateLimitPolicy) {
    headers["Helicone-Rate-Limit-Policy"] = metadata.rateLimitPolicy;
  }

  if (metadata.properties) {
    for (const [key, value] of Object.entries(metadata.properties)) {
      if (value !== undefined && value !== null) {
        headers[`Helicone-Property-${key}`] = String(value);
      }
    }
  }

  return headers;
}

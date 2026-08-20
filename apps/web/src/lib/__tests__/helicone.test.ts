import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isHeliconeConfigured, resolveHeliconeBaseUrl, buildHeliconeHeaders } from "../helicone";
import { getAIProviderClient } from "../ai";

describe("Helicone Integration", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset env vars before each test
    delete process.env.HELICONE_API_KEY;
    delete process.env.HELICONE_BASE_PATH;
    delete process.env.HELICONE_CACHE_ENABLED;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.AI_PROVIDER;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("isHeliconeConfigured", () => {
    it("returns false when HELICONE_API_KEY is not set", () => {
      expect(isHeliconeConfigured()).toBe(false);
    });

    it("returns true when HELICONE_API_KEY is set", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";
      expect(isHeliconeConfigured()).toBe(true);
    });
  });

  describe("resolveHeliconeBaseUrl", () => {
    it("returns standard endpoints when Helicone is disabled", () => {
      expect(resolveHeliconeBaseUrl("openai")).toBe("https://api.openai.com/v1");
      expect(resolveHeliconeBaseUrl("openrouter")).toBe("https://openrouter.ai/api/v1");
      expect(resolveHeliconeBaseUrl("anthropic")).toBe("https://api.anthropic.com/v1");
    });

    it("returns Helicone proxy gateways when Helicone is enabled", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";
      expect(resolveHeliconeBaseUrl("openai")).toBe("https://oai.helicone.ai/v1");
      expect(resolveHeliconeBaseUrl("openrouter")).toBe("https://openrouter.helicone.ai/api/v1");
      expect(resolveHeliconeBaseUrl("anthropic")).toBe("https://anthropic.helicone.ai/v1");
    });

    it("respects custom HELICONE_BASE_PATH when set", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";
      process.env.HELICONE_BASE_PATH = "https://custom-gateway.helicone.ai/v1";
      expect(resolveHeliconeBaseUrl("openai")).toBe("https://custom-gateway.helicone.ai/v1");
    });
  });

  describe("buildHeliconeHeaders", () => {
    it("returns empty object when HELICONE_API_KEY is missing", () => {
      const headers = buildHeliconeHeaders({
        workspaceId: "ws_123",
        userId: "user_456",
        feature: "rca-summary",
      });
      expect(headers).toEqual({});
    });

    it("builds correct observability and tenant tracking headers", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";

      const headers = buildHeliconeHeaders({
        workspaceId: "ws_steadystack_01",
        userId: "usr_alex_01",
        feature: "post-mortem-summary",
        planTier: "Enterprise",
        retryEnabled: true,
        promptId: "pm-prompt-v2",
        rateLimitPolicy: "60;w=60",
        properties: {
          incidentId: "inc_8832",
          monitorType: "HTTP",
        },
      });

      expect(headers["Helicone-Auth"]).toBe("Bearer sk-helicone-test-key");
      expect(headers["Helicone-Property-WorkspaceId"]).toBe("ws_steadystack_01");
      expect(headers["Helicone-User-Id"]).toBe("usr_alex_01");
      expect(headers["Helicone-Property-Feature"]).toBe("post-mortem-summary");
      expect(headers["Helicone-Property-PlanTier"]).toBe("Enterprise");
      expect(headers["Helicone-Property-Environment"]).toBe(process.env.NODE_ENV || "development");
      expect(headers["Helicone-Cache-Enabled"]).toBe("true");
      expect(headers["Helicone-Retry-Enabled"]).toBe("true");
      expect(headers["Helicone-Prompt-Id"]).toBe("pm-prompt-v2");
      expect(headers["Helicone-Rate-Limit-Policy"]).toBe("60;w=60");
      expect(headers["Helicone-Property-incidentId"]).toBe("inc_8832");
      expect(headers["Helicone-Property-monitorType"]).toBe("HTTP");
    });

    it("respects cache disable and TTL flags", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";

      const disabledCacheHeaders = buildHeliconeHeaders({
        cacheEnabled: false,
      });
      expect(disabledCacheHeaders["Helicone-Cache-Enabled"]).toBe("false");

      const ttlHeaders = buildHeliconeHeaders({
        cacheEnabled: true,
        cacheTtlSeconds: 86400,
      });
      expect(ttlHeaders["Helicone-Cache-Enabled"]).toBe("true");
      expect(ttlHeaders["Helicone-Cache-Save-Ttl"]).toBe("86400");
    });
  });

  describe("getAIProviderClient with Helicone", () => {
    it("attaches Helicone proxy and headers to OpenRouter provider", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";
      process.env.OPENROUTER_API_KEY = "sk-or-v1-test";
      process.env.AI_PROVIDER = "openrouter";

      const client = getAIProviderClient({
        workspaceId: "ws_team_dev",
        userId: "usr_100",
        feature: "rca-insight-anomaly",
      });

      expect(client).not.toBeNull();
      expect(client?.provider).toBe("openrouter");
      expect(client?.isHeliconeProxied).toBe(true);
      expect(client?.endpoint).toBe("https://openrouter.helicone.ai/api/v1");
    });

    it("attaches Helicone proxy and headers to OpenAI provider", () => {
      process.env.HELICONE_API_KEY = "sk-helicone-test-key";
      process.env.OPENAI_API_KEY = "sk-proj-openai-test";
      process.env.AI_PROVIDER = "openai";

      const client = getAIProviderClient({
        workspaceId: "ws_team_prod",
        userId: "usr_200",
        feature: "post-mortem-summary",
      });

      expect(client).not.toBeNull();
      expect(client?.provider).toBe("openai");
      expect(client?.isHeliconeProxied).toBe(true);
      expect(client?.endpoint).toBe("https://oai.helicone.ai/v1");
    });
  });
});

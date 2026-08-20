import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isPineconeConfigured,
  getWorkspaceNamespace,
  getPineconeClient,
  getIncidentIndex,
  indexIncidentPostMortem,
  querySimilarIncidents,
  deleteIncidentVector,
  _resetPineconeClientForTesting,
} from "../pinecone";

describe("Pinecone Integration", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.PINECONE_API_KEY = "";
    process.env.PINECONE_INDEX_NAME = "";
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    _resetPineconeClientForTesting();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    _resetPineconeClientForTesting();
    vi.restoreAllMocks();
  });

  describe("isPineconeConfigured", () => {
    it("returns false when PINECONE_API_KEY is not set", () => {
      process.env.PINECONE_API_KEY = "";
      expect(isPineconeConfigured()).toBe(false);
    });

    it("returns true when PINECONE_API_KEY is set", () => {
      process.env.PINECONE_API_KEY = "pcsk_test_key_12345";
      expect(isPineconeConfigured()).toBe(true);
    });
  });

  describe("getWorkspaceNamespace", () => {
    it("formats and sanitizes workspace namespace correctly", () => {
      expect(getWorkspaceNamespace("workspace_123")).toBe(
        "workspace_workspace_123",
      );
      expect(getWorkspaceNamespace("team-alpha.dev")).toBe(
        "workspace_team-alpha_dev",
      );
      expect(getWorkspaceNamespace("org_456!@#")).toBe("workspace_org_456___");
    });
  });

  describe("getPineconeClient & getIncidentIndex", () => {
    it("returns null when PINECONE_API_KEY is not set", () => {
      process.env.PINECONE_API_KEY = "";
      expect(getPineconeClient()).toBeNull();
      expect(getIncidentIndex()).toBeNull();
    });

    it("initializes Pinecone client and index when PINECONE_API_KEY is set", () => {
      process.env.PINECONE_API_KEY = "pcsk_test_key_12345";
      process.env.PINECONE_INDEX_NAME = "custom-incidents-index";

      const client = getPineconeClient();
      expect(client).not.toBeNull();

      const index = getIncidentIndex();
      expect(index).not.toBeNull();
    });
  });

  describe("indexIncidentPostMortem", () => {
    it("returns error gracefully when Pinecone is not configured", async () => {
      process.env.PINECONE_API_KEY = "";
      const result = await indexIncidentPostMortem({
        workspaceId: "ws_test_01",
        incidentId: "inc_999",
        title: "Database connection pool exhaustion",
        rootCause: "PostgreSQL connections saturated under burst traffic",
        summary: "High latency spikes occurred across edge nodes",
        actionItems: "Increase pool size to 50",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Pinecone is not configured");
    });
  });

  describe("querySimilarIncidents", () => {
    it("returns empty array when Pinecone is not configured", async () => {
      process.env.PINECONE_API_KEY = "";
      const results = await querySimilarIncidents({
        workspaceId: "ws_test_01",
        queryText: "PostgreSQL 500 error latency spike",
      });

      expect(results).toEqual([]);
    });
  });

  describe("deleteIncidentVector", () => {
    it("returns success gracefully when Pinecone is not configured", async () => {
      process.env.PINECONE_API_KEY = "";
      const result = await deleteIncidentVector("ws_test_01", "inc_999");
      expect(result.success).toBe(true);
    });
  });
});

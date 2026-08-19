# Helicone & Pinecone Integration Architecture for SteadyStack

## Executive Summary

SteadyStack is an edge-first monitoring and incident management platform built on Cloudflare Workers, Next.js, and tRPC. As SteadyStack introduces AI-native capabilities—such as **AI Incident Summaries**, **Automated Post-Mortems**, **Root Cause Analysis (RCA)**, and **Synthetic Monitoring AI Agents**—managing LLM costs, response latencies, and long-term incident context becomes critical.

By integrating **Helicone** (LLM Observability, Proxy, Caching & Cost Tracking) and **Pinecone** (Managed Vector Database for Similarity Search & RAG), SteadyStack can deliver enterprise-grade AI intelligence while strictly controlling infrastructure costs and delivering sub-second contextual incident diagnostics.

---

## 1. System Architecture Overview

```mermaid
flowchart TD
    subgraph SteadyStack Platform
        Worker[apps/worker: Edge Monitor Engine]
        Web[apps/web: Next.js & Server Actions]
        DB[(Prisma Postgres DB)]
    end

    subgraph Vector & Context Layer (Pinecone)
        Embed[OpenAI text-embedding-3-small]
        PineconeDB[(Pinecone Vector Index)]
        RAG[Incident Memory RAG Service]
    end

    subgraph LLM Observability & Proxy Layer (Helicone)
        HeliconeProxy[Helicone Smart Gateway]
        Cache[Helicone Semantic Cache]
        CostEngine[Tenant Cost & Quota Tracker]
    end

    subgraph External LLM Providers
        OpenAI[OpenAI gpt-4o / gpt-4o-mini]
        Anthropic[Anthropic Claude 3.5 Sonnet]
    end

    Worker -->|Incident Triggered| Web
    Web -->|1. Generate Error Embedding| Embed
    Embed -->|2. Query Similar Incidents| PineconeDB
    PineconeDB -->|3. Return Historical Resolution Context| RAG
    RAG -->|4. Prompt + RAG Context| HeliconeProxy
    HeliconeProxy -->|Check Cache| Cache
    HeliconeProxy -->|Forward Managed Request| OpenAI
    HeliconeProxy -->|Fallback if Down| Anthropic
    HeliconeProxy -->|Track Tokens & Latency| CostEngine
    OpenAI -->|Return Post-Mortem & RCA| Web
    Web -->|Display to SRE & Save Vector| DB & PineconeDB
```

---

## 2. Helicone Integration Strategy

**Helicone** acts as a lightweight proxy between SteadyStack and AI model providers (OpenAI, Anthropic, OpenRouter).

### Key Features & Benefits for SteadyStack

1. **Multi-Tenant LLM Cost & Usage Tracking**
   - Track token usage, prompt execution costs, and latency down to individual workspaces (`tenantId`), monitors (`monitorId`), and user plans (Free, Pro, Enterprise).
   - Header tagging on every LLM call:
     ```typescript
     headers: {
       "Helicone-Auth": `Bearer ${env.HELICONE_API_KEY}`,
       "Helicone-Property-WorkspaceId": workspaceId,
       "Helicone-Property-PlanTier": userPlan,
       "Helicone-Property-Feature": "post-mortem-generation",
       "Helicone-User-Id": userId,
     }
     ```

2. **Semantic Caching (40–70% AI Cost Reduction)**
   - Many downtime incidents occur due to repetitive failure modes across monitors (e.g. `502 Bad Gateway`, `DNS_PROBE_FINISHED_NXDOMAIN`, SSL expiration).
   - Helicone's semantic cache returns instant cached post-mortem templates for identical incident error signatures without hitting OpenAI, saving cost and reducing response time to <50ms.

3. **Resilience, Gateway Failover & Model Routing**
   - Automatically fall back from `gpt-4o` to `claude-3-5-sonnet` or `gpt-4o-mini` if OpenAI experiences elevated latency or outages.
   - Automatically retry failed requests on rate-limit responses (`429 Too Many Requests`).

4. **Prompt Management & A/B Testing**
   - Version control system prompts for RCA generation directly in Helicone without redeploying SteadyStack code.
   - A/B test system prompts to determine which post-mortem structure receives the highest customer satisfaction score.

---

## 3. Pinecone Integration Strategy

**Pinecone** serves as SteadyStack's **Incident Memory System** and **Vector Intelligence Engine**.

### Key Use Cases for SteadyStack

1. **Incident Memory & Retrieval-Augmented Generation (RAG)**
   - When an endpoint fails, query Pinecone for past incidents with similar error payloads, stack traces, and status codes within the workspace.
   - Inject the top matching past resolutions into the LLM prompt:
     > _"Incident #402 resolved on June 12 was fixed by restarting the Redis connection pool in `us-east-1`."_

2. **Error Payload & Log Clustering**
   - Convert incoming monitor HTTP response bodies, error messages, and header logs into vector embeddings (`text-embedding-3-small`).
   - Cluster vectors in Pinecone to group related errors across microservices, giving operators a single view of cascading infrastructure outages.

3. **Semantic Monitor Search & Natural Language Queries**
   - Allow enterprise users with thousands of monitors to perform semantic search:
     - _"Show me all payment endpoints that failed with TLS/SSL errors in the past month."_
     - Pinecone computes cosine similarity between natural language queries and vectorized monitor configurations/incident histories.

4. **Self-Healing Synthetic AI Agent Checks**
   - Synthetic browser checks store DOM snapshots and target element embeddings in Pinecone.
   - If a button selector changes (e.g., `#submit-btn` becomes `.checkout-primary-button`), Pinecone retrieves nearest-neighbor DOM nodes to keep synthetic tests running without breaking alerts.

---

## 4. Proposed Codebase Implementation Plan

### Phase 1: Environment Configuration

Update `@steadystack/env` (`packages/env/src/server.ts`) with new provider keys:

```typescript
// packages/env/src/server.ts
export const server = createEnv({
  server: {
    // ... existing env vars
    HELICONE_API_KEY: z.string().optional(),
    HELICONE_BASE_PATH: z.string().default("https://oai.helicone.ai/v1"),
    PINECONE_API_KEY: z.string().optional(),
    PINECONE_INDEX_NAME: z.string().default("steadystack-incidents"),
  },
  // ...
});
```

### Phase 2: Unified Helicone + OpenAI SDK Wrapper

Create `apps/web/src/lib/ai/helicone-client.ts`:

```typescript
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@steadystack/env/server";

export function getHeliconeOpenAI(metadata: {
  workspaceId: string;
  userId: string;
  feature: string;
  planTier?: string;
}) {
  const headers: Record<string, string> = {
    "Helicone-Auth": `Bearer ${env.HELICONE_API_KEY}`,
    "Helicone-Property-WorkspaceId": metadata.workspaceId,
    "Helicone-Property-Feature": metadata.feature,
    "Helicone-User-Id": metadata.userId,
    "Helicone-Cache-Enabled": "true", // Enable 7-day semantic caching
  };

  if (metadata.planTier) {
    headers["Helicone-Property-PlanTier"] = metadata.planTier;
  }

  return createOpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.HELICONE_BASE_PATH,
    headers,
  });
}
```

### Phase 3: Pinecone Incident Vector Store Service

Create `apps/web/src/lib/ai/pinecone-client.ts`:

```typescript
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { env } from "@steadystack/env/server";

const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY!,
});

export const incidentIndex = pinecone.Index(env.PINECONE_INDEX_NAME);

/**
 * Upsert an incident resolution into Pinecone for future RAG context
 */
export async function indexIncidentResolution(params: {
  workspaceId: string;
  incidentId: string;
  title: string;
  errorMessage: string;
  rootCause: string;
  resolution: string;
}) {
  const textToEmbed = `Incident: ${params.title}\nError: ${params.errorMessage}\nRoot Cause: ${params.rootCause}\nResolution: ${params.resolution}`;

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: textToEmbed,
  });

  // Store vector under workspace namespace for multi-tenant data isolation
  const namespace = incidentIndex.namespace(`workspace_${params.workspaceId}`);

  await namespace.upsert([
    {
      id: params.incidentId,
      values: embedding,
      metadata: {
        title: params.title,
        rootCause: params.rootCause,
        resolution: params.resolution,
        createdAt: new Date().toISOString(),
      },
    },
  ]);
}

/**
 * Query Pinecone for similar past incidents to provide RAG context
 */
export async function querySimilarIncidents(params: {
  workspaceId: string;
  errorMessage: string;
  topK?: number;
}) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: params.errorMessage,
  });

  const namespace = incidentIndex.namespace(`workspace_${params.workspaceId}`);

  const queryResponse = await namespace.query({
    vector: embedding,
    topK: params.topK ?? 3,
    includeMetadata: true,
  });

  return queryResponse.matches.map((match) => ({
    incidentId: match.id,
    score: match.score,
    metadata: match.metadata as {
      title: string;
      rootCause: string;
      resolution: string;
      createdAt: string;
    },
  }));
}
```

### Phase 4: Enhanced AI Post-Mortem Generator with RAG & Helicone

Updating `apps/web/src/actions/post-mortem.ts`:

```typescript
import { generateText } from "ai";
import { getHeliconeOpenAI } from "@/lib/ai/helicone-client";
import { querySimilarIncidents } from "@/lib/ai/pinecone-client";

export async function generateEnhancedPostMortem(
  incidentId: string,
  workspaceId: string,
) {
  // 1. Fetch incident details & failure log
  const incident = await getIncidentDetails(incidentId);

  // 2. Fetch similar historical incidents from Pinecone (RAG)
  const similarIncidents = await querySimilarIncidents({
    workspaceId,
    errorMessage: incident.lastErrorMessage,
    topK: 3,
  });

  const ragContext = similarIncidents
    .map(
      (inc) =>
        `- Similar Incident: "${inc.metadata.title}" | Root Cause: ${inc.metadata.rootCause} | Resolution: ${inc.metadata.resolution}`,
    )
    .join("\n");

  // 3. Obtain Helicone-monitored OpenAI instance
  const heliconeOpenAI = getHeliconeOpenAI({
    workspaceId,
    userId: incident.userId,
    feature: "enhanced-post-mortem",
    planTier: incident.userPlanTier,
  });

  // 4. Generate Post-Mortem with AI SDK
  const prompt = `
You are an expert SRE. Generate an executive post-mortem for the following incident.

Incident Title: ${incident.title}
Monitor URL: ${incident.monitorUrl}
Error Payload: ${incident.lastErrorMessage}

Historical Context from past similar incidents:
${ragContext || "No previous similar incidents found."}

Provide a structured Markdown post-mortem with Summary, Root Cause Analysis, Impact Scope, and Suggested Preventive Actions.
  `.trim();

  const { text } = await generateText({
    model: heliconeOpenAI("gpt-4o"),
    prompt,
  });

  return text;
}
```

---

## 5. Monetization & Pricing Tier Matrix

Integrate Helicone usage stats & Pinecone RAG features directly into SteadyStack's subscription plans:

| Feature / Capability                 | Starter / Free          | Pro ($29/mo)            | Enterprise ($99+/mo)                   |
| :----------------------------------- | :---------------------- | :---------------------- | :------------------------------------- |
| **AI Incident Summaries**            | Basic (Helicone Cached) | Unlimited               | Priority GPT-4o Model                  |
| **Incident Memory RAG (Pinecone)**   | ❌ Disabled             | 90-Day Vector Retention | Unlimited Retention & Custom Namespace |
| **Log Clustering & Semantic Search** | ❌ Disabled             | Up to 10k vectors       | Unlimited Log Vectors                  |
| **Helicone LLM Cost Analytics**      | ❌ Disabled             | Workspace Aggregates    | Full Usage Breakdown & Export          |
| **Custom AI Prompt Tuning**          | Standard Defaults       | Standard Defaults       | Custom System Prompts                  |

---

## 6. Security, Compliance & Multi-Tenancy

1. **Namespace Isolation in Pinecone**:
   - Each SteadyStack workspace gets a dedicated namespace in Pinecone (`workspace_${workspaceId}`).
   - Cross-workspace vector data leaks are strictly prevented at the query API level.

2. **Data Privacy & Helicone PII Scrubbing**:
   - Enable Helicone's built-in PII Masking headers (`Helicone-Mask-PII: true`) to redact sensitive IP addresses, passwords, or Authorization headers from being logged in LLM request history.

3. **Zero Zero-Day Data Retention for Enterprise**:
   - Utilize Helicone's Zero Data Retention policy for Enterprise accounts requiring strict SOC2 / HIPAA compliance.

---

## 7. Next Steps & Implementation Roadmap

- [ ] **Milestone 1**: Register Helicone and Pinecone accounts & obtain dev API keys.
- [ ] **Milestone 2**: Add `HELICONE_API_KEY` and `PINECONE_API_KEY` to root `.env` and `packages/env`.
- [ ] **Milestone 3**: Implement `getHeliconeOpenAI` wrapper in `apps/web/src/lib/ai/helicone-client.ts`.
- [ ] **Milestone 4**: Create `pinecone-client.ts` helper and index first batch of historical post-mortems.
- [ ] **Milestone 5**: Connect post-mortem server action to Helicone and Pinecone RAG.
- [ ] **Milestone 6**: Expose LLM Usage / Token metrics on the SteadyStack Organization Billing page via Helicone APIs.

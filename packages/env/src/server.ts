import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    CORS_ORIGIN: z.string().url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SLACK_SIGNING_SECRET: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    // OpenRouter AI Configuration
    OPENROUTER_API_KEY: z.string().min(1).optional(),
    OPENROUTER_MODEL: z.string().default("meta-llama/llama-3.3-70b-instruct"),
    OPENROUTER_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
    // Helicone LLM Observability & Smart Proxy
    HELICONE_API_KEY: z.string().min(1).optional(),
    HELICONE_BASE_PATH: z.string().url().default("https://oai.helicone.ai/v1"),
    HELICONE_CACHE_ENABLED: z.enum(["true", "false"]).default("true"),
    // Pinecone Vector Database Configuration
    PINECONE_API_KEY: z.string().min(1).optional(),
    PINECONE_INDEX_NAME: z.string().default("steadystack-incidents"),
    // Ollama Local AI Configuration (for testing)
    OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434/v1"),
    OLLAMA_MODEL: z.string().default("llama3.2"),
    // Provider selection: "openrouter" | "ollama" | "openai" | "auto"
    AI_PROVIDER: z.enum(["openrouter", "ollama", "openai", "auto"]).default("auto"),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    RESEND_API_KEY: z.string().min(1).optional(),
    VERCEL_CLIENT_ID: z.string().min(1).optional(),
    VERCEL_CLIENT_SECRET: z.string().min(1).optional(),
    VERCEL_REDIRECT_URI: z.string().min(1).optional(),
    // Vercel domain management API
    VERCEL_API_TOKEN: z.string().min(1).optional(),
    VERCEL_PROJECT_ID: z.string().min(1).optional(),
    VERCEL_TEAM_ID: z.string().min(1).optional(),
    // Server-side worker URL (used by web actions to proxy check-now requests)
    STEADYSTACK_WORKER_URL: z.string().url().default("http://localhost:8787"),
    // Analytics hashing salt
    ANALYTICS_SALT: z.string().min(1).default("steadystack-analytics-salt"),
    // Discord OAuth integration
    DISCORD_CLIENT_ID: z.string().min(1).optional(),
    DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
    DISCORD_REDIRECT_URI: z.string().min(1).optional(),
    // Slack OAuth integration
    SLACK_REDIRECT_URI: z.string().min(1).optional(),
    // Admin access control
    ADMIN_EMAILS: z.string().optional(),
    // Dev origins
    ALLOWED_DEV_ORIGINS: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "build",
  onValidationError: (issues) => {
    const formatted = (issues || [])
      .map((issue) => `  - ${issue.path ? issue.path.join(".") : "variable"}: ${issue.message}`)
      .join("\n");
    console.error("❌ Invalid environment variables:\n" + formatted);
    throw new Error("Invalid environment variables:\n" + formatted);
  },
});

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    SLACK_SIGNING_SECRET: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    RESEND_API_KEY: z.string().min(1).optional(),
    VERCEL_CLIENT_ID: z.string().min(1).optional(),
    VERCEL_CLIENT_SECRET: z.string().min(1).optional(),
    VERCEL_REDIRECT_URI: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "build",
});

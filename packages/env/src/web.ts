import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    // Client-side worker URL for browser → worker WebSocket/fetch
    NEXT_PUBLIC_WORKER_URL: z.string().url().default("http://localhost:8787"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WORKER_URL: process.env.NEXT_PUBLIC_WORKER_URL,
  },
  emptyStringAsUndefined: true,
  onValidationError: (issues) => {
    const formatted = (issues || [])
      .map(
        (issue) =>
          `  - ${issue.path ? issue.path.join(".") : "variable"}: ${issue.message}`,
      )
      .join("\n");
    console.error("❌ Invalid client environment variables:\n" + formatted);
    throw new Error("Invalid client environment variables:\n" + formatted);
  },
});

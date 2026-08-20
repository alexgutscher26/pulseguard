import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SERVER_URL: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onValidationError: (issues) => {
    const formatted = (issues || [])
      .map((issue) => `  - ${issue.path ? issue.path.join(".") : "variable"}: ${issue.message}`)
      .join("\n");
    console.error("❌ Invalid native environment variables:\n" + formatted);
    throw new Error("Invalid native environment variables:\n" + formatted);
  },
});

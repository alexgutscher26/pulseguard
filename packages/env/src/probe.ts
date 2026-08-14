import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PROBE_",
  client: {},
  server: {
    PULSEGUARD_API_URL: z.string().url().default("https://pulseguard-worker.example.com"),
    PULSEGUARD_PROBE_TOKEN: z.string().min(1),
    PROBE_POLL_INTERVAL: z.coerce.number().int().positive().default(15),
    PROBE_HEARTBEAT_INTERVAL: z.coerce.number().int().positive().default(30),
    PROBE_REGION: z.string().default("private"),
    PROBE_CONCURRENCY: z.coerce.number().int().positive().default(5),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

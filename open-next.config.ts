// Root-level fallback open-next.config.ts
// If opennextjs-cloudflare CLI runs from repo root (e.g. during Turbo), it needs
// a valid config here to avoid auto-generating the default template.
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig();

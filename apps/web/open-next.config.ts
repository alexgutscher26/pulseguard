import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  default: {
    override: {
      wrapper: "cloudflare-node",
    },
  },
  build: {
    externals: ["pg-cloudflare"],
  },
});
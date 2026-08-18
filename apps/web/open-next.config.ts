// Root-level open-next.config.ts
// opennextjs/cloudflare CLI resolves open-next.config.ts from process.cwd().
// On Vercel with a Turborepo, cwd is the repo root — not apps/web.
// This file ensures the CLI finds a valid config instead of auto-generating the default template.
const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
};

export default config;

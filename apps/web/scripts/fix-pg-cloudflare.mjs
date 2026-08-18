/**
 * Ensures pg-cloudflare/dist files exist before the OpenNext esbuild bundler runs.
 *
 * Bun's content-addressable cache on Vercel sometimes omits pre-built dist/ files
 * from the pg-cloudflare package. esbuild statically resolves require('pg-cloudflare')
 * in pg/lib/stream.js and fails if dist/index.js is missing.
 *
 * This script creates empty stubs so esbuild can resolve the import. At runtime,
 * pg detects the Cloudflare Workers environment and uses the ESM entry point instead.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

try {
  const pkgPath = require.resolve("pg-cloudflare/package.json");
  const pkgDir = dirname(pkgPath);
  const distDir = join(pkgDir, "dist");

  mkdirSync(distDir, { recursive: true });

  if (!existsSync(join(distDir, "index.js"))) {
    writeFileSync(join(distDir, "index.js"), "module.exports = {};");
    console.log("Created pg-cloudflare/dist/index.js stub");
  }

  if (!existsSync(join(distDir, "empty.js"))) {
    writeFileSync(join(distDir, "empty.js"), "module.exports = {};");
    console.log("Created pg-cloudflare/dist/empty.js stub");
  }
} catch {
  // pg-cloudflare not installed — nothing to patch
}

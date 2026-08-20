import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dir, "..");

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  ".output",
  "coverage",
  ".agent",
]);

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".md",
  ".yml",
  ".yaml",
  ".toml",
  ".html",
  ".css",
  ".prisma",
  ".go",
  ".rs",
  ".sh",
  ".ps1",
  ".sql",
  ".dockerfile",
  ".env",
  ".example",
  ".svg",
  ".tpl",
  ".mod",
  ".tf",
  ".txt",
  ".mdx",
]);

const EXACT_FILES = new Set([
  "Dockerfile",
  "Makefile",
  ".env.example",
  "wrangler.jsonc",
  ".gitattributes",
]);

const REPLACEMENTS: Array<[RegExp, string]> = [
  // URLs & Git repos
  [
    /https:\/\/github\.com\/alexgutscher26\/pulseguard/g,
    "https://github.com/getsteadystack/SteadyStack",
  ],
  [/github\.com\/alexgutscher26\/pulseguard/g, "github.com/getsteadystack/SteadyStack"],
  [/alexgutscher26\/pulseguard/g, "getsteadystack/SteadyStack"],
  [/https:\/\/pulseguard\.io/g, "https://steadystack.dev"],
  [/https:\/\/pulseguard\.com/g, "https://steadystack.dev"],
  [/pulseguard\.io/g, "steadystack.dev"],
  [/pulseguard\.com/g, "steadystack.dev"],

  // Scoped packages
  [/@pulseguard\//g, "@steadystack/"],

  // CamelCase and exact variables
  [/isPulseguard/g, "isSteadyStack"],
  [/isPulseGuard/g, "isSteadyStack"],

  // Exact Case variations
  [/PulseGuard/g, "SteadyStack"],
  [/pulseguard/g, "steadystack"],
  [/PULSEGUARD/g, "STEADYSTACK"],
  [/pulse_guard/g, "steady_stack"],
  [/Pulse Guard/g, "Steady Stack"],
];

function shouldProcessFile(filePath: string): boolean {
  const baseName = path.basename(filePath);
  if (EXACT_FILES.has(baseName)) return true;
  if (baseName.startsWith(".env.")) return true;
  const ext = path.extname(filePath);
  return EXTENSIONS.has(ext);
}

let modifiedCount = 0;
let fileCount = 0;

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walkDir(path.join(dir, entry.name));
    } else if (entry.isFile()) {
      const fullPath = path.join(dir, entry.name);
      if (!shouldProcessFile(fullPath)) continue;

      // Skip the script itself
      if (fullPath.endsWith("rebrand-to-steadystack.ts")) continue;

      fileCount++;
      const content = fs.readFileSync(fullPath, "utf-8");
      let updated = content;

      for (const [regex, replacement] of REPLACEMENTS) {
        updated = updated.replace(regex, replacement);
      }

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, "utf-8");
        console.log(`Updated: ${path.relative(ROOT_DIR, fullPath)}`);
        modifiedCount++;
      }
    }
  }
}

console.log(`Starting rebranding across: ${ROOT_DIR}`);
walkDir(ROOT_DIR);
console.log(`Finished! Checked ${fileCount} files, updated ${modifiedCount} files.`);

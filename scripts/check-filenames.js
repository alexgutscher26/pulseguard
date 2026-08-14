import fs from "fs";
import path from "path";

// Enforces kebab-case file naming across source trees. Run from the repo root.
//   bun run check-names
const ROOT = process.cwd();
const SCAN_DIRS = ["apps", "packages"];
const SOURCE_DIRS = new Set(["src", "app"]);
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".expo",
  ".open-next",
  ".turbo",
  ".wrangler",
  ".git",
  "dist",
  "generated",
]);
const HAS_UPPERCASE = /[A-Z]/;

function walk(dir, violations) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "src" || entry.name === "app") {
        walkSource(full, violations);
      } else {
        walk(full, violations);
      }
    }
  }
}

function walkSource(dir, violations) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSource(full, violations);
    } else if (HAS_UPPERCASE.test(entry.name)) {
      violations.push(path.relative(ROOT, full));
    }
  }
}

const violations = [];
for (const dir of SCAN_DIRS) {
  const abs = path.join(ROOT, dir);
  if (fs.existsSync(abs)) walk(abs, violations);
}

if (violations.length > 0) {
  console.error(
    "File naming violations (use kebab-case, e.g. `heatmap-grid.tsx`):",
  );
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log("All source files follow kebab-case naming.");

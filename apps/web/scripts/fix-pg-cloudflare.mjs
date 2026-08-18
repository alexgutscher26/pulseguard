// apps/web/scripts/fix-pg-cloudflare.mjs
import fs from "node:fs";
import path from "node:path";

function findNodeModules(startDir) {
  let current = startDir;

  while (true) {
    const candidate = path.join(current, "node_modules");

    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      throw new Error("Could not locate a node_modules directory.");
    }

    current = parent;
  }
}

function walk(directory) {
  const found = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.name === "pg-cloudflare") {
      found.push(fullPath);
      continue;
    }

    // Bun stores package contents under node_modules/.bun.
    // Avoid scanning irrelevant large package trees.
    if (
      entry.name === ".bun" ||
      entry.name.startsWith("pg-cloudflare@") ||
      entry.name.startsWith("pg@")
    ) {
      found.push(...walk(fullPath));
    }
  }

  return found;
}

const nodeModules = findNodeModules(process.cwd());
const packages = walk(nodeModules);

if (packages.length === 0) {
  throw new Error(
    `No pg-cloudflare package found under workspace dependencies: ${nodeModules}`
  );
}

for (const packageDirectory of packages) {
  const distDirectory = path.join(packageDirectory, "dist");
  const target = path.join(distDirectory, "index.js");

  if (fs.existsSync(target)) {
    console.log(`pg-cloudflare already has index.js: ${target}`);
    continue;
  }

  const cjsSource = path.join(distDirectory, "index.cjs");

  if (!fs.existsSync(cjsSource)) {
    const files = fs.existsSync(distDirectory)
      ? fs.readdirSync(distDirectory).join(", ")
      : "(no dist directory)";

    throw new Error(
      `Cannot patch ${packageDirectory}: expected dist/index.cjs; found ${files}`
    );
  }

  fs.writeFileSync(
    target,
    'module.exports = require("./index.cjs");\n',
    "utf8"
  );

  console.log(`Created ${target}`);
}
// apps/web/scripts/fix-pg-cloudflare.mjs
import fs from "node:fs";
import path from "node:path";

function findWorkspaceNodeModules(startDir) {
  let current = startDir;
  let outermostNodeModules = null;

  while (true) {
    const candidate = path.join(current, "node_modules");

    if (fs.existsSync(candidate)) {
      outermostNodeModules = candidate;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  if (!outermostNodeModules) {
    throw new Error("Could not locate workspace node_modules.");
  }

  return outermostNodeModules;
}

function findPgCloudflareDirectories(directory) {
  const matches = [];

  function visit(current) {
    let entries;

    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(current, entry.name);

      if (entry.name === "pg-cloudflare") {
        matches.push(fullPath);
        continue;
      }

      visit(fullPath);
    }
  }

  visit(directory);
  return matches;
}

const rootNodeModules = findWorkspaceNodeModules(process.cwd());
console.log(`Searching for pg-cloudflare in: ${rootNodeModules}`);

const packageDirectories = findPgCloudflareDirectories(rootNodeModules);

if (packageDirectories.length === 0) {
  throw new Error(`No pg-cloudflare package found under: ${rootNodeModules}`);
}

for (const packageDirectory of packageDirectories) {
  const distDirectory = path.join(packageDirectory, "dist");
  const target = path.join(distDirectory, "index.js");

  if (fs.existsSync(target)) {
    console.log(`Already present: ${target}`);
    continue;
  }

  const cjsEntry = path.join(distDirectory, "index.cjs");

  if (!fs.existsSync(cjsEntry)) {
    const contents = fs.existsSync(distDirectory)
      ? fs.readdirSync(distDirectory).join(", ")
      : "(missing dist directory)";

    throw new Error(
      `Cannot patch ${packageDirectory}. Expected dist/index.cjs; found: ${contents}`,
    );
  }

  fs.writeFileSync(
    target,
    'module.exports = require("./index.cjs");\n',
    "utf8",
  );

  console.log(`Created missing pg-cloudflare entrypoint: ${target}`);
}

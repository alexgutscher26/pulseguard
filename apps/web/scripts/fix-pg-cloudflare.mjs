import fs from "node:fs";
import path from "node:path";

const nodeModules = path.resolve(process.cwd(), "node_modules");

function walk(directory) {
  const found = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "pg-cloudflare") {
        found.push(fullPath);
      } else {
        found.push(...walk(fullPath));
      }
    }
  }

  return found;
}

const packages = walk(nodeModules);

if (packages.length === 0) {
  throw new Error("No pg-cloudflare package was found in node_modules.");
}

for (const packageDirectory of packages) {
  const distDirectory = path.join(packageDirectory, "dist");
  const commonJsEntry = path.join(distDirectory, "index.js");

  if (fs.existsSync(commonJsEntry)) {
    console.log(`pg-cloudflare already fixed: ${commonJsEntry}`);
    continue;
  }

  fs.mkdirSync(distDirectory, { recursive: true });

  const available = fs.existsSync(distDirectory)
    ? fs.readdirSync(distDirectory)
    : [];

  const esmEntry = ["index.mjs", "index.js"].find((file) =>
    available.includes(file)
  );

  if (!esmEntry) {
    throw new Error(
      `Cannot patch ${packageDirectory}: expected a dist entrypoint, found: ${available.join(", ")}`
    );
  }

  fs.writeFileSync(
    commonJsEntry,
    `module.exports = require("./${esmEntry}");\n`,
    "utf8"
  );

  console.log(`Created missing entrypoint: ${commonJsEntry}`);
}
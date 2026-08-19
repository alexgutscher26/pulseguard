import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import prisma from "../packages/db/src/index";
import type { MonitorType } from "../packages/db/src/generated/client";

interface ParsedMonitor {
  name: string;
  url: string;
  type: MonitorType;
  interval: number;
  timeout: number;
  method: string;
  headers?: string | null;
  body?: string | null;
  expectation?: string | null;
  alertThreshold: number;
  tags: string[];
}

function parseUptimeKumaJSON(rawContent: string): ParsedMonitor[] {
  const data = JSON.parse(rawContent);
  const rawList: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data.monitorList)
      ? data.monitorList
      : Array.isArray(data.monitors)
        ? data.monitors
        : [];

  if (rawList.length === 0) {
    throw new Error("No monitors found in the export JSON file.");
  }

  return rawList.map((m: any): ParsedMonitor => {
    const rawType = (m.type || "http").toLowerCase();
    let type: MonitorType = "HTTP";
    let url = m.url || "";
    const method = (m.method || "GET").toUpperCase();
    const interval = Math.max(30, Number(m.interval) || 60);
    const timeout = Math.min(60, Math.max(2, Number(m.timeout) || 10));
    const alertThreshold = Math.max(1, Number(m.maxretries) || 1);

    switch (rawType) {
      case "http":
      case "keyword":
      case "json-query":
        type = "HTTP";
        break;
      case "port":
        type = "PORT";
        if (!url && m.hostname) {
          url = m.port ? `${m.hostname}:${m.port}` : m.hostname;
        }
        break;
      case "ping":
        type = "PING";
        if (!url && m.hostname) {
          url = m.hostname;
        }
        break;
      case "dns":
        type = "DNS";
        if (!url && m.hostname) {
          url = m.hostname;
        }
        break;
      case "push":
        type = "HEARTBEAT";
        if (!url) {
          url = `heartbeat://${m.name ? encodeURIComponent(m.name.toLowerCase().replace(/\s+/g, "-")) : "push-target"}`;
        }
        break;
      case "real-browser":
      case "chrome":
        type = "BROWSER";
        break;
      case "steam":
      case "gamedig":
      case "mqtt":
      case "docker":
        type = "PORT";
        if (!url && m.hostname) {
          url = m.port ? `${m.hostname}:${m.port}` : m.hostname;
        }
        break;
      case "postgres":
      case "mysql":
      case "redis":
      case "mongodb":
      case "sqlserver":
        type = "DATABASE";
        url =
          m.databaseConnectionString ||
          url ||
          (m.hostname ? `${m.hostname}:${m.port || 5432}` : "");
        break;
      default:
        type = "HTTP";
        break;
    }

    let customHeaders: string | null = null;
    if (m.headers) {
      if (typeof m.headers === "string") {
        try {
          JSON.parse(m.headers);
          customHeaders = m.headers;
        } catch {
          customHeaders = null;
        }
      } else if (typeof m.headers === "object") {
        customHeaders = JSON.stringify(m.headers);
      }
    }

    const expectationObj: Record<string, unknown> = {};
    if (m.keyword) {
      expectationObj.keyword = m.keyword;
    }
    if (m.accepted_statuscodes && Array.isArray(m.accepted_statuscodes)) {
      expectationObj.statusCode = m.accepted_statuscodes;
    }

    const tags: string[] = ["imported", "uptime-kuma"];
    if (Array.isArray(m.tags)) {
      for (const t of m.tags) {
        if (typeof t === "string" && t.trim()) {
          tags.push(t.trim());
        } else if (t && typeof t.name === "string" && t.name.trim()) {
          tags.push(t.name.trim());
        }
      }
    }

    return {
      name: m.name || url || "Imported Monitor",
      url: url || "https://example.com",
      type,
      interval,
      timeout,
      method,
      headers: customHeaders,
      body: m.body || null,
      expectation: Object.keys(expectationObj).length > 0 ? JSON.stringify(expectationObj) : null,
      alertThreshold,
      tags: Array.from(new Set(tags)),
    };
  });
}

async function main() {
  const args = process.argv.slice(2);
  const help = args.includes("--help") || args.includes("-h");

  if (help || args.length === 0) {
    console.log(`
SteadyStack Uptime Kuma Importer CLI

Usage:
  bun scripts/import-uptime-kuma.ts <path-to-kuma-backup.json> [options]

Options:
  --user, --email <email>   Target user email in database (defaults to first found user)
  --dry-run                 Preview parsed monitors without inserting into database
  --overwrite               Update existing monitors with the same name
  --help, -h                Show this help message
`);
    process.exit(0);
  }

  const filePath = args.find((a) => !a.startsWith("-"));
  if (!filePath) {
    console.error("❌ Error: Path to Uptime Kuma backup JSON is required.");
    process.exit(1);
  }

  const resolvedPath = resolve(process.cwd(), filePath);
  if (!existsSync(resolvedPath)) {
    console.error(`❌ Error: File not found at ${resolvedPath}`);
    process.exit(1);
  }

  const dryRun = args.includes("--dry-run");
  const overwrite = args.includes("--overwrite");
  const emailIdx = args.findIndex((a) => a === "--user" || a === "--email");
  const userEmail = emailIdx !== -1 ? args[emailIdx + 1] : undefined;

  console.log(`\n📦 Reading Uptime Kuma backup from: ${resolvedPath}`);
  const rawContent = readFileSync(resolvedPath, "utf-8");

  let parsed: ParsedMonitor[];
  try {
    parsed = parseUptimeKumaJSON(rawContent);
  } catch (err: any) {
    console.error(`❌ Parser error: ${err.message}`);
    process.exit(1);
  }

  console.log(`✔ Successfully parsed ${parsed.length} monitor(s) from export.`);

  if (dryRun) {
    console.log("\n--- DRY RUN PREVIEW ---");
    for (const [i, m] of parsed.entries()) {
      console.log(
        `[${i + 1}/${parsed.length}] ${m.name} | Type: ${m.type} | Target: ${m.url} | Interval: ${m.interval}s`,
      );
    }
    console.log("\nDry run finished. No database changes were made.");
    process.exit(0);
  }

  // Find target user
  let targetUser = userEmail
    ? await prisma.user.findUnique({ where: { email: userEmail } })
    : await prisma.user.findFirst();

  if (!targetUser) {
    console.log(
      "No user found in database. Creating default admin user (admin@steadystack.dev)...",
    );
    targetUser = await prisma.user.create({
      data: {
        id: "admin-import-user",
        name: "Admin User",
        email: userEmail || "admin@steadystack.dev",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log(`👤 Target User: ${targetUser.email} (${targetUser.id})\n`);

  const existingMonitors = await prisma.monitor.findMany({
    where: { userId: targetUser.id },
    select: { id: true, name: true },
  });
  const existingMap = new Map(existingMonitors.map((m) => [m.name.toLowerCase().trim(), m.id]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const m of parsed) {
    const existingId = existingMap.get(m.name.toLowerCase().trim());
    if (existingId) {
      if (overwrite) {
        await prisma.monitor.update({
          where: { id: existingId },
          data: {
            url: m.url,
            type: m.type,
            interval: m.interval,
            timeout: m.timeout,
            method: m.method,
            headers: m.headers,
            body: m.body,
            expectation: m.expectation,
            alertThreshold: m.alertThreshold,
            tags: m.tags,
          },
        });
        console.log(`  [~] Updated: ${m.name}`);
        updated++;
      } else {
        console.log(`  [-] Skipped (already exists): ${m.name}`);
        skipped++;
      }
    } else {
      await prisma.monitor.create({
        data: {
          userId: targetUser.id,
          name: m.name,
          url: m.url,
          type: m.type,
          interval: m.interval,
          timeout: m.timeout,
          method: m.method,
          headers: m.headers,
          body: m.body,
          expectation: m.expectation,
          alertThreshold: m.alertThreshold,
          tags: m.tags,
          alertRules: {
            create: [
              {
                trigger: "STATUS_CHANGE",
                targetStatus: "DOWN",
                enabled: true,
              },
            ],
          },
        },
      });
      console.log(`  [+] Created: ${m.name}`);
      created++;
    }
  }

  console.log(`\n🎉 Import Complete!`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`All checks are now live on SteadyStack's edge consensus network.\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});

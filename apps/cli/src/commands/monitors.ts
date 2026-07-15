import { Command } from "commander";
import chalk from "chalk";
import { table } from "table";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { readFileSync, writeFileSync, existsSync } from "fs";
import ora from "ora";
import { api, ApiError } from "../client.js";

interface Monitor {
  id: string;
  name: string;
  url: string;
  type: string;
  status: string;
  interval: number;
  timeout: number;
  lastCheck: string | null;
}

const STATUS_COLOR: Record<string, (s: string) => string> = {
  UP: chalk.green,
  DOWN: chalk.red,
  PAUSED: chalk.yellow,
  MAINTENANCE: chalk.blue,
};

function colorStatus(status: string) {
  return (STATUS_COLOR[status] ?? chalk.dim)(status);
}

export const monitorsCmd = new Command("monitors").description("Manage monitors");

// pulse monitors list
monitorsCmd
  .command("list")
  .alias("ls")
  .description("List all monitors")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    const spinner = ora("Fetching monitors…").start();
    try {
      const { monitors } = await api.get<{ monitors: Monitor[] }>("/api/cli/monitors");
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(monitors, null, 2));
        return;
      }

      if (monitors.length === 0) {
        console.log(
          chalk.dim("No monitors found. Create one with: pulse monitors apply -f pulseguard.yaml"),
        );
        return;
      }

      const rows = [
        [
          chalk.bold("STATUS"),
          chalk.bold("NAME"),
          chalk.bold("TYPE"),
          chalk.bold("URL"),
          chalk.bold("INTERVAL"),
          chalk.bold("LAST CHECK"),
        ],
        ...monitors.map((m) => [
          colorStatus(m.status),
          m.name,
          chalk.cyan(m.type),
          chalk.dim(m.url.slice(0, 40) + (m.url.length > 40 ? "…" : "")),
          `${m.interval}s`,
          m.lastCheck ? new Date(m.lastCheck).toLocaleTimeString() : chalk.dim("never"),
        ]),
      ];

      console.log(
        table(rows, {
          border: {
            topBody: "─",
            topJoin: "┬",
            topLeft: "┌",
            topRight: "┐",
            bottomBody: "─",
            bottomJoin: "┴",
            bottomLeft: "└",
            bottomRight: "┘",
            bodyLeft: "│",
            bodyRight: "│",
            bodyJoin: "│",
            joinBody: "─",
            joinLeft: "├",
            joinRight: "┤",
            joinJoin: "┼",
          },
          drawHorizontalLine: (i) => i === 0 || i === 1 || i === rows.length,
        }),
      );
      console.log(
        chalk.dim(`  ${monitors.length} monitor${monitors.length !== 1 ? "s" : ""} total`),
      );
    } catch (err) {
      spinner.fail("Failed to fetch monitors");
      if (err instanceof ApiError) console.error(chalk.red(err.message));
    }
  });

// pulse monitors get <id>
monitorsCmd
  .command("get <id>")
  .description("Get details of a single monitor")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    const spinner = ora("Fetching monitor…").start();
    try {
      const { monitor } = await api.get<{ monitor: any }>(`/api/cli/monitors/${id}`);
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(monitor, null, 2));
        return;
      }

      console.log(`\n${chalk.bold(monitor.name)} ${colorStatus(monitor.status)}`);
      console.log(chalk.dim(`  ID       : ${monitor.id}`));
      console.log(chalk.dim(`  URL      : ${monitor.url}`));
      console.log(chalk.dim(`  Type     : ${monitor.type}`));
      console.log(chalk.dim(`  Interval : ${monitor.interval}s  Timeout: ${monitor.timeout}s`));
      console.log(
        chalk.dim(
          `  Last check: ${monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleString() : "never"}`,
        ),
      );

      if (monitor.events?.length) {
        console.log(`\n${chalk.bold("Recent events:")}`);
        for (const e of monitor.events) {
          const ts = new Date(e.timestamp).toLocaleTimeString();
          const status = colorStatus(e.status);
          const latency = e.latency ? chalk.dim(`${e.latency}ms`) : "";
          const err = e.errorReason ? chalk.red(` [${e.errorReason}]`) : "";
          console.log(`  ${chalk.dim(ts)}  ${status}  ${latency}${err}`);
        }
      }
    } catch (err) {
      spinner.fail("Failed to fetch monitor");
      if (err instanceof ApiError) console.error(chalk.red(err.message));
    }
  });

// pulse monitors apply -f pulseguard.yaml
monitorsCmd
  .command("apply")
  .description("Create or update monitors from a pulseguard.yaml file (Monitoring as Code)")
  .requiredOption("-f, --file <path>", "Path to pulseguard.yaml")
  .option("--dry-run", "Preview changes without applying")
  .action(async (opts) => {
    const filePath = opts.file as string;
    if (!existsSync(filePath)) {
      console.error(chalk.red(`✖ File not found: ${filePath}`));
      process.exit(1);
    }

    let config: { monitors: any[] };
    try {
      config = parseYaml(readFileSync(filePath, "utf-8")) as { monitors: any[] };
    } catch {
      console.error(chalk.red("✖ Invalid YAML file"));
      process.exit(1);
    }

    if (!Array.isArray(config?.monitors)) {
      console.error(chalk.red("✖ YAML must have a top-level 'monitors' array"));
      process.exit(1);
    }

    if (opts.dryRun) {
      console.log(chalk.yellow("DRY RUN — no changes will be made\n"));
    }

    // Fetch existing monitors for idempotency
    const { monitors: existing } = await api.get<{ monitors: Monitor[] }>("/api/cli/monitors");
    const existingByName = new Map(existing.map((m) => [m.name.toLowerCase(), m]));

    let created = 0,
      updated = 0;
    for (const def of config.monitors) {
      const name = def.name;
      const existing = existingByName.get(name?.toLowerCase());
      const action = existing ? "update" : "create";

      if (opts.dryRun) {
        console.log(`  ${action === "create" ? chalk.green("[+]") : chalk.yellow("[~]")} ${name}`);
        continue;
      }

      const spinner = ora(`${action === "create" ? "Creating" : "Updating"} ${name}…`).start();
      try {
        if (existing) {
          await api.put(`/api/cli/monitors/${existing.id}`, def);
          spinner.succeed(chalk.yellow(`[~] Updated: ${name}`));
          updated++;
        } else {
          await api.post("/api/cli/monitors", def);
          spinner.succeed(chalk.green(`[+] Created: ${name}`));
          created++;
        }
      } catch (err) {
        spinner.fail(`Failed: ${name}`);
        if (err instanceof ApiError) console.error(chalk.dim(`    ${err.message}`));
      }
    }

    if (!opts.dryRun) {
      console.log(`\n${chalk.green("✔ Applied:")} ${created} created, ${updated} updated`);
    }
  });

// pulse monitors import (export all monitors to pulseguard.yaml)
monitorsCmd
  .command("import")
  .description("Export all monitors to pulseguard.yaml (Monitoring as Code snapshot)")
  .option("-o, --output <path>", "Output file path", "pulseguard.yaml")
  .action(async (opts) => {
    const spinner = ora("Fetching monitors…").start();
    try {
      const { monitors } = await api.get<{ monitors: any[] }>("/api/cli/monitors");
      spinner.stop();

      const yamlContent = stringifyYaml({
        monitors: monitors.map((m) => ({
          name: m.name,
          url: m.url,
          type: m.type,
          interval: m.interval,
          timeout: m.timeout,
          method: m.method || "GET",
          alertThreshold: m.alertThreshold,
          ...(m.checkRegions ? { checkRegions: JSON.parse(m.checkRegions) } : {}),
        })),
      });

      writeFileSync(
        opts.output,
        `# PulseGuard Monitoring as Code\n# Generated: ${new Date().toISOString()}\n\n${yamlContent}`,
      );
      console.log(chalk.green(`✔ Exported ${monitors.length} monitors to ${opts.output}`));
    } catch (err) {
      spinner.fail("Failed to export monitors");
      if (err instanceof ApiError) console.error(chalk.red(err.message));
    }
  });

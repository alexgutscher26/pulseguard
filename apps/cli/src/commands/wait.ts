import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getApiKey, getBaseUrl } from "../config.js";
import { ApiError } from "../client.js";

/**
 * pulse wait <id>
 *
 * CI/CD gate: blocks until a monitor is UP or timeout is reached.
 * Exits 0 if UP, exits 1 on timeout (so CI build fails).
 *
 * Usage in GitHub Actions:
 *   - name: Wait for production to be healthy
 *     run: pulse wait ${{ env.MONITOR_ID }} --timeout 300
 */
export const waitCmd = new Command("wait")
  .argument("<id>", "Monitor ID to wait for")
  .description("Block until a monitor is UP (for CI/CD deployment gates)")
  .option("--timeout <seconds>", "Maximum wait time in seconds", "300")
  .option("--interval <seconds>", "Check interval in seconds", "15")
  .option("--json", "Output result as JSON on completion")
  .action(async (id, opts) => {
    const timeout = Math.min(Number(opts.timeout), 600);
    const interval = Math.max(Number(opts.interval), 5);

    const apiKey = getApiKey();
    const baseUrl = getBaseUrl();

    if (!apiKey) {
      console.error(chalk.red("✖ Not logged in. Run: pulse auth login --key <API_KEY>"));
      process.exit(1);
    }

    const spinner = ora(`Waiting for monitor to become UP (timeout: ${timeout}s)…`).start();

    try {
      const url = `${baseUrl}/api/cli/monitors/${id}/wait?timeout=${timeout}&interval=${interval}`;
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "pulseguard-cli/0.1.0",
        },
        signal: AbortSignal.timeout((timeout + 30) * 1000),
      });

      const data = await res.json() as any;

      if (opts.json) {
        spinner.stop();
        console.log(JSON.stringify(data, null, 2));
      }

      if (res.ok && data.success) {
        spinner.succeed(chalk.green(`✔ ${data.name} is UP`));
        console.log(chalk.dim(`  Last check: ${data.lastCheck ? new Date(data.lastCheck).toLocaleString() : "unknown"}`));
        process.exit(0);
      } else {
        // 504 — timed out
        spinner.fail(chalk.red(`✖ ${data.message}`));
        console.log(chalk.dim(`  Monitor status: ${data.status}`));
        console.error(chalk.yellow(`\n  Deployment gate failed. Check your monitor at:\n  ${baseUrl}/dashboard/monitors/${id}`));
        process.exit(1);
      }
    } catch (err: any) {
      spinner.fail("Wait failed");
      if (err.name === "TimeoutError") {
        console.error(chalk.red(`✖ Request timed out after ${timeout + 30}s`));
      } else {
        console.error(chalk.red(err.message));
      }
      process.exit(1);
    }
  });

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

    const deadline = Date.now() + timeout * 1000;
    try {
      while (Date.now() < deadline) {
        const url = `${baseUrl}/api/cli/monitors/${id}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "User-Agent": "pulseguard-cli/0.1.0",
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${res.status}`);
        }

        const data = (await res.json()) as any;
        const monitor = data.monitor;

        if (monitor.status === "UP") {
          spinner.succeed(chalk.green(`✔ ${monitor.name} is UP`));
          console.log(
            chalk.dim(
              `  Last check: ${monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleString() : "unknown"}`,
            ),
          );
          if (opts.json) {
            console.log(
              JSON.stringify(
                {
                  success: true,
                  monitorId: id,
                  name: monitor.name,
                  status: "UP",
                  lastCheck: monitor.lastCheck,
                },
                null,
                2,
              ),
            );
          }
          process.exit(0);
        }

        // Wait for interval
        await new Promise((resolve) => setTimeout(resolve, interval * 1000));
      }

      // Timeout reached
      const url = `${baseUrl}/api/cli/monitors/${id}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": "pulseguard-cli/0.1.0",
        },
      });
      const data = (await res.json()) as any;
      const monitor = data.monitor;

      spinner.fail(chalk.red(`✖ Monitor did not recover within ${timeout}s`));
      console.log(chalk.dim(`  Monitor status: ${monitor?.status ?? "UNKNOWN"}`));
      console.error(
        chalk.yellow(
          `\n  Deployment gate failed. Check your monitor at:\n  ${baseUrl}/dashboard/monitors/${id}`,
        ),
      );

      if (opts.json) {
        console.log(
          JSON.stringify(
            {
              success: false,
              monitorId: id,
              name: monitor?.name || "unknown",
              status: monitor?.status || "UNKNOWN",
              lastCheck: monitor?.lastCheck,
            },
            null,
            2,
          ),
        );
      }
      process.exit(1);
    } catch (err: any) {
      spinner.fail("Wait failed");
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  });

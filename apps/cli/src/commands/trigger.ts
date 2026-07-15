import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { api, ApiError } from "../client.js";

interface TriggerResult {
  monitorId: string;
  name: string;
  url: string;
  status: "UP" | "DOWN";
  latency: number;
  httpStatus: number | null;
  errorReason: string | null;
  checkedAt: string;
}

// pulse trigger <id>
export const triggerCmd = new Command("trigger")
  .argument("<id>", "Monitor ID to trigger")
  .description("Force an immediate health check on a monitor")
  .option("--url <url>", "Override target URL for this check")
  .option("--json", "Output as JSON")
  .action(async (id, opts) => {
    const spinner = ora("Running check…").start();
    try {
      const payload = opts.url ? { url: opts.url } : {};
      const result = await api.post<TriggerResult>(`/api/cli/monitors/${id}/trigger`, payload);
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      const statusColor = result.status === "UP" ? chalk.green : chalk.red;
      const icon = result.status === "UP" ? "✔" : "✖";

      console.log(`\n${statusColor(`${icon} ${result.name}`)}  ${chalk.dim(result.url)}`);
      console.log(chalk.dim(`  Status   : ${statusColor(result.status)}`));
      console.log(chalk.dim(`  Latency  : ${result.latency}ms`));
      if (result.httpStatus) console.log(chalk.dim(`  HTTP     : ${result.httpStatus}`));
      if (result.errorReason) console.log(chalk.red(`  Error    : ${result.errorReason}`));
      console.log(chalk.dim(`  Checked  : ${new Date(result.checkedAt).toLocaleString()}`));

      if (result.status === "DOWN") process.exit(1);
    } catch (err) {
      spinner.fail("Check failed");
      if (err instanceof ApiError) {
        console.error(chalk.red(err.message));
        if (err.status === 422) {
          console.error(chalk.dim("Only HTTP monitors support instant trigger"));
        }
      }
      process.exit(1);
    }
  });

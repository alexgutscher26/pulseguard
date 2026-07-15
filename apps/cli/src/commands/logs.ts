import { Command } from "commander";
import chalk from "chalk";
import { api, ApiError } from "../client.js";
import { getBaseUrl, getApiKey } from "../config.js";

interface Event {
  id: string;
  status: string;
  latency: number;
  errorReason: string | null;
  timestamp: string;
  region: string | null;
}

const STATUS_SYMBOL: Record<string, string> = {
  UP: chalk.green("●"),
  DOWN: chalk.red("●"),
  MAINTENANCE: chalk.blue("●"),
  PAUSED: chalk.yellow("●"),
};

function formatEvent(e: Event): string {
  const ts = new Date(e.timestamp).toLocaleTimeString();
  const symbol = STATUS_SYMBOL[e.status] ?? chalk.dim("●");
  const latency = e.latency ? chalk.dim(`${e.latency}ms`.padStart(7)) : chalk.dim("  ---ms");
  const region = e.region ? chalk.dim(` [${e.region}]`) : "";
  const err = e.errorReason ? chalk.red(` ${e.errorReason}`) : "";
  return `  ${chalk.dim(ts)}  ${symbol} ${e.status.padEnd(12)}${latency}${region}${err}`;
}

// pulse logs tail <id>
export const logsCmd = new Command("logs").description("Stream monitor logs");

logsCmd
  .command("tail <id>")
  .description("Tail live events from a monitor (like tail -f)")
  .option("-n, --lines <n>", "Number of past lines to show", "20")
  .option("--interval <ms>", "Poll interval in ms", "5000")
  .action(async (id, opts) => {
    const lines = Number(opts.lines);
    const intervalMs = Math.max(Number(opts.interval), 2000);

    try {
      // Initial fetch: show last N events
      const { name, events } = await api.get<{ name: string; events: Event[] }>(
        `/api/cli/monitors/${id}/events?limit=${lines}`,
      );

      console.log(chalk.bold(`\n  Tailing logs for: ${name}`));
      console.log(chalk.dim(`  Polling every ${intervalMs / 1000}s — Ctrl+C to stop\n`));

      for (const e of events) {
        console.log(formatEvent(e));
      }

      // Track the newest event we've seen
      let lastTimestamp =
        events.length > 0 ? events[events.length - 1].timestamp : new Date().toISOString();

      // Poll for new events
      const poll = async () => {
        try {
          const { events: newEvents } = await api.get<{ events: Event[] }>(
            `/api/cli/monitors/${id}/events?limit=50&since=${encodeURIComponent(lastTimestamp)}`,
          );
          for (const e of newEvents) {
            console.log(formatEvent(e));
          }
          if (newEvents.length > 0) {
            lastTimestamp = newEvents[newEvents.length - 1].timestamp;
          }
        } catch (_) {
          // Silently retry on poll errors
        }
      };

      const interval = setInterval(poll, intervalMs);

      // Graceful Ctrl+C
      process.on("SIGINT", () => {
        clearInterval(interval);
        console.log(chalk.dim("\n  Stopped tailing."));
        process.exit(0);
      });
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(chalk.red(`✖ ${err.message}`));
      }
      process.exit(1);
    }
  });

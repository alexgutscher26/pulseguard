import { Command } from "commander";
import chalk from "chalk";
import { setConfig, getConfig, clearConfig } from "../config.js";
import { api } from "../client.js";

export const authCmd = new Command("auth").description("Manage authentication");

authCmd
  .command("login")
  .description("Authenticate with a PulseGuard API key")
  .option("--key <apiKey>", "API key (pg_live_...)")
  .option("--url <baseUrl>", "Custom base URL (self-hosted instances)")
  .action(async (opts) => {
    let apiKey = opts.key as string | undefined;
    let baseUrl = opts.url as string | undefined;

    if (!apiKey) {
      console.log(chalk.dim("Generate an API key at: ") + chalk.cyan("https://pulseguard.io/dashboard/settings?tab=api-keys"));
      console.error(chalk.red("✖ --key is required"));
      process.exit(1);
    }

    // Temporarily set to test connectivity
    setConfig({ apiKey, baseUrl });

    try {
      const res = await api.get<{ monitors: any[] }>("/api/cli/monitors");
      console.log(chalk.green("✔ Authenticated successfully!"));
      console.log(chalk.dim(`  Found ${res.monitors.length} monitors`));
    } catch (_) {
      clearConfig();
      console.error(chalk.red("✖ Invalid API key or connection failed"));
      process.exit(1);
    }
  });

authCmd
  .command("logout")
  .description("Clear stored credentials")
  .action(() => {
    clearConfig();
    console.log(chalk.green("✔ Logged out. Credentials cleared."));
  });

authCmd
  .command("status")
  .description("Show current authentication status")
  .action(async () => {
    const config = getConfig();
    if (!config.apiKey) {
      console.log(chalk.yellow("Not logged in. Run: ") + chalk.bold("pulse auth login --key <API_KEY>"));
      return;
    }
    console.log(chalk.green("✔ Logged in"));
    console.log(chalk.dim(`  Key prefix : ${config.apiKey.slice(0, 15)}…`));
    console.log(chalk.dim(`  Base URL   : ${config.baseUrl}`));
  });

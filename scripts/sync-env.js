import fs from "fs";
import path from "path";

const rootEnv = path.join(process.cwd(), ".env");
const webEnv = path.join(process.cwd(), "apps/web/.env");
const workerEnv = path.join(process.cwd(), "apps/worker/.dev.vars");

try {
  if (fs.existsSync(rootEnv)) {
    fs.copyFileSync(rootEnv, webEnv);
    fs.copyFileSync(rootEnv, workerEnv);
    console.log("⚡️ Environment variables synced from root .env to sub-apps.");
  } else {
    console.warn("⚠️ Root .env file not found. Skipping sync.");
  }
} catch (err) {
  console.error("❌ Failed to sync environment variables:", err);
}

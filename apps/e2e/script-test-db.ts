import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
console.log("Loading env from ../../apps/web/.env");
dotenv.config({ path: path.resolve(__dirname, "../../apps/web/.env") });

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "DEFINED" : "UNDEFINED");

const { db } = await import("./lib/db.js");

console.log("Connecting...");
try {
  await db.$connect();
  console.log("Connected successfully!");
  await db.$disconnect();
} catch (e) {
  console.error("Connection failed:", e);
}

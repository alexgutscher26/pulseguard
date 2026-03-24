import { Pool } from "pg";
import { config } from "dotenv";
config({ path: "../../.env" });

const url = process.env.DATABASE_URL;
console.log("Testing connection to:", url?.replace(/:[^:]*@/, ":***@"));

// Remove sslmode from URL to avoid conflict with explicit ssl config
const cleanUrl = url?.replace(/[?&]sslmode=[^&]+/, "");

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then((client) => {
    console.log("Connected successfully via pg");
    client.release();
    pool.end();
  })
  .catch((e) => {
    console.error("PG Connection Error:", e);
  });

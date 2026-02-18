import dotenv from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

export default defineConfig({
  schema: path.join("prisma", "schema"), // Point to schema folder
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

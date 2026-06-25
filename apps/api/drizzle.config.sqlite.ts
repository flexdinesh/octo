import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/storage/adapters/sqlite/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL ?? "file:./data/api.sqlite" },
  out: "./src/storage/adapters/sqlite/migrations",
});

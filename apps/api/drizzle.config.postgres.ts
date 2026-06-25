import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/storage/adapters/postgres/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/octo" },
  out: "./src/storage/adapters/postgres/migrations",
});

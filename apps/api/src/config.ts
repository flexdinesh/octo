import type { StorageConfig, StorageDialect } from "./storage/index.ts";

export type ServerConfig = {
  host: string;
  port: number;
  storage: StorageConfig;
};

function readStorageDialect(): StorageDialect {
  const dialect = process.env.STORAGE_DIALECT;
  if (dialect === "postgres") return "postgres";
  return "sqlite";
}

export function readServerConfig(): ServerConfig {
  const host = process.env.HOST ?? "127.0.0.1";
  const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);
  const dialect = readStorageDialect();
  const url =
    process.env.DATABASE_URL ??
    (dialect === "sqlite" ? "file:./data/api.sqlite" : "postgresql://localhost:5432/octo");

  return {
    host,
    port,
    storage: { dialect, url },
  };
}

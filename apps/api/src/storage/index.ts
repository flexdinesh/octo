import type { Users } from "./models/users.ts";
import { PostgresStorage } from "./adapters/postgres/adapter.ts";
import { SqliteStorage } from "./adapters/sqlite/adapter.ts";

export type { CreateUserInput, UpdateUserInput, User } from "./entities.ts";
export type { Users } from "./models/users.ts";

export type StorageDialect = "sqlite" | "postgres";

export type StorageConfig = {
  dialect: StorageDialect;
  url: string;
};

export interface Storage {
  users: Users;
  migrate(): Promise<void>;
  close(): Promise<void>;
}

export function createStorage(config: StorageConfig): Storage {
  if (config.dialect === "postgres") {
    return new PostgresStorage(config);
  }
  return new SqliteStorage(config);
}

export async function migrateStorage(storage: Storage): Promise<void> {
  await storage.migrate();
}

export async function closeStorage(storage: Storage): Promise<void> {
  await storage.close();
}

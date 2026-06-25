import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { Storage, StorageConfig } from "../../index.ts";
import type { CreateUserInput, UpdateUserInput, User } from "../../entities.ts";
import type { Users } from "../../models/users.ts";
import * as schema from "./schema.ts";

function createUsers(db: ReturnType<typeof drizzle<typeof schema>>): Users {
  return {
    async listUsers(): Promise<User[]> {
      return db.select().from(schema.users).orderBy(schema.users.createdAt);
    },

    async getUserById(id: string): Promise<User | null> {
      const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
      return rows[0] ?? null;
    },

    async getUserByEmail(email: string): Promise<User | null> {
      const rows = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);
      return rows[0] ?? null;
    },

    async createUser(input: CreateUserInput): Promise<User> {
      const rows = await db.insert(schema.users).values(input).returning();
      const user = rows[0];
      if (user === undefined) throw new Error("Failed to create user");
      return user;
    },

    async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
      const rows = await db
        .update(schema.users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(schema.users.id, id))
        .returning();
      return rows[0] ?? null;
    },

    async deleteUser(id: string): Promise<boolean> {
      const rows = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
      return rows.length > 0;
    },
  };
}

export class SqliteStorage implements Storage {
  readonly users: Users;
  private readonly db: ReturnType<typeof drizzle<typeof schema>>;
  private readonly client: Database.Database;

  constructor(config: StorageConfig) {
    if (config.dialect !== "sqlite") {
      throw new Error("SqliteStorage requires dialect 'sqlite'");
    }
    const url = config.url.startsWith("file:") ? config.url.slice(5) : config.url;
    if (url !== ":memory:" && url !== "" && !url.startsWith("/dev/")) {
      mkdirSync(dirname(url), { recursive: true });
    }
    this.client = new Database(url);
    this.db = drizzle({ client: this.client, schema });
    this.users = createUsers(this.db);
  }

  async migrate(): Promise<void> {
    migrate(this.db, { migrationsFolder: new URL("./migrations", import.meta.url).pathname });
  }

  async close(): Promise<void> {
    this.client.close();
  }
}

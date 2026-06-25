import { describe, expect, it } from "vitest";
import { SqliteStorage } from "./adapters/sqlite/adapter.ts";
import { seedUsers } from "./seed.ts";

describe("seedUsers", () => {
  it("seeds sample users and is safe to re-run", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });

    await seedUsers(storage);
    const users = await storage.users.listUsers();
    expect(users).toHaveLength(3);

    await seedUsers(storage);
    const usersAgain = await storage.users.listUsers();
    expect(usersAgain).toHaveLength(3);

    await storage.close();
  });
});

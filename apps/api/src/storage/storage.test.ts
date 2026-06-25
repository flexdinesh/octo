import { describe, expect, it } from "vitest";
import { SqliteStorage } from "./adapters/sqlite/adapter.ts";

describe("SqliteStorage", () => {
  it("creates and lists a user", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });
    await storage.migrate();

    const created = await storage.users.createUser({
      email: "alice@example.com",
      name: "Alice",
    });

    expect(created.email).toBe("alice@example.com");
    expect(created.name).toBe("Alice");
    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.updatedAt).toBeInstanceOf(Date);

    const users = await storage.users.listUsers();
    expect(users).toHaveLength(1);
    expect(users[0]?.email).toBe("alice@example.com");

    await storage.close();
  });

  it("gets a user by id and email", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });
    await storage.migrate();

    const created = await storage.users.createUser({
      email: "bob@example.com",
      name: "Bob",
    });

    const byId = await storage.users.getUserById(created.id);
    expect(byId).toEqual(created);

    const byEmail = await storage.users.getUserByEmail(created.email);
    expect(byEmail).toEqual(created);

    const missing = await storage.users.getUserById("does-not-exist");
    expect(missing).toBeNull();

    await storage.close();
  });

  it("updates a user", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });
    await storage.migrate();

    const created = await storage.users.createUser({
      email: "carol@example.com",
      name: "Carol",
    });

    const updated = await storage.users.updateUser(created.id, { name: "Carol Updated" });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe("Carol Updated");
    expect(updated?.email).toBe(created.email);
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());

    const missing = await storage.users.updateUser("does-not-exist", { name: "No one" });
    expect(missing).toBeNull();

    await storage.close();
  });

  it("deletes a user", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });
    await storage.migrate();

    const created = await storage.users.createUser({
      email: "dave@example.com",
      name: "Dave",
    });

    const deleted = await storage.users.deleteUser(created.id);
    expect(deleted).toBe(true);

    const missing = await storage.users.getUserById(created.id);
    expect(missing).toBeNull();

    const again = await storage.users.deleteUser(created.id);
    expect(again).toBe(false);

    await storage.close();
  });
});

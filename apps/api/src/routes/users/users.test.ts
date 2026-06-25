import { describe, expect, it } from "vitest";
import { buildServer } from "../../server.ts";
import { SqliteStorage } from "../../storage/adapters/sqlite/adapter.ts";

describe("users routes", () => {
  it("performs full crud through the storage seam", async () => {
    const storage = new SqliteStorage({ dialect: "sqlite", url: ":memory:" });
    await storage.migrate();
    const app = buildServer({ logger: false, storage });

    const createResponse = await app.inject({
      method: "POST",
      url: "/users",
      payload: { email: "alice@example.com", name: "Alice" },
    });
    expect(createResponse.statusCode).toBe(200);
    const created = JSON.parse(createResponse.payload);
    expect(created.email).toBe("alice@example.com");
    expect(created.name).toBe("Alice");

    const listResponse = await app.inject({ method: "GET", url: "/users" });
    expect(listResponse.statusCode).toBe(200);
    const users = JSON.parse(listResponse.payload);
    expect(users).toHaveLength(1);

    const getResponse = await app.inject({ method: "GET", url: `/users/${created.id}` });
    expect(getResponse.statusCode).toBe(200);
    const gotten = JSON.parse(getResponse.payload);
    expect(gotten.id).toBe(created.id);

    const patchResponse = await app.inject({
      method: "PATCH",
      url: `/users/${created.id}`,
      payload: { name: "Alice Updated" },
    });
    expect(patchResponse.statusCode).toBe(200);
    const patched = JSON.parse(patchResponse.payload);
    expect(patched.name).toBe("Alice Updated");

    const deleteResponse = await app.inject({ method: "DELETE", url: `/users/${created.id}` });
    expect(deleteResponse.statusCode).toBe(204);

    const missingResponse = await app.inject({ method: "GET", url: `/users/${created.id}` });
    expect(missingResponse.statusCode).toBe(404);

    await app.close();
  });
});

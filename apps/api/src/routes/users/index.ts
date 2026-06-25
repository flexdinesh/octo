import type { FastifyInstance, FastifyPluginAsync } from "fastify";

export const userRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/", async () => {
    return app.storage.users.listUsers();
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await app.storage.users.getUserById(id);
    if (user === null) {
      return reply.code(404).send({ error: "Not found" });
    }
    return user;
  });

  app.post("/", async (request) => {
    const body = request.body as { email: string; name: string };
    return app.storage.users.createUser(body);
  });

  app.patch("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { email?: string; name?: string };
    const user = await app.storage.users.updateUser(id, body);
    if (user === null) {
      return reply.code(404).send({ error: "Not found" });
    }
    return user;
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = await app.storage.users.deleteUser(id);
    if (!deleted) {
      return reply.code(404).send({ error: "Not found" });
    }
    return reply.code(204).send();
  });
};

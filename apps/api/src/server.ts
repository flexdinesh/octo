import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { healthRoutes } from "./routes/health/index.ts";
import { userRoutes } from "./routes/users/index.ts";
import type { Storage } from "./storage/index.ts";

type ServerOptions = FastifyServerOptions & {
  storage: Storage;
};

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }
}

export function buildServer(options: ServerOptions): FastifyInstance {
  const app = Fastify(options);

  app.decorate("storage", options.storage);

  app.register(healthRoutes, { prefix: "/health" });
  app.register(userRoutes, { prefix: "/users" });

  return app;
}

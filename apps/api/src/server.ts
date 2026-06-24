import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { healthRoutes } from "./routes/health/index.ts";

export function buildServer(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify(options);

  app.register(healthRoutes, { prefix: "/health" });

  return app;
}

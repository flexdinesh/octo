import type { FastifyPluginAsync } from "fastify";
import { liveHealthRoutes } from "./live.ts";
import { readyHealthRoutes } from "./ready.ts";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  await app.register(liveHealthRoutes);
  await app.register(readyHealthRoutes);
};

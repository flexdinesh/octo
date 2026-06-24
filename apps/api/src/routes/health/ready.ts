import type { FastifyPluginAsync } from "fastify";

const readyResponseSchema = {
  type: "object",
  required: ["status"],
  properties: {
    status: { type: "string" },
  },
};

export const readyHealthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/ready",
    {
      schema: {
        response: {
          200: readyResponseSchema,
        },
      },
    },
    async () => {
      return { status: "ok" };
    },
  );
};

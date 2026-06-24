import type { FastifyPluginAsync } from "fastify";

const liveResponseSchema = {
  type: "object",
  required: ["status"],
  properties: {
    status: { type: "string" },
  },
};

export const liveHealthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/live",
    {
      schema: {
        response: {
          200: liveResponseSchema,
        },
      },
    },
    async () => {
      return { status: "ok" };
    },
  );
};

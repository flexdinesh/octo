import { readServerConfig } from "./config.ts";
import { buildServer } from "./server.ts";

const config = readServerConfig();
const app = buildServer({ logger: true });

try {
  await app.listen(config);
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}

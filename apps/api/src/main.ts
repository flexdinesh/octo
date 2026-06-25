import { readServerConfig } from "./config.ts";
import { buildServer } from "./server.ts";
import { closeStorage, createStorage, migrateStorage } from "./storage/index.ts";

const config = readServerConfig();
const storage = createStorage(config.storage);
const app = buildServer({ logger: true, storage });

async function shutdown(signal: string): Promise<void> {
  app.log.info({ signal }, "shutting down");
  await app.close();
  await closeStorage(storage);
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

try {
  await migrateStorage(storage);
  await app.listen(config);
} catch (error) {
  app.log.error(error);
  await closeStorage(storage);
  process.exitCode = 1;
}

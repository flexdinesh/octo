import { closeStorage, createStorage, migrateStorage } from "./index.ts";
import type { Storage } from "./index.ts";
import { readServerConfig } from "../config.ts";

const sampleUsers = [
  { email: "alice@example.com", name: "Alice" },
  { email: "bob@example.com", name: "Bob" },
  { email: "carol@example.com", name: "Carol" },
];

export async function seedUsers(storage: Storage): Promise<void> {
  await migrateStorage(storage);
  for (const input of sampleUsers) {
    const existing = await storage.users.getUserByEmail(input.email);
    if (existing === null) {
      await storage.users.createUser(input);
    }
  }
}

export async function runSeed(): Promise<void> {
  const config = readServerConfig();
  const storage = createStorage(config.storage);
  try {
    await seedUsers(storage);
  } finally {
    await closeStorage(storage);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runSeed();
}

import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";
import assert from "node:assert/strict";

const appUrl = "http://127.0.0.1:3000";

async function run(command, args) {
  const child = spawn(command, args, {
    cwd: new URL("..", import.meta.url),
    stdio: "inherit",
  });

  const [code] = await once(child, "exit");
  assert.equal(code, 0);
}

async function waitForServer(process) {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    if (process.exitCode !== null) {
      throw new Error("server exited before accepting requests");
    }

    try {
      const response = await fetch(appUrl);
      if (response.ok) {
        return response;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error("server did not accept requests");
}

test("production server serves hello world", async () => {
  await run("pnpm", ["build"]);

  const server = spawn("pnpm", ["start"], {
    cwd: new URL("..", import.meta.url),
    stdio: "inherit",
  });

  try {
    const response = await waitForServer(server);
    const body = await response.text();

    assert.match(body, /hello world/i);
  } finally {
    server.kill("SIGTERM");
  }
});

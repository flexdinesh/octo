import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: "node_modules/.vite",
  test: {
    globals: true,
  },
});

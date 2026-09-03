import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "node",
    environmentMatchGlobs: [["src/components/**/*.test.tsx", "jsdom"]],
  },
});

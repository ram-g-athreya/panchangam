import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
    global: "window",
    exports: {},
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  optimizeDeps: {
    exclude: ["swisseph-wasm"],
  },
});

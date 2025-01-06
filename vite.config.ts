import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    minify: "esbuild",
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => ({
  base: "./",
  build: {
    rollupOptions: {
      plugins: [
        mode === "analyze" &&
          visualizer({
            open: true,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
          }),
      ],
    },
  },
  // Node.js global to browser globalThis
  define: {
    global: "globalThis",
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    viteExternalsPlugin({
      pug: "pug",
    }),
  ],
}));

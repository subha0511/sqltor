import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  // server: {
  //   headers: {
  //     "Cross-Origin-Opener-Policy": "same-origin",
  //     "Cross-Origin-Embedder-Policy": "require-corp",
  //   },
  // },
  // optimizeDeps: {
  //   exclude: ["@sqlite.org/sqlite-wasm"],
  // },
  plugins: [react(), wasm()],
});

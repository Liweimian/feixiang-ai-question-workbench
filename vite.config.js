import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        detailAi: resolve(import.meta.dirname, "detail-ai.html"),
        school: resolve(import.meta.dirname, "school.html"),
        editor: resolve(import.meta.dirname, "editor.html"),
        myResources: resolve(import.meta.dirname, "my-resources.html"),
      },
    },
  },
});

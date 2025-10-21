import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      include: ["src"],
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      outDir: "dist",
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      // Build multiple entry points to expose secondary import paths
      entry: {
        index: "src/index.ts",
        WeekCalendar: "src/WeekCalendar.ts",
      },
      name: "ReactWeekline",
      formats: ["es", "cjs"],
      // Let Vite/Rollup use default file naming per entry
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
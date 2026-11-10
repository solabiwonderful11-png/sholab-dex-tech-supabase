import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

/**
 * Absolute paths, resolved from this config file rather than from process.cwd().
 *
 * Vercel clones the repository and runs the build from the repository root, but
 * relying on the working directory is what made the previous build fragile: an
 * implicit root let a root-relative asset reference resolve to a directory and
 * fail with EISDIR. Pinning both values here makes the build independent of
 * where it is invoked from.
 */
const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const htmlEntry = fileURLToPath(new URL("./index.html", import.meta.url));

/**
 * Public base path.
 *
 * Vercel serves the site from the domain root, so the default `/` is correct
 * there. GitHub Pages serves a project site from `/<repo-name>/`, and a bundle
 * built for `/` would request `/assets/…` — which 404s on Pages and leaves a
 * blank page. Setting `VITE_BASE_PATH` (e.g. `/sholab-dex-tech-supabase/`) makes
 * the same source build correctly for either host.
 */
const base = process.env.VITE_BASE_PATH?.trim() || "/";

export default defineConfig({
  // The app lives at the repository root, so this is the repo root too. Stated
  // explicitly so Vercel needs no "Root Directory" setting in its dashboard.
  root: projectRoot,
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    // Split the vendor chunk out so the site's own code stays small and
    // cacheable across deploys.
    rollupOptions: {
      // An absolute path to the HTML entry. Rollup can only ever read a file
      // from here, never a directory, so the EISDIR failure cannot recur.
      input: htmlEntry,
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});

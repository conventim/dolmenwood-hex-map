// @ts-check
import { defineConfig } from "astro/config";

// Rewrite /dir/ to /dir/index.html for static files in public/
function publicDirIndex() {
  /** @type {import('vite').Plugin} */
  const plugin = {
    name: "public-dir-index",
    configureServer(server) {
      server.middlewares.use(
        (
          /** @type {any} */ req,
          /** @type {any} */ _res,
          /** @type {Function} */ next,
        ) => {
          if (req.url?.endsWith("/") && req.url !== "/") {
            req.url += "index.html";
          }
          next();
        },
      );
    },
  };
  return plugin;
}

// https://astro.build/config
export default defineConfig({
  outDir: "./dist",
  // Set to e.g. "/dolmenwood-hex-map" only when deploying standalone to a
  // GitHub Pages *project* site; leave unset for the submodule build.
  base: process.env.PUBLIC_BASE_PATH || "/",
  vite: {
    plugins: [publicDirIndex()],
  },
});

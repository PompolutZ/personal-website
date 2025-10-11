import { Plugin } from "vite";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { buildCV } from "./build-cv";

export function cvPlugin(): Plugin {
  const cvOutputDir = "dist/cv";

  return {
    name: "cv-plugin",

    async buildStart() {
      // Build CV at the start
      console.log("🔨 Building CV...");
      await buildCV();
    },

    configureServer(server) {
      // Handle CV routes in development
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url?.startsWith("/cv")) {
          return next();
        }

        // Remove query params and clean URL
        const cleanUrl = url.split("?")[0];
        let filePath: string;

        if (cleanUrl.endsWith(".json")) {
          filePath = path.join(cvOutputDir, cleanUrl.replace("/cv/", ""));
        } else {
          return next();
        }

        try {
          if (existsSync(filePath)) {
            const content = await readFile(filePath, "utf-8");

            if (filePath.endsWith(".json")) {
              res.setHeader("Content-Type", "application/json");
            }

            res.end(content);
            return;
          }
        } catch (error) {
          console.error("Error serving CV file:", error);
        }

        // If no CV file found, let Vite handle it (404)
        next();
      });
    },

    generateBundle() {
      // Ensure CV is built for production
      return buildCV();
    },
  };
}

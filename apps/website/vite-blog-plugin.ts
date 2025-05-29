import { Plugin } from "vite";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { buildBlog } from "./build-blog";

export function blogPlugin(): Plugin {
  const blogOutputDir = "dist/blog";

  return {
    name: "blog-plugin",

    async buildStart() {
      // Build blog at the start
      console.log("🔨 Building blog...");
      await buildBlog();
    },

    configureServer(server) {
      // Handle blog routes in development
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url?.startsWith("/blog")) {
          return next();
        }

        // Remove query params and clean URL
        const cleanUrl = url.split("?")[0];
        let filePath: string;

        if (cleanUrl === "/blog" || cleanUrl === "/blog/") {
          filePath = path.join(blogOutputDir, "index.html");
        } else if (cleanUrl.endsWith(".html")) {
          filePath = path.join(blogOutputDir, cleanUrl.replace("/blog/", ""));
        } else if (cleanUrl.endsWith(".css")) {
          filePath = path.join(blogOutputDir, cleanUrl.replace("/blog/", ""));
        } else if (cleanUrl.endsWith(".json")) {
          filePath = path.join(blogOutputDir, cleanUrl.replace("/blog/", ""));
        } else {
          // Try to find HTML file for the slug
          const slug = cleanUrl.replace("/blog/", "");
          filePath = path.join(blogOutputDir, `${slug}.html`);
        }

        try {
          if (existsSync(filePath)) {
            const content = await readFile(filePath, "utf-8");

            // Set appropriate content type
            if (filePath.endsWith(".html")) {
              res.setHeader("Content-Type", "text/html");
            } else if (filePath.endsWith(".css")) {
              res.setHeader("Content-Type", "text/css");
            } else if (filePath.endsWith(".json")) {
              res.setHeader("Content-Type", "application/json");
            }

            res.end(content);
            return;
          }
        } catch (error) {
          console.error("Error serving blog file:", error);
        }

        // If no blog file found, let Vite handle it (404)
        next();
      });
    },

    generateBundle() {
      // Ensure blog is built for production
      return buildBlog();
    },
  };
}

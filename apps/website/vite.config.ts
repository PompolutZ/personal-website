/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vite";
import * as ts from "typescript";
import transformer from "./typescript-jsx-transformer";
import { blogPlugin } from "./vite-blog-plugin";
import { cvPlugin } from "./vite-cv-plugin";

export default defineConfig({
  plugins: [
    {
      name: "typescript-jsx-interceptor",
      transform(code, id) {
        if (id.endsWith(".tsx") || id.endsWith(".jsx")) {
          // Use TypeScript compiler instead of esbuild for JSX files
          const result = ts.transpileModule(code, {
            compilerOptions: {
              target: ts.ScriptTarget.ES2020,
              module: ts.ModuleKind.ESNext,
              jsx: ts.JsxEmit.React,
              jsxFactory: "createElement",
              jsxFragmentFactory: "Fragment",
              moduleResolution: ts.ModuleResolutionKind.Bundler,
              allowSyntheticDefaultImports: true,
              esModuleInterop: true,
            },
            transformers: {
              before: [transformer()],
            },
          });

          // Calculate relative path to jsx-runtime from current file
          const relativePath = path.relative(
            path.dirname(id),
            path.resolve("./src/jsx-runtime.ts")
          );

          // Inject imports for transpiled JSX code
          const injectedCode = `
            import { createElement, Fragment } from './${relativePath}';
            
            ${result.outputText}
          `;

          return injectedCode;
        }
      },
    },
    blogPlugin(), // Custom plugin for handling blog routes
    cvPlugin(), // Custom plugin for handling CV routes
  ],
  // Disable esbuild for JSX files since we're handling them with TypeScript
  esbuild: {
    include: /\.(ts|js)$/, // Exclude tsx/jsx files
  },
  build: {
    minify: true,
    modulePreload: {
      polyfill: false,
    },
  },
  // your existing config
  server: {
    // Custom middleware to handle blog routes
    middlewareMode: false,
    fs: {
      // Allow serving files from blog directory
      allow: [".."],
    },
  },
});

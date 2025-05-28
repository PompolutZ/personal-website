/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import * as ts from "typescript";
import transformer from "./typescript-jsx-transformer";

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

          // Inject imports for transpiled JSX code
          const injectedCode = `
            import { createElement, Fragment } from './jsx-runtime.ts';
            
            ${result.outputText}
          `;

          return injectedCode;
        }
      },
    },
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
});

import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "createElement",
    jsxFragment: "Fragment",
    jsxInject: `import { createElement, Fragment } from './jsx-runtime.ts';`,
  },
  build: {
    minify: true,
    modulePreload: {
      polyfill: false,
    },
  },
});

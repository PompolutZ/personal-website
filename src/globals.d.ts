import { createElement, Fragment } from "./jsx-runtime";

declare global {
  const createElement: typeof createElement;
  const Fragment: typeof Fragment;
}

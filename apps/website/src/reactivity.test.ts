import { expect, test } from "vitest";
import { createSignal } from "./reactivity";

test("can create signal and read value", () => {
  const [read] = createSignal(42);

  expect(read()).toBe(42);
});

test("can read updated value from signal", () => {
  const [read, write] = createSignal(42);
  write(100);

  expect(read()).toBe(100);
});

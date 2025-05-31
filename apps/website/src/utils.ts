import { createSignal } from "./reactivity";

export function typeWriterText(text: string, speed = 100, delay = 3000) {
  const [read, write] = createSignal("");

  // Start typing after a short delay
  setTimeout(() => {
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => {
        write((prev) => prev + text[i]);
      }, speed * i);
    }
  }, delay);

  return read;
}

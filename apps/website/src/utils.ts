import { createSignal } from "./reactivity";

export function typeWriterText(text: string, speed = 50, delay = 500) {
  const [read, write] = createSignal("");

  let currentIndex = 0;
  let timeoutId: NodeJS.Timeout;

  const typeNextChar = () => {
    if (currentIndex < text.length) {
      write((prev) => prev + text[currentIndex]);
      currentIndex++;
      timeoutId = setTimeout(typeNextChar, speed);
    }
  };

  // Start typing after initial delay
  setTimeout(typeNextChar, delay);

  return read;
}

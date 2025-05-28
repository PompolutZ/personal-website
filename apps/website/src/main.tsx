import { renderHtml } from "./jsx-runtime";
import { createSignal } from "./reactivity";
import "./style.css";

function App() {
  const text = typeWriterText("oleh lutsenko", 120, 800);

  return (
    <div class="container">
      <div class="prompt" id="typewriter">
        <span id="typed-text">{text()}</span>
        <span class="cursor" id="cursor">
          &nbsp;
        </span>
      </div>
    </div>
  );
}

function typeWriterText(text: string, speed = 100, delay = 3000) {
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

renderHtml(<App />, document.querySelector("#app")!);

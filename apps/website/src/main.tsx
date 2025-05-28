import { renderHtml } from "./jsx-runtime";
import "./style.css";
import { TypewriterEffect } from "./TypewriterEffect";

function App() {
  initTypewriter();

  return (
    <div class="container">
      <div class="prompt" id="typewriter">
        <span id="typed-text"></span>
        <span class="cursor" id="cursor">
          &nbsp;
        </span>
      </div>
    </div>
  );
}

renderHtml(<App />, document.querySelector("#app")!);

function initTypewriter() {
  const typewriter = new TypewriterEffect(
    "oleh lutsenko",
    120 // typing speed in milliseconds
  );

  // Start typing after a short delay
  setTimeout(() => {
    typewriter.type();
  }, 800);
}

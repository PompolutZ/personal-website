import "./style.css";
import { TypewriterEffect } from "./TypewriterEffect";

function App() {
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

document.querySelector<HTMLDivElement>("#app")!.append(<App />);

// Initialize typewriter effect
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

// Run on page load
window.addEventListener("load", initTypewriter);

// Also run on page visibility change (when user returns to tab)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Reset and restart animation when page becomes visible
    const typedTextElement = document.getElementById("typed-text");
    const cursor = document.getElementById("cursor");

    if (!typedTextElement || !cursor) {
      console.error(
        "Required elements not found in the DOM or developer still an idiot."
      );
      return;
    }

    typedTextElement.textContent = "";
    cursor.style.display = "inline-block";

    setTimeout(() => {
      initTypewriter();
    }, 500);
  }
});

// Optional: Add some keyboard interaction
document.addEventListener("keydown", (e) => {
  // Press 'r' to restart the animation
  if (e.key.toLowerCase() === "r") {
    const typedTextElement = document.getElementById("typed-text");
    if (!typedTextElement) {
      console.error(
        "Typed text element not found in the DOM or developer still an idiot."
      );
      return;
    }

    typedTextElement.textContent = "";
    setTimeout(() => {
      initTypewriter();
    }, 300);
  }
});

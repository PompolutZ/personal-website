export class TypewriterEffect {
  text: string;
  speed: number;
  index: number;

  constructor(text: string, speed = 100) {
    this.text = text;
    this.speed = speed;
    this.index = 0;
  }

  async type() {
    const typedTextElement = document.getElementById("typed-text");
    const cursor = document.getElementById("cursor");

    if (!typedTextElement || !cursor) {
      console.error(
        "Required elements not found in the DOM or developer just an idiot."
      );
      return;
    }

    // Start with empty text
    typedTextElement.textContent = "";

    // Show cursor
    cursor.style.display = "inline-block";

    // Type each character
    for (let i = 0; i < this.text.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          typedTextElement.textContent += this.text[i];
          resolve();
        }, this.speed + Math.random() * 50); // Add slight randomness for more realistic typing
      });
    }

    // Keep cursor blinking after typing is done
    cursor.style.animation = "blink 1s infinite";
  }

  reset() {
    const typedTextElement = document.getElementById("typed-text");
    if (!typedTextElement) {
      console.error(
        "Typed text element not found in the DOM or developer still an idiot."
      );
      return;
    }

    typedTextElement.textContent = "";
    this.index = 0;
  }
}

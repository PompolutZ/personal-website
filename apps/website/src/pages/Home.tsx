import { typeWriterText } from "../utils";
import { createEffect } from "../reactivity";

export function Home() {
  // Add home page class to body
  createEffect(() => {
    document.body.classList.add('home-page');
    document.body.classList.remove('cv-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  });

  const text = typeWriterText("oleh lutsenko", 120, 800);
  return (
    <div class="container">
      <div class="prompt">
        <span>{text()}</span>
        <span class="cursor">&nbsp;</span>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/cv">CV</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

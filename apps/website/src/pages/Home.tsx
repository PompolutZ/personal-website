import { typeWriterText } from "../utils";

export function Home() {
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
        </ul>
      </nav>
    </div>
  );
}

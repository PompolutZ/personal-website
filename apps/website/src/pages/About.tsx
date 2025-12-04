import { typeWriterText } from "../utils";
import { createEffect } from "../reactivity";

const aboutText = `Hello! I'm Oleh Lutsenko, 

a software engineer with a passion for building web applications. I love exploring new technologies and sharing my knowledge through blogging.`;

export function About() {
  // Add home page class to body (About uses same styling as Home)
  createEffect(() => {
    document.body.classList.add('home-page');
    document.body.classList.remove('cv-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  });

  const about = typeWriterText(aboutText, 30, 300);
  return <div>{about()}</div>;
}

import { typeWriterText } from "../utils";

const aboutText = `Hello! I'm Oleh Lutsenko, 

a software engineer with a passion for building web applications. I love exploring new technologies and sharing my knowledge through blogging.`;

export function About() {
  const about = typeWriterText(aboutText, 150, 800);
  return <div>{about()}</div>;
}

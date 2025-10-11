import { renderHtml } from "./jsx-runtime";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { CV } from "./pages/CV";
import "./style.css";
import "./cv/cv-styles.css";

function App() {
  const pathname = window.location.pathname;

  if (pathname === "/about") {
    return <About />;
  }

  if (pathname === "/cv") {
    return <CV />;
  }

  return <Home />;
}

renderHtml(<App />, document.querySelector("#app")!);

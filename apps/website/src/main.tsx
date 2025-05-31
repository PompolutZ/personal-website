import { renderHtml } from "./jsx-runtime";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import "./style.css";

function App() {
  const pathname = window.location.pathname;

  if (pathname === "/about") {
    return <About />;
  }

  return <Home />;
}

renderHtml(<App />, document.querySelector("#app")!);

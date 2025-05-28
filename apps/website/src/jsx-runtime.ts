import { createEffect } from "./reactivity";

export function createElement(tag: any, props: any, ...children: any[]) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (key.startsWith("on:") && typeof value === "function") {
      const eventName = key.split(":")[1];

      el.addEventListener(eventName, value);
      continue;
    }

    el.setAttribute(key, value);
  }

  for (const child of children.flat()) {
    if (typeof child === "function") {
      createEffect(() => {
        el.innerHTML = "";
        el.append(child());
      });
    } else {
      el.append(
        typeof child === "string" ? document.createTextNode(child) : child
      );
    }
  }

  return el;
}

export function Fragment({ children }: { children: any[] }) {
  return children;
}

export function renderHtml(
  element: any,
  container: Element | DocumentFragment
): void {
  container.append(element);
}

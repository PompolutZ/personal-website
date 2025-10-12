import { createEffect } from "./reactivity";

export function createElement(tag: any, props: any, ...children: any[]) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    // Handle on:eventname syntax
    if (key.startsWith("on:") && typeof value === "function") {
      const eventName = key.split(":")[1];
      el.addEventListener(eventName, value);
      continue;
    }

    // Handle innerHTML
    if (key === "innerHTML") {
      if (typeof value === "function") {
        createEffect(() => {
          el.innerHTML = value();
        });
      } else {
        el.innerHTML = value;
      }
      continue;
    }

    // Skip null/undefined values
    if (value == null) {
      continue;
    }

    // Handle regular attributes
    if (typeof value === "function") {
      createEffect(() => {
        el.setAttribute(key, value());
      });
    } else {
      el.setAttribute(key, value);
    }
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

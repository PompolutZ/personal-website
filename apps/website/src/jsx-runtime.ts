export function createElement(tag: any, props: any, ...children: any[]) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    el.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (typeof child === "function") {
      el.append(child());
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


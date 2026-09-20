export interface ElementOptions {
  className?: string;
  text?: string;
  attributes?: Record<string, string>;
}

export type ElementChild = Node | string;

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: ElementChild[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  const { className, text, attributes } = options;

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
  }

  element.append(...children);

  return element;
}

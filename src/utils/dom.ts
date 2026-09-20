export function html(markup: string): HTMLElement {
  const template = document.createElement('template');

  template.innerHTML = markup.trim();

  const element = template.content.firstElementChild;

  if (!(element instanceof HTMLElement)) {
    throw new TypeError('Markup must have one root HTML element');
  }

  return element;
}

export function getElement<T extends Element>(
  root: ParentNode,
  selector: string,
  type: new () => T,
): T {
  const element = root.querySelector(selector);

  if (!(element instanceof type)) {
    throw new TypeError(`Element not found: ${selector}`);
  }

  return element;
}

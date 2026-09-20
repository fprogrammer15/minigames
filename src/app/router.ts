import { AppRoute } from '../types/routes';

export type PageRenderer = () => HTMLElement;

const INTERNAL_LINK_SELECTOR = 'a[data-link]';
const PRIMARY_MOUSE_BUTTON = 0;

export class Router {
  private readonly routes = new Map<string, PageRenderer>();
  private readonly outlet: HTMLElement;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
  }

  private render(): void {
    const renderer = this.routes.get(location.pathname) ?? this.routes.get(AppRoute.Home);

    if (!renderer) {
      return;
    }

    this.outlet.replaceChildren(renderer());
    scrollTo(0, 0);
  }

  private handleLinkClick(event: MouseEvent): void {
    const isModifiedClick =
      event.button !== PRIMARY_MOUSE_BUTTON ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (isModifiedClick || event.defaultPrevented) {
      return;
    }

    const { target } = event;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest<HTMLAnchorElement>(INTERNAL_LINK_SELECTOR);

    if (!link) {
      return;
    }

    event.preventDefault();
    this.navigate(link.pathname);
  }

  public register(path: AppRoute, renderer: PageRenderer): void {
    this.routes.set(path, renderer);
  }

  public navigate(path: string): void {
    if (path !== location.pathname) {
      history.pushState(null, '', path);
    }

    this.render();
  }

  public start(): void {
    addEventListener('popstate', () => {
      this.render();
    });

    document.addEventListener('click', (event: MouseEvent) => {
      this.handleLinkClick(event);
    });

    this.render();
  }
}

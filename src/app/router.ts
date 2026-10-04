import { AppRoute, PageName, type QueryKey } from '../types/routes';
import type { View } from '../types/view';

export type ViewFactory = () => View;

export interface RouteState {
  pageName: PageName;
  query: URLSearchParams;
}

export type RouteListener = (state: RouteState) => void;

// null removes the key from the URL
export type QueryChanges = Partial<Record<QueryKey, string | null>>;

interface NavigateOptions {
  replace?: boolean;
}

// Saved in history.state when a dialog adds a history entry
interface DialogHistoryState {
  isDialogEntry: boolean;
}

const INTERNAL_LINK_SELECTOR = 'a[data-link]';
const PRIMARY_MOUSE_BUTTON = 0;
const TRAILING_SLASHES = /\/+$/;

// "/library/" => "/library"
function normalizePath(pathname: string): string {
  return pathname.replace(TRAILING_SLASHES, '') || AppRoute.Home;
}

function isDialogEntry(state: unknown): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    'isDialogEntry' in state &&
    state.isDialogEntry === true
  );
}

// Current URL with some query keys changed. Changed keys go to the end in the given order,
// so the Library URL always looks the same: ?category=…&sort=…&page=…
function getUrlWithQuery(changes: QueryChanges): string {
  const query = new URLSearchParams(location.search);

  for (const [key, value] of Object.entries(changes)) {
    query.delete(key);

    if (typeof value === 'string') {
      query.append(key, value);
    }
  }

  const search = query.toString();

  return search ? `${location.pathname}?${search}` : location.pathname;
}

// The URL is the single source of truth: pages and dialogs are rendered from it
export class Router {
  private readonly outlet: HTMLElement;
  private readonly routes = new Map<string, PageName>();
  private readonly views = new Map<PageName, ViewFactory>();
  private readonly listeners: RouteListener[] = [];
  private currentPageName: PageName | null = null;
  private currentView: View | null = null;
  // history.back() is async: a second close request must not go back one more step
  private isGoingBack = false;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
  }

  private render(): void {
    const pageName = this.routes.get(normalizePath(location.pathname)) ?? PageName.NotFound;
    const query = new URLSearchParams(location.search);

    if (pageName !== this.currentPageName) {
      this.showPage(pageName);
    }

    this.currentView?.update?.(query);

    for (const listener of this.listeners) {
      listener({ pageName, query });
    }
  }

  private showPage(pageName: PageName): void {
    const createView = this.views.get(pageName);

    if (!createView) {
      return;
    }

    this.currentView?.destroy?.();
    this.currentView = createView();
    this.currentPageName = pageName;
    this.outlet.replaceChildren(this.currentView.element);
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
    this.navigate(`${link.pathname}${link.search}`);
  }

  public register(paths: AppRoute[], pageName: PageName, createView: ViewFactory): void {
    for (const path of paths) {
      this.routes.set(path, pageName);
    }

    this.views.set(pageName, createView);
  }

  // Shown for every unknown path
  public registerNotFound(createView: ViewFactory): void {
    this.views.set(PageName.NotFound, createView);
  }

  public onChange(listener: RouteListener): void {
    this.listeners.push(listener);
  }

  public navigate(url: string, { replace = false }: NavigateOptions = {}): void {
    if (replace) {
      history.replaceState(history.state, '', url);
    } else if (url !== `${location.pathname}${location.search}`) {
      history.pushState(null, '', url);
    }

    this.render();
  }

  public updateQuery(changes: QueryChanges, options?: NavigateOptions): void {
    this.navigate(getUrlWithQuery(changes), options);
  }

  // Opening a dialog adds a history entry, so Back closes the dialog
  public openDialog(key: QueryKey, value: string): void {
    const url = getUrlWithQuery({ [key]: value });

    // The dialog is open already: only its value changes, for example the auth mode
    if (new URLSearchParams(location.search).has(key)) {
      history.replaceState(history.state, '', url);
    } else {
      const state: DialogHistoryState = { isDialogEntry: true };

      history.pushState(state, '', url);
    }

    this.render();
  }

  public closeDialog(key: QueryKey): void {
    if (this.isGoingBack || !new URLSearchParams(location.search).has(key)) {
      return;
    }

    // The dialog was opened inside the app: going back restores the page URL
    if (isDialogEntry(history.state)) {
      this.isGoingBack = true;
      history.back();
      return;
    }

    // The dialog was opened by a direct link: only the dialog part is removed
    this.updateQuery({ [key]: null }, { replace: true });
  }

  public start(): void {
    addEventListener('popstate', () => {
      this.isGoingBack = false;
      this.render();
    });

    document.addEventListener('click', (event: MouseEvent) => {
      this.handleLinkClick(event);
    });

    this.render();
  }
}

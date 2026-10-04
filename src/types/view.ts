// A page or a section created by TypeScript
export interface View {
  element: HTMLElement;
  // Called after every URL change while the page is shown
  update?: (query: URLSearchParams) => void;
  // Called before the page is removed: cancels requests
  destroy?: () => void;
}

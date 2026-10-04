import './pagination.scss';
import { MOBILE_MEDIA_QUERY } from '../../constants/breakpoints';
import { FIRST_PAGE, MAX_PAGE_BUTTONS, MAX_PAGE_BUTTONS_MOBILE } from '../../constants/library';
import { html } from '../../utils/dom';
import { iconHtml, IconName } from '../icon/icon';

const PAGE_SELECTOR = '[data-page]';

// Page numbers around the current page: 10 pages, page 5, 4 buttons => 4 5 6 7
export function getVisiblePages(current: number, total: number, maxButtons: number): number[] {
  const count = Math.min(total, maxButtons);
  const pagesBeforeCurrent = Math.floor((count - 1) / 2);
  const lastStart = total - count + 1;
  const start = Math.min(Math.max(current - pagesBeforeCurrent, FIRST_PAGE), lastStart);

  return Array.from({ length: count }, (_, index) => start + index);
}

function pageHtml(page: number, isCurrent: boolean): string {
  const label = String(page);
  const currentAttribute = isCurrent ? 'aria-current="page"' : '';

  return `
    <li>
      <button
        class="pagination__page"
        type="button"
        aria-label="Page ${label}"
        data-page="${label}"
        ${currentAttribute}
      >
        ${label}
      </button>
    </li>
  `;
}

function arrowHtml(page: number, label: string, icon: IconName, isDisabled: boolean): string {
  return `
    <button
      class="pagination__arrow"
      type="button"
      aria-label="${label}"
      data-page="${String(page)}"
      ${isDisabled ? 'disabled' : ''}
    >
      ${iconHtml(icon, 'pagination__icon')}
    </button>
  `;
}

// Built from the API response: meta.page and meta.totalPages
export class Pagination {
  private readonly mediaQuery = matchMedia(MOBILE_MEDIA_QUERY);
  private readonly onSelect: (page: number) => void;
  private current = FIRST_PAGE;
  private total = 0;

  private readonly handleMediaChange = (): void => {
    if (!this.element.hidden) {
      this.render();
    }
  };

  public readonly element: HTMLElement;

  constructor(onSelect: (page: number) => void) {
    this.onSelect = onSelect;
    this.element = html('<nav class="pagination" aria-label="Library pages" hidden></nav>');

    this.element.addEventListener('click', (event: MouseEvent) => {
      const button =
        event.target instanceof Element
          ? event.target.closest<HTMLButtonElement>(PAGE_SELECTOR)
          : null;
      const page = Number(button?.dataset.page);

      if (button && !button.disabled && page !== this.current) {
        this.onSelect(page);
      }
    });

    this.mediaQuery.addEventListener('change', this.handleMediaChange);
  }

  private render(): void {
    // An empty result still shows page 1 and both arrows
    const isEmpty = this.total < FIRST_PAGE || this.current > this.total;
    const maxButtons = this.mediaQuery.matches ? MAX_PAGE_BUTTONS_MOBILE : MAX_PAGE_BUTTONS;
    const pages = isEmpty ? [FIRST_PAGE] : getVisiblePages(this.current, this.total, maxButtons);

    this.element.innerHTML = `
      ${arrowHtml(this.current - 1, 'Previous page', IconName.ChevronLeft, isEmpty || this.current <= FIRST_PAGE)}
      <ul class="pagination__list">
        ${pages.map((page) => pageHtml(page, page === this.current)).join('')}
      </ul>
      ${arrowHtml(this.current + 1, 'Next page', IconName.ChevronRight, isEmpty || this.current >= this.total)}
    `;
    this.element.hidden = false;
  }

  public show(current: number, total: number): void {
    this.current = current;
    this.total = total;
    this.render();
  }

  public hide(): void {
    this.element.hidden = true;
  }

  public destroy(): void {
    this.mediaQuery.removeEventListener('change', this.handleMediaChange);
  }
}

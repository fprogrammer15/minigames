import './sort-select.scss';
import { SORT_OPTIONS } from '../../constants/library';
import type { GameSort } from '../../types/api';
import { getElement, html } from '../../utils/dom';
import { iconHtml, IconName } from '../icon/icon';

const OPEN_CLASS = 'is-open';
const OPTION_SELECTOR = '[data-sort]';
const ESCAPE_KEY = 'Escape';
const MENU_ID = 'sort-menu';

function optionHtml(value: GameSort, label: string): string {
  return `
    <li role="none">
      <button
        class="sort-select__option"
        type="button"
        role="menuitemradio"
        aria-checked="false"
        data-sort="${value}"
      >
        ${iconHtml(IconName.Check, 'sort-select__check')}
        ${label}
      </button>
    </li>
  `;
}

function sortSelectHtml(): string {
  return `
    <div class="sort-select">
      <button
        class="sort-select__toggle"
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-controls="${MENU_ID}"
      >
        <span class="sort-select__label"></span>
        ${iconHtml(IconName.ArrowDropDown, 'sort-select__arrow')}
      </button>
      <ul class="sort-select__menu" id="${MENU_ID}" role="menu" aria-label="Sort games">
        ${SORT_OPTIONS.map((option) => optionHtml(option.value, option.label)).join('')}
      </ul>
    </div>
  `;
}

// Dropdown with the sort options from the design
export class SortSelect {
  private readonly toggle: HTMLButtonElement;
  private readonly label: HTMLElement;
  private readonly onChange: (value: GameSort) => void;
  private isOpen = false;

  // A click outside the dropdown closes it
  private readonly handleDocumentClick = (event: MouseEvent): void => {
    if (this.isOpen && event.target instanceof Node && !this.element.contains(event.target)) {
      this.setOpen(false);
    }
  };

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (!this.isOpen || event.key !== ESCAPE_KEY) {
      return;
    }

    this.setOpen(false);
    this.toggle.focus();
  };

  public readonly element: HTMLElement;

  constructor(onChange: (value: GameSort) => void) {
    this.onChange = onChange;
    this.element = html(sortSelectHtml());
    this.toggle = getElement(this.element, '.sort-select__toggle', HTMLButtonElement);
    this.label = getElement(this.element, '.sort-select__label', HTMLSpanElement);
    this.bindEvents();
  }

  private bindEvents(): void {
    this.toggle.addEventListener('click', () => {
      this.setOpen(!this.isOpen);
    });

    this.element.addEventListener('click', (event: MouseEvent) => {
      const button =
        event.target instanceof Element
          ? event.target.closest<HTMLButtonElement>(OPTION_SELECTOR)
          : null;
      const option = SORT_OPTIONS.find(({ value }) => value === button?.dataset.sort);

      if (!option) {
        return;
      }

      this.setOpen(false);
      this.onChange(option.value);
    });

    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeydown);
  }

  private setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.element.classList.toggle(OPEN_CLASS, isOpen);
    this.toggle.setAttribute('aria-expanded', String(isOpen));
  }

  public setValue(value: GameSort): void {
    const option = SORT_OPTIONS.find((item) => item.value === value);

    this.label.textContent = `Sort by: ${option?.label ?? ''}`;

    for (const button of this.element.querySelectorAll<HTMLButtonElement>(OPTION_SELECTOR)) {
      button.setAttribute('aria-checked', String(button.dataset.sort === value));
    }
  }

  public destroy(): void {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeydown);
  }
}

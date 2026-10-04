import './snackbar.scss';
import { escapeHtml, getElement, html } from '../../utils/dom';
import { iconHtml, IconName } from '../icon/icon';

export enum SnackbarType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

const HIDE_DELAY = 4000;
const MAX_MESSAGES = 3;
const HIDING_CLASS = 'is-hiding';
const CLOSE_SELECTOR = '[data-snackbar-close]';
const OPEN_POPOVER_SELECTOR = ':popover-open';
const OPEN_MODAL_SELECTOR = 'dialog:modal';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function messageHtml(text: string, type: SnackbarType): string {
  // Errors are announced right away, other messages when the reader is free
  const role = type === SnackbarType.Error ? 'alert' : 'status';

  return `
    <div class="snackbar snackbar--${type}" role="${role}">
      <p class="snackbar__text">${escapeHtml(text)}</p>
      <button class="snackbar__close" type="button" aria-label="Close notification" data-snackbar-close>
        ${iconHtml(IconName.Close, 'snackbar__close-icon')}
      </button>
    </div>
  `;
}

class Snackbar {
  private list: HTMLElement | null = null;

  private getList(): HTMLElement {
    if (!this.list) {
      // A popover is shown in the top layer, so messages are visible above a modal dialog too
      this.list = html(
        '<section class="snackbars" popover="manual" aria-label="Notifications"></section>',
      );
      document.body.append(this.list);
    }

    return this.list;
  }

  private bringToFront(list: HTMLElement): void {
    // A dialog opened after the list covers it, so the list is shown again above the dialog
    if (list.matches(OPEN_POPOVER_SELECTOR) && document.querySelector(OPEN_MODAL_SELECTOR)) {
      list.hidePopover();
    }

    if (!list.matches(OPEN_POPOVER_SELECTOR)) {
      list.showPopover();
    }
  }

  private remove(message: HTMLElement): void {
    message.remove();

    if (this.list?.childElementCount === 0 && this.list.matches(OPEN_POPOVER_SELECTOR)) {
      this.list.hidePopover();
    }
  }

  private hide(message: HTMLElement): void {
    if (message.classList.contains(HIDING_CLASS)) {
      return;
    }

    if (matchMedia(REDUCED_MOTION_QUERY).matches) {
      this.remove(message);
      return;
    }

    message.classList.add(HIDING_CLASS);
    message.addEventListener(
      'animationend',
      () => {
        this.remove(message);
      },
      { once: true },
    );
  }

  public show(text: string, type: SnackbarType): void {
    const list = this.getList();
    const message = html(messageHtml(text, type));
    const timer = setTimeout(() => {
      this.hide(message);
    }, HIDE_DELAY);

    getElement(message, CLOSE_SELECTOR, HTMLButtonElement).addEventListener('click', () => {
      clearTimeout(timer);
      this.hide(message);
    });

    if (list.childElementCount >= MAX_MESSAGES) {
      list.firstElementChild?.remove();
    }

    list.append(message);
    this.bringToFront(list);
  }
}

const snackbar = new Snackbar();

export function showSnackbar(text: string, type: SnackbarType = SnackbarType.Info): void {
  snackbar.show(text, type);
}

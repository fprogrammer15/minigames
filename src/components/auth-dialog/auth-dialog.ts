import './auth-dialog.scss';
import { AuthMode } from '../../types/auth';
import { html } from '../../utils/dom';
import { lockScroll, unlockScroll } from '../../utils/scroll-lock';
import { authPanelsHtml } from './auth-panels';

const ACTIVE_CLASS = 'is-active';
const CLOSING_CLASS = 'is-closing';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

enum ToggleLabel {
  Show = 'Show password',
  Hide = 'Hide password',
}

function isAuthMode(value: string | undefined): value is AuthMode {
  return value === AuthMode.Login || value === AuthMode.Register;
}

function tabHtml(mode: AuthMode, label: string): string {
  return `
    <button
      class="auth-dialog__tab"
      id="auth-tab-${mode}"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="auth-panel-${mode}"
      data-auth="${mode}"
    >
      ${label}
    </button>
  `;
}

function createDialogElement(): HTMLDialogElement {
  const dialog = html(`
    <dialog class="auth-dialog" aria-label="Authentication">
      <div class="auth-dialog__content">
        <div class="auth-dialog__tabs" role="tablist" aria-label="Login or register">
          ${tabHtml(AuthMode.Login, 'Login')}
          ${tabHtml(AuthMode.Register, 'Register')}
        </div>
        ${authPanelsHtml()}
      </div>
    </dialog>
  `);

  if (!(dialog instanceof HTMLDialogElement)) {
    throw new TypeError('Auth dialog markup must be a dialog element');
  }

  return dialog;
}

export class AuthDialog {
  public readonly element: HTMLDialogElement;

  constructor() {
    this.element = createDialogElement();
    this.bindEvents();
  }

  private bindEvents(): void {
    // Any element with data-auth opens the dialog in that mode: header and menu buttons,
    // tabs and the links inside the forms
    document.addEventListener('click', (event: MouseEvent) => {
      const trigger = event.target instanceof Element ? event.target.closest('[data-auth]') : null;

      if (trigger instanceof HTMLElement && isAuthMode(trigger.dataset.auth)) {
        this.open(trigger.dataset.auth);
      }
    });

    this.element.addEventListener('click', (event: MouseEvent) => {
      // A click on the dialog element itself is a click on the backdrop
      if (event.target === this.element) {
        this.close();
        return;
      }

      const { target } = event;
      const toggle = target instanceof Element ? target.closest('[data-password-toggle]') : null;

      if (toggle instanceof HTMLButtonElement) {
        this.togglePassword(toggle);
      }
    });

    // Escape: close with the animation instead of the instant default
    this.element.addEventListener('cancel', (event: Event) => {
      event.preventDefault();
      this.close();
    });

    this.element.addEventListener('close', () => {
      this.element.classList.remove(CLOSING_CLASS);
      unlockScroll();
    });

    // No backend at this stage: the forms only keep the page from reloading
    this.element.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
    });
  }

  private setMode(mode: AuthMode): void {
    for (const tab of this.element.querySelectorAll<HTMLElement>('[role="tab"]')) {
      const isActive = tab.dataset.auth === mode;

      tab.classList.toggle(ACTIVE_CLASS, isActive);
      tab.setAttribute('aria-selected', String(isActive));
    }

    for (const panel of this.element.querySelectorAll<HTMLElement>('[data-auth-panel]')) {
      panel.hidden = panel.dataset.authPanel !== mode;
    }
  }

  private togglePassword(toggle: HTMLButtonElement): void {
    const input = this.element.querySelector<HTMLInputElement>(
      `#${toggle.getAttribute('aria-controls') ?? ''}`,
    );

    if (!input) {
      return;
    }

    const isVisible = input.type === 'password';

    input.type = isVisible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(isVisible));
    toggle.setAttribute('aria-label', isVisible ? ToggleLabel.Hide : ToggleLabel.Show);
  }

  public open(mode: AuthMode): void {
    this.setMode(mode);

    if (this.element.open) {
      return;
    }

    this.element.showModal();
    lockScroll();
  }

  public close(): void {
    if (!this.element.open || this.element.classList.contains(CLOSING_CLASS)) {
      return;
    }

    if (matchMedia(REDUCED_MOTION_QUERY).matches) {
      this.element.close();
      return;
    }

    // Animations of child elements bubble up, so only the dialog animation counts
    const handleAnimationEnd = (event: AnimationEvent): void => {
      if (event.target !== this.element) {
        return;
      }

      this.element.removeEventListener('animationend', handleAnimationEnd);
      this.element.close();
    };

    this.element.classList.add(CLOSING_CLASS);
    this.element.addEventListener('animationend', handleAnimationEnd);
  }
}

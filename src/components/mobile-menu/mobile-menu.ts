import './mobile-menu.scss';
import { DESKTOP_MEDIA_QUERY } from '../../constants/breakpoints';
import { AuthMode } from '../../types/auth';
import { html } from '../../utils/dom';
import { lockScroll, unlockScroll } from '../../utils/scroll-lock';
import { buttonHtml, ButtonVariant } from '../button/button';
import { logoHtml, LogoVariant } from '../logo/logo';
import { navLinksHtml } from '../nav-links/nav-links';

export const MOBILE_MENU_ID = 'mobile-menu';

const OPEN_CLASS = 'is-open';
const ESCAPE_KEY = 'Escape';

enum BurgerLabel {
  Open = 'Open menu',
  Close = 'Close menu',
}

function createMenuElement(): HTMLElement {
  return html(`
    <div class="mobile-menu" id="${MOBILE_MENU_ID}" aria-hidden="true">
      <div class="mobile-menu__top">
        ${logoHtml(LogoVariant.Light)}
      </div>

      <nav class="mobile-menu__nav" aria-label="Mobile navigation">
        <ul class="mobile-menu__list">
          ${navLinksHtml('mobile-menu__link')}
        </ul>
      </nav>

      <div class="mobile-menu__actions">
        ${buttonHtml({
          text: 'Log In',
          variant: ButtonVariant.OutlinedInverse,
          className: 'mobile-menu__button',
          authMode: AuthMode.Login,
        })}
        ${buttonHtml({
          text: 'Sign Up',
          className: 'mobile-menu__button',
          authMode: AuthMode.Register,
        })}
      </div>
    </div>
  `);
}

export class MobileMenu {
  private readonly burger: HTMLButtonElement;
  private isOpen = false;

  public readonly element: HTMLElement;

  constructor(burger: HTMLButtonElement) {
    this.burger = burger;
    this.element = createMenuElement();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.burger.addEventListener('click', () => {
      this.setOpen(!this.isOpen);
    });

    // Any link or button inside the menu closes it
    this.element.addEventListener('click', (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a, button')) {
        this.setOpen(false);
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === ESCAPE_KEY) {
        this.setOpen(false);
      }
    });

    matchMedia(DESKTOP_MEDIA_QUERY).addEventListener('change', (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.setOpen(false);
      }
    });
  }

  private setOpen(isOpen: boolean): void {
    if (isOpen === this.isOpen) {
      return;
    }

    this.isOpen = isOpen;
    this.element.classList.toggle(OPEN_CLASS, isOpen);
    this.element.setAttribute('aria-hidden', String(!isOpen));
    this.burger.classList.toggle(OPEN_CLASS, isOpen);
    this.burger.setAttribute('aria-expanded', String(isOpen));
    this.burger.setAttribute('aria-label', isOpen ? BurgerLabel.Close : BurgerLabel.Open);

    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }
}

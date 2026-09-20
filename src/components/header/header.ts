import './header.scss';
import { AuthMode } from '../../types/auth';
import { getElement, html } from '../../utils/dom';
import { buttonHtml, ButtonVariant } from '../button/button';
import { logoHtml } from '../logo/logo';
import { MOBILE_MENU_ID, MobileMenu } from '../mobile-menu/mobile-menu';
import { navLinksHtml } from '../nav-links/nav-links';

export function createHeader(): HTMLElement {
  const header = html(`
    <header class="header">
      <div class="header__container">
        ${logoHtml()}

        <div class="header__controls">
          <nav class="header__nav" aria-label="Main navigation">
            <ul class="header__list">
              ${navLinksHtml('header__link')}
            </ul>
          </nav>

          <div class="header__actions">
            ${buttonHtml({
              text: 'Log In',
              variant: ButtonVariant.Outlined,
              className: 'header__login',
              authMode: AuthMode.Login,
            })}
            ${buttonHtml({
              text: 'Sign Up',
              className: 'header__signup',
              authMode: AuthMode.Register,
            })}
          </div>

          <button
            class="header__burger"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="${MOBILE_MENU_ID}"
          >
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
          </button>
        </div>
      </div>
    </header>
  `);

  const burger = getElement(header, '.header__burger', HTMLButtonElement);
  const mobileMenu = new MobileMenu(burger);

  header.append(mobileMenu.element);

  return header;
}

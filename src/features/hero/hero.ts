import './hero.scss';
import { buttonHtml, ButtonSize } from '../../components/button/button';
import {
  responsiveTextHtml,
  ShortTextFrom,
} from '../../components/responsive-text/responsive-text';

const DESCRIPTION =
  'Discover hundreds of curated casual mini-games. Play instantly in your browser — puzzle, match 3, farm, and board classics.';
const DESCRIPTION_SHORT = 'Discover hundreds of curated casual mini-games right in your browser.';

export function heroHtml(): string {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__container">
        <div class="hero__box">
          <h1 class="hero__title" id="hero-title">Take a Short Break &amp; Have Fun</h1>
          <p class="hero__text">
            ${responsiveTextHtml(DESCRIPTION, DESCRIPTION_SHORT, ShortTextFrom.Mobile)}
          </p>
          ${buttonHtml({
            text: 'Browse Library',
            size: ButtonSize.Large,
            className: 'hero__button',
          })}
        </div>
      </div>
    </section>
  `;
}

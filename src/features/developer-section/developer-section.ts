import './developer-section.scss';
import illustrationUrl from '../../assets/images/developer-illustration.webp';
import { buttonHtml, ButtonSize } from '../../components/button/button';
import { iconHtml, IconName } from '../../components/icon/icon';

const BUTTON_CONTENT = `${iconHtml(IconName.Upload, 'developer__button-icon')} Submit Form`;

export function developerSectionHtml(): string {
  return `
    <section class="developer" aria-labelledby="developer-title">
      <div class="developer__container">
        <img
          class="developer__image"
          src="${illustrationUrl}"
          alt="Game developer workplace with a computer and game items"
          width="719"
          height="517"
        >

        <div class="developer__card">
          <h2 class="developer__title" id="developer-title">Are You a Game Developer?</h2>
          <p class="developer__text">
            Want to see your game on MiniGames? We're always looking for fun,<br>engaging mini games
            to add to our platform. Submit your game<br>and reach thousands of players!
          </p>
          ${buttonHtml({
            text: BUTTON_CONTENT,
            size: ButtonSize.Large,
            className: 'developer__button',
          })}
          <p class="developer__note">or contact us at developers@minigames.com</p>
        </div>
      </div>
    </section>
  `;
}

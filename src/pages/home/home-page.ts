import { html } from '../../utils/dom';

export function renderHomePage(): HTMLElement {
  return html(`
    <div class="home">
      <h1 class="home__title">MiniGames</h1>
    </div>
  `);
}

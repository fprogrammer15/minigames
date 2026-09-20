import { createElement } from '../../utils/dom';

export function renderHomePage(): HTMLElement {
  return createElement('div', { className: 'home' }, [
    createElement('h1', { className: 'home__title', text: 'MiniGames' }),
  ]);
}

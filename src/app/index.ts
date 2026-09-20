import { renderHomePage } from '../pages/home/home-page';
import { AppRoute } from '../types/routes';
import { createElement } from '../utils/dom';
import { Router } from './router';

export function initApp(): void {
  const main = createElement('main', { className: 'main' });

  document.body.append(main);

  const router = new Router(main);

  router.register(AppRoute.Home, renderHomePage);
  router.start();
}

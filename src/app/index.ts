import { AuthDialog } from '../components/auth-dialog/auth-dialog';
import { createFooter } from '../components/footer/footer';
import { createHeader } from '../components/header/header';
import { renderHomePage } from '../pages/home/home-page';
import { AppRoute } from '../types/routes';
import { html } from '../utils/dom';
import { Router } from './router';

export function initApp(): void {
  const main = html('<main class="main"></main>');

  const authDialog = new AuthDialog();

  document.body.append(createHeader(), main, createFooter(), authDialog.element);

  const router = new Router(main);

  router.register(AppRoute.Home, renderHomePage);
  router.start();
}

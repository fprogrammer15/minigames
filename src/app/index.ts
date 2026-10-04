import { AuthDialog, isAuthMode } from '../components/auth-dialog/auth-dialog';
import { createFooter } from '../components/footer/footer';
import { GameDialog } from '../components/game-dialog/game-dialog';
import { createHeader } from '../components/header/header';
import { updateActiveNavLinks } from '../components/nav-links/nav-links';
import { createHomePage } from '../pages/home/home-page';
import { createLibraryPage } from '../pages/library/library-page';
import { createNotFoundPage } from '../pages/not-found/not-found-page';
import { AppRoute, PageName, QueryKey } from '../types/routes';
import { html } from '../utils/dom';
import { Router } from './router';

const APP_NAME = 'MiniGames';

const PAGE_TITLES: Record<PageName, string> = {
  [PageName.Home]: APP_NAME,
  [PageName.Library]: `Game Library | ${APP_NAME}`,
  [PageName.NotFound]: `Page Not Found | ${APP_NAME}`,
};

export function initApp(): void {
  const main = html('<main class="main"></main>');
  const router = new Router(main);
  const authDialog = new AuthDialog({
    onModeRequest: (mode): void => {
      router.openDialog(QueryKey.Auth, mode);
    },
    onCloseRequest: (): void => {
      router.closeDialog(QueryKey.Auth);
    },
  });
  const gameDialog = new GameDialog({
    onOpenRequest: (slug): void => {
      router.openDialog(QueryKey.Game, slug);
    },
    onCloseRequest: (): void => {
      router.closeDialog(QueryKey.Game);
    },
  });

  document.body.append(
    createHeader(),
    main,
    createFooter(),
    gameDialog.element,
    authDialog.element,
  );

  router.register([AppRoute.Home, AppRoute.HomeAlias], PageName.Home, createHomePage);
  router.register([AppRoute.Library], PageName.Library, () => createLibraryPage(router));
  router.registerNotFound(createNotFoundPage);

  // Header and dialogs follow the URL too
  router.onChange(({ pageName, query }) => {
    const gameSlug = query.get(QueryKey.Game);
    const authMode = query.get(QueryKey.Auth);

    document.title = PAGE_TITLES[pageName];
    updateActiveNavLinks(pageName);

    if (gameSlug) {
      gameDialog.open(gameSlug);
    } else {
      gameDialog.close();
    }

    if (isAuthMode(authMode)) {
      authDialog.open(authMode);
    } else {
      authDialog.close();
    }
  });

  router.start();
}

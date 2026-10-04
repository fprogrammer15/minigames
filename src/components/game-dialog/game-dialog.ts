import './game-dialog.scss';
import { ApiError } from '../../services/api-client';
import {
  type CommentsResponse,
  fetchGameComments,
  fetchGameDetails,
} from '../../services/games-service';
import type { GameDetails } from '../../types/game';
import { getElement, html } from '../../utils/dom';
import { lockScroll, unlockScroll } from '../../utils/scroll-lock';
import { AsyncContent } from '../async-content/async-content';
import { iconHtml, IconName } from '../icon/icon';
import { showSnackbar, SnackbarType } from '../snackbar/snackbar';
import {
  commentsHtml,
  commentsSkeletonHtml,
  detailsSkeletonHtml,
  gameDetailsHtml,
  gameNotFoundHtml,
} from './game-dialog-markup';

const GAME_TRIGGER_SELECTOR = '[data-game]';
const CLOSE_SELECTOR = '[data-dialog-close]';
const FAVORITE_SELECTOR = '[data-favorite]';
const CLOSING_CLASS = 'is-closing';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const NOT_FOUND_STATUS = 404;

// The dialog does not open or close by itself: it asks the app to change the URL
export interface GameDialogHandlers {
  // A Details button or a slider card was clicked
  onOpenRequest: (slug: string) => void;
  // The close button, a click on the backdrop or Escape
  onCloseRequest: () => void;
}

// A wrong game slug is not an error: the dialog shows the "Game Not Found" state
async function loadUnlessNotFound<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === NOT_FOUND_STATUS) {
      return null;
    }

    throw error;
  }
}

function createDialogElement(): HTMLDialogElement {
  const dialog = html(`
    <dialog class="game-dialog" aria-label="Game details">
      <button class="game-dialog__close" type="button" aria-label="Close" data-dialog-close>
        ${iconHtml(IconName.Close, 'game-dialog__close-icon')}
      </button>
      <div class="game-dialog__details"></div>
      <section class="game-dialog__comments" aria-labelledby="game-comments-title"></section>
    </dialog>
  `);

  if (!(dialog instanceof HTMLDialogElement)) {
    throw new TypeError('Game dialog markup must be a dialog element');
  }

  return dialog;
}

export class GameDialog {
  private readonly handlers: GameDialogHandlers;
  private readonly details: HTMLElement;
  private readonly comments: HTMLElement;
  private readonly detailsLoader: AsyncContent<GameDetails | null>;
  private readonly commentsLoader: AsyncContent<CommentsResponse | null>;
  private slug = '';

  public readonly element: HTMLDialogElement;

  constructor(handlers: GameDialogHandlers) {
    this.handlers = handlers;
    this.element = createDialogElement();
    this.details = getElement(this.element, '.game-dialog__details', HTMLDivElement);
    this.comments = getElement(this.element, '.game-dialog__comments', HTMLElement);

    this.detailsLoader = new AsyncContent<GameDetails | null>({
      container: this.details,
      load: (signal): Promise<GameDetails | null> =>
        loadUnlessNotFound(fetchGameDetails(this.slug, signal)),
      renderSkeleton: detailsSkeletonHtml,
      render: (game): void => {
        this.renderDetails(game);
      },
      errorTitle: 'Could not load the game',
      retrySuccessText: 'Game loaded',
    });

    this.commentsLoader = new AsyncContent<CommentsResponse | null>({
      container: this.comments,
      load: (signal): Promise<CommentsResponse | null> =>
        loadUnlessNotFound(fetchGameComments(this.slug, signal)),
      renderSkeleton: commentsSkeletonHtml,
      render: (response): void => {
        this.comments.innerHTML = response ? commentsHtml(response) : '';
      },
      errorTitle: 'Could not load comments',
      retrySuccessText: 'Comments loaded',
    });

    this.bindEvents();
  }

  private bindEvents(): void {
    // Details buttons in the Library and slider cards on Home
    document.addEventListener('click', (event: MouseEvent) => {
      const trigger =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(GAME_TRIGGER_SELECTOR)
          : null;

      if (trigger?.dataset.game) {
        this.handlers.onOpenRequest(trigger.dataset.game);
      }
    });

    this.element.addEventListener('click', (event: MouseEvent) => {
      const { target } = event;

      // A click on the dialog element itself is a click on the backdrop
      if (
        target === this.element ||
        (target instanceof Element && target.closest(CLOSE_SELECTOR))
      ) {
        this.handlers.onCloseRequest();
        return;
      }

      // Favorites need an account, they come with authentication in Story 4
      if (target instanceof Element && target.closest(FAVORITE_SELECTOR)) {
        showSnackbar('Log in to add games to your favorites.', SnackbarType.Info);
      }
    });

    // Escape: close with the animation instead of the instant default
    this.element.addEventListener('cancel', (event: Event) => {
      event.preventDefault();
      this.handlers.onCloseRequest();
    });

    this.element.addEventListener('close', () => {
      this.element.classList.remove(CLOSING_CLASS);
      unlockScroll();
    });
  }

  private renderDetails(game: GameDetails | null): void {
    if (game) {
      this.details.innerHTML = gameDetailsHtml(game);
      return;
    }

    this.details.innerHTML = gameNotFoundHtml(this.slug);
    this.commentsLoader.abort();
    this.comments.hidden = true;
  }

  public open(slug: string): void {
    if (this.element.open && slug === this.slug) {
      return;
    }

    this.slug = slug;
    this.comments.hidden = false;
    void this.detailsLoader.load();
    void this.commentsLoader.load();

    if (!this.element.open) {
      this.element.showModal();
      lockScroll();
    }

    this.element.scrollTop = 0;
  }

  public close(): void {
    if (!this.element.open || this.element.classList.contains(CLOSING_CLASS)) {
      return;
    }

    this.detailsLoader.abort();
    this.commentsLoader.abort();

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

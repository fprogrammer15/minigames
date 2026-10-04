import './slider.scss';
import { AsyncContent } from '../../components/async-content/async-content';
import { iconHtml, IconName } from '../../components/icon/icon';
import { sectionTitleHtml } from '../../components/section-title/section-title';
import { skeletonHtml } from '../../components/skeleton/skeleton';
import { emptyStateHtml } from '../../components/status-message/status-message';
import { fetchFeaturedGames } from '../../services/games-service';
import type { GameCard } from '../../types/game';
import type { View } from '../../types/view';
import { escapeHtml, getElement, html } from '../../utils/dom';
import { formatCompact, formatRating } from '../../utils/format';

// Desktop shows five cards, tablet and mobile hide the outer ones
const VISIBLE_CARDS = 5;
const MIN_GAMES_TO_MOVE = 2;
const ARROW_SELECTOR = '[data-slider-step]';

function gameCardHtml(game: GameCard): string {
  const name = escapeHtml(game.name);

  return `
    <li class="slider__slide">
      <article class="game-card">
        <button
          class="game-card__open"
          type="button"
          aria-label="Details: ${name}"
          data-game="${escapeHtml(game.slug)}"
        ></button>
        <img class="game-card__image" src="${escapeHtml(game.cardImage)}" alt="${name}">
        <div class="game-card__info">
          <h3 class="game-card__title">${name}</h3>
          <div class="game-card__meta">
            <span class="game-card__stat">
              ${iconHtml(IconName.Star, 'game-card__icon game-card__icon--star')}
              ${formatRating(game.rating)}
            </span>
            <span class="game-card__stat">
              ${iconHtml(IconName.Favorite, 'game-card__icon game-card__icon--favorite')}
              ${formatCompact(game.likesCount)}
            </span>
          </div>
        </div>
      </article>
    </li>
  `;
}

function trackHtml(slides: string): string {
  return `<ul class="slider__track">${slides}</ul>`;
}

function skeletonTrackHtml(): string {
  const slide = `<li class="slider__slide">${skeletonHtml('slider__skeleton')}</li>`;

  return trackHtml(slide.repeat(VISIBLE_CARDS));
}

function sliderHtml(): string {
  return `
    <section class="slider" aria-labelledby="slider-title">
      <div class="slider__container">
        <div class="slider__header">
          ${sectionTitleHtml('slider-title', 'New Games')}
          <div class="slider__controls">
            <button
              class="slider__arrow"
              type="button"
              aria-label="Previous game"
              data-slider-step="-1"
              disabled
            >
              ${iconHtml(IconName.ArrowBack, 'slider__arrow-icon')}
            </button>
            <button
              class="slider__arrow slider__arrow--next"
              type="button"
              aria-label="Next game"
              data-slider-step="1"
              disabled
            >
              ${iconHtml(IconName.ArrowForward, 'slider__arrow-icon')}
            </button>
          </div>
        </div>

        <div class="slider__content"></div>
      </div>
    </section>
  `;
}

// The active game is in the center, its neighbours are around it, the list is looped
export function getVisibleGames<T>(games: T[], activeIndex: number, count: number): T[] {
  const centerOffset = Math.floor(count / 2);

  return Array.from({ length: count }, (_, index) =>
    games.at((activeIndex + index - centerOffset) % games.length),
  ).filter((game) => game !== undefined);
}

class Slider {
  private readonly content: HTMLElement;
  private readonly arrows: HTMLButtonElement[];
  private readonly loader: AsyncContent<GameCard[]>;
  private games: GameCard[] = [];
  private activeIndex = 0;

  public readonly element: HTMLElement;

  constructor() {
    this.element = html(sliderHtml());
    this.content = getElement(this.element, '.slider__content', HTMLDivElement);
    this.arrows = [...this.element.querySelectorAll<HTMLButtonElement>(ARROW_SELECTOR)];
    this.loader = new AsyncContent<GameCard[]>({
      container: this.content,
      load: fetchFeaturedGames,
      renderSkeleton: skeletonTrackHtml,
      render: (games): void => {
        this.setGames(games);
      },
      errorTitle: 'Could not load new games',
      retrySuccessText: 'New games loaded',
    });

    this.bindEvents();
    void this.loader.load();
  }

  private bindEvents(): void {
    for (const arrow of this.arrows) {
      arrow.addEventListener('click', () => {
        this.move(Number(arrow.dataset.sliderStep));
      });
    }
  }

  // The list is looped: after the last game comes the first one
  private move(step: number): void {
    const count = this.games.length;

    if (count === 0) {
      return;
    }

    this.activeIndex = (this.activeIndex + step + count) % count;
    this.renderTrack();
  }

  private setGames(games: GameCard[]): void {
    this.games = games;
    this.activeIndex = 0;

    for (const arrow of this.arrows) {
      arrow.disabled = games.length < MIN_GAMES_TO_MOVE;
    }

    if (games.length === 0) {
      this.content.innerHTML = emptyStateHtml('No games yet', 'New games will appear here soon.');
      return;
    }

    this.renderTrack();
  }

  private renderTrack(): void {
    const visibleGames = getVisibleGames(this.games, this.activeIndex, VISIBLE_CARDS);

    this.content.innerHTML = trackHtml(visibleGames.map((game) => gameCardHtml(game)).join(''));
  }

  public destroy(): void {
    this.loader.abort();
  }
}

export function createSlider(): View {
  const slider = new Slider();

  return {
    element: slider.element,
    destroy: (): void => {
      slider.destroy();
    },
  };
}

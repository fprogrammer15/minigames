import './slider.scss';
import { iconHtml, IconName } from '../../components/icon/icon';
import { sectionTitleHtml } from '../../components/section-title/section-title';
import { getGameImage, getSliderGames } from '../../services/games-service';
import type { Game } from '../../types/game';
import { formatCompact } from '../../utils/format';

function gameCardHtml(game: Game): string {
  return `
    <li class="slider__slide">
      <article class="game-card">
        <img class="game-card__image" src="${getGameImage(game.slug)}" alt="${game.name}">
        <div class="game-card__info">
          <h3 class="game-card__title">${game.name}</h3>
          <div class="game-card__meta">
            <span class="game-card__stat">
              ${iconHtml(IconName.Star, 'game-card__icon game-card__icon--star')}
              ${String(game.rating)}
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

// Static layout only: the arrows do nothing at this stage
export function sliderHtml(): string {
  return `
    <section class="slider" aria-labelledby="slider-title">
      <div class="slider__container">
        <div class="slider__header">
          ${sectionTitleHtml('slider-title', 'New Games')}
          <div class="slider__controls">
            <button class="slider__arrow" type="button" aria-label="Previous game">
              ${iconHtml(IconName.ArrowBack, 'slider__arrow-icon')}
            </button>
            <button class="slider__arrow slider__arrow--next" type="button" aria-label="Next game">
              ${iconHtml(IconName.ArrowForward, 'slider__arrow-icon')}
            </button>
          </div>
        </div>

        <ul class="slider__track">
          ${getSliderGames()
            .map((game) => gameCardHtml(game))
            .join('')}
        </ul>
      </div>
    </section>
  `;
}

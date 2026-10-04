import './library-card.scss';
import { buttonHtml, ButtonSize } from '../../components/button/button';
import { iconHtml, IconName } from '../../components/icon/icon';
import { skeletonHtml } from '../../components/skeleton/skeleton';
import { FREE_PRICE } from '../../constants/api';
import type { GameCard } from '../../types/game';
import { escapeHtml } from '../../utils/dom';
import { formatCompact, formatRating } from '../../utils/format';

export function libraryCardHtml(game: GameCard, categoryLabel: string): string {
  const name = escapeHtml(game.name);
  const priceClass = game.price === FREE_PRICE ? 'library-card__price--free' : '';

  return `
    <li class="library-card-item">
      <article class="library-card">
        <img class="library-card__image" src="${escapeHtml(game.cardImage)}" alt="${name}" loading="lazy">
        <div class="library-card__body">
          <div class="library-card__badges">
            <span class="library-card__category">${escapeHtml(categoryLabel)}</span>
            <span class="library-card__price ${priceClass}">${escapeHtml(game.price)}</span>
          </div>
          <h2 class="library-card__title">${name}</h2>
          <p class="library-card__description">${escapeHtml(game.shortDescription)}</p>
          <div class="library-card__footer">
            <div class="library-card__stats">
              <span class="library-card__stat" aria-label="Rating">
                ${iconHtml(IconName.Star, 'library-card__icon library-card__icon--star')}
                ${formatRating(game.rating)}
              </span>
              <span class="library-card__stat" aria-label="Likes">
                ${iconHtml(IconName.Favorite, 'library-card__icon library-card__icon--like')}
                ${formatCompact(game.likesCount)}
              </span>
            </div>
            ${buttonHtml({
              text: 'Details',
              size: ButtonSize.Small,
              className: 'library-card__details',
              ariaLabel: `Details: ${game.name}`,
              data: { game: game.slug },
            })}
          </div>
        </div>
      </article>
    </li>
  `;
}

export function libraryCardSkeletonHtml(): string {
  return `
    <li class="library-card-item">
      <div class="library-card">
        ${skeletonHtml('library-card__image library-card__image--skeleton')}
        <div class="library-card__body">
          ${skeletonHtml('library-card__line library-card__line--short')}
          ${skeletonHtml('library-card__line library-card__line--title')}
          ${skeletonHtml('library-card__line')}
          ${skeletonHtml('library-card__line')}
        </div>
      </div>
    </li>
  `;
}

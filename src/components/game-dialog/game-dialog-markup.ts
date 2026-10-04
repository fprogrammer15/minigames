import { FREE_PRICE } from '../../constants/api';
import type { CommentsResponse } from '../../services/games-service';
import { AppRoute } from '../../types/routes';
import type { GameComment, GameDetails, GameSpecs, TopRecord } from '../../types/game';
import { formatRelativeTime } from '../../utils/date';
import { escapeHtml } from '../../utils/dom';
import { formatCompact, formatNumber, formatRating, getInitials } from '../../utils/format';
import { buttonHtml, ButtonSize, ButtonVariant, linkButtonHtml } from '../button/button';
import { iconHtml, IconName } from '../icon/icon';
import { skeletonHtml } from '../skeleton/skeleton';
import { emptyStateHtml } from '../status-message/status-message';

const MEDALS = ['🥇', '🥈', '🥉'];
const AVATAR_COLORS = 5;
const SKELETON_SPECS = 4;
const SKELETON_ROWS = 3;

const SPEC_LABELS: Record<keyof GameSpecs, string> = {
  genre: 'Genre',
  players: 'Players',
  duration: 'Duration',
  price: 'Price',
};

function specHtml(label: string, value: string): string {
  return `
    <div class="game-dialog__spec">
      <dt class="game-dialog__spec-label">${label}</dt>
      <dd class="game-dialog__spec-value">${escapeHtml(value)}</dd>
    </div>
  `;
}

function recordHtml(record: TopRecord): string {
  const medal = MEDALS[record.position - 1] ?? `#${String(record.position)}`;

  return `
    <li class="game-dialog__record">
      <span class="game-dialog__record-player">
        <span aria-label="Place ${String(record.position)}">${medal}</span>
        <span class="game-dialog__record-name">${escapeHtml(record.playerName)}</span>
      </span>
      <span class="game-dialog__record-result">
        <span>${formatNumber(record.score)} pts</span>
        <time class="game-dialog__record-time" datetime="${escapeHtml(record.achievedAt)}">
          ${formatRelativeTime(record.achievedAt)}
        </time>
      </span>
    </li>
  `;
}

function recordsHtml(records: TopRecord[]): string {
  const list =
    records.length > 0
      ? `<ol class="game-dialog__records">${records.map((record) => recordHtml(record)).join('')}</ol>`
      : '<p class="game-dialog__note">No records yet. Be the first to set one!</p>';

  return `
    <section class="game-dialog__section" aria-labelledby="game-records-title">
      <h3 class="game-dialog__section-title" id="game-records-title">
        <span aria-hidden="true">🏆</span> Top Records
      </h3>
      ${list}
    </section>
  `;
}

export function gameDetailsHtml(game: GameDetails): string {
  const name = escapeHtml(game.name);
  const { specs } = game;
  const playText = specs.price === FREE_PRICE ? 'Play Now' : `Buy Now: ${escapeHtml(specs.price)}`;
  const specsList = (Object.keys(SPEC_LABELS) as (keyof GameSpecs)[])
    .map((key) => specHtml(SPEC_LABELS[key], specs[key]))
    .join('');

  return `
    <div class="game-dialog__hero">
      <img class="game-dialog__image" src="${escapeHtml(game.heroImage)}" alt="${name}">
    </div>
    <div class="game-dialog__body">
      <div class="game-dialog__header">
        <h2 class="game-dialog__title" id="game-dialog-title">${name}</h2>
        <div class="game-dialog__ratings">
          <span class="game-dialog__rating" aria-label="Rating">
            ${iconHtml(IconName.Star, 'game-dialog__rating-icon game-dialog__rating-icon--star')}
            ${formatRating(game.rating)}
          </span>
          <span class="game-dialog__rating" aria-label="Likes">
            ${iconHtml(IconName.Favorite, 'game-dialog__rating-icon game-dialog__rating-icon--like')}
            ${formatCompact(game.likesCount)}
          </span>
        </div>
      </div>
      <p class="game-dialog__description">${escapeHtml(game.fullDescription)}</p>
      <dl class="game-dialog__specs">${specsList}</dl>
      <div class="game-dialog__actions">
        ${buttonHtml({ text: playText, size: ButtonSize.Large, className: 'game-dialog__play' })}
        <button
          class="game-dialog__favorite"
          type="button"
          aria-pressed="${String(game.isLikedByCurrentUser)}"
          aria-label="Add to Favorites"
          data-favorite
        >
          ${iconHtml(IconName.Favorite, 'game-dialog__favorite-icon')}
          <span class="game-dialog__favorite-text" aria-hidden="true">Add to Favorites</span>
        </button>
      </div>
      ${recordsHtml(game.topRecords)}
    </div>
  `;
}

export function gameNotFoundHtml(slug: string): string {
  return `
    <div class="game-dialog__not-found">
      ${emptyStateHtml(
        'Game Not Found',
        `We could not find the game "${slug}". The link may be wrong or the game was removed.`,
      )}
      ${linkButtonHtml({ text: 'Browse Library', href: AppRoute.Library, variant: ButtonVariant.Outlined })}
    </div>
  `;
}

export function detailsSkeletonHtml(): string {
  return `
    <div class="game-dialog__hero">${skeletonHtml('game-dialog__image')}</div>
    <div class="game-dialog__body">
      ${skeletonHtml('game-dialog__line game-dialog__line--title')}
      ${skeletonHtml('game-dialog__line')}
      ${skeletonHtml('game-dialog__line')}
      ${skeletonHtml('game-dialog__line game-dialog__line--short')}
      <div class="game-dialog__specs">
        ${skeletonHtml('game-dialog__spec-skeleton').repeat(SKELETON_SPECS)}
      </div>
      ${skeletonHtml('game-dialog__line game-dialog__line--button')}
      ${skeletonHtml('game-dialog__row-skeleton').repeat(SKELETON_ROWS)}
    </div>
  `;
}

function commentHtml(comment: GameComment, index: number): string {
  const color = String((index % AVATAR_COLORS) + 1);
  const likes = String(comment.likesCount);

  return `
    <li class="comment">
      <div class="comment__header">
        <span class="comment__author">
          <span class="comment__avatar comment__avatar--${color}" aria-hidden="true">
            ${escapeHtml(getInitials(comment.authorName).charAt(0))}
          </span>
          <span class="comment__name">${escapeHtml(comment.authorName)}</span>
        </span>
        <time class="comment__time" datetime="${escapeHtml(comment.createdAt)}">
          ${formatRelativeTime(comment.createdAt)}
        </time>
      </div>
      <p class="comment__text">${escapeHtml(comment.text)}</p>
      <span class="comment__likes" aria-label="${likes} likes">
        ${iconHtml(IconName.Favorite, 'comment__like-icon')}
        ${likes}
      </span>
    </li>
  `;
}

// The header shows the total number of comments, the list shows the latest ones
export function commentsHtml({ data, meta }: CommentsResponse): string {
  const list =
    data.length > 0
      ? `<ul class="game-dialog__comment-list">${data.map((comment, index) => commentHtml(comment, index)).join('')}</ul>`
      : emptyStateHtml('No comments yet', 'Be the first to share your thoughts about this game.');

  return `
    <h3 class="game-dialog__section-title" id="game-comments-title">
      Comments (${String(meta.totalComments)})
    </h3>
    <p class="game-dialog__note">Log in to write comments and like them.</p>
    ${list}
  `;
}

export function commentsSkeletonHtml(): string {
  return `
    ${skeletonHtml('game-dialog__line game-dialog__line--short')}
    ${skeletonHtml('game-dialog__comment-skeleton').repeat(SKELETON_ROWS)}
  `;
}

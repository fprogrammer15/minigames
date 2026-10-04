import './leaderboard.scss';
import { AsyncContent } from '../../components/async-content/async-content';
import {
  responsiveTextHtml,
  ShortTextFrom,
} from '../../components/responsive-text/responsive-text';
import { sectionTitleHtml } from '../../components/section-title/section-title';
import { skeletonHtml } from '../../components/skeleton/skeleton';
import { emptyStateHtml } from '../../components/status-message/status-message';
import { fetchLeaderboard } from '../../services/leaderboard-service';
import type { LeaderboardEntry } from '../../types/game';
import { escapeHtml, getElement, html } from '../../utils/dom';
import { formatCompact, formatNumber, getInitials } from '../../utils/format';

// The API returns the top 5 players
const SKELETON_ROWS = 5;

function rowHtml(entry: LeaderboardEntry): string {
  const rank = String(entry.rank);
  const streak = String(entry.streakDays);

  return `
    <tr class="leaderboard__row">
      <td class="leaderboard__cell leaderboard__cell--rank">#${rank}</td>
      <td class="leaderboard__cell leaderboard__cell--player">
        <span class="leaderboard__player">
          <span class="leaderboard__avatar leaderboard__avatar--${rank}" aria-hidden="true">
            ${escapeHtml(getInitials(entry.playerName))}
          </span>
          <span class="leaderboard__name">${escapeHtml(entry.playerName)}</span>
        </span>
      </td>
      <td class="leaderboard__cell leaderboard__cell--games">${String(entry.gamesPlayed)}</td>
      <td class="leaderboard__cell leaderboard__cell--score">
        ${responsiveTextHtml(
          formatNumber(entry.totalScore),
          formatCompact(entry.totalScore),
          ShortTextFrom.Mobile,
        )}
      </td>
      <td class="leaderboard__cell leaderboard__cell--streak">
        🔥 ${responsiveTextHtml(`${streak} days`, `${streak}d`, ShortTextFrom.Tablet)}
      </td>
      <td class="leaderboard__cell leaderboard__cell--favorite">
        <span class="leaderboard__badge">${escapeHtml(entry.favoriteGameName)}</span>
      </td>
    </tr>
  `;
}

function skeletonRowHtml(): string {
  const cell = (modifier: string, content = skeletonHtml('leaderboard__skeleton')): string =>
    `<td class="leaderboard__cell leaderboard__cell--${modifier}">${content}</td>`;
  const player = `
    <span class="leaderboard__player">
      ${skeletonHtml('leaderboard__avatar leaderboard__avatar--skeleton')}
      ${skeletonHtml('leaderboard__skeleton')}
    </span>
  `;

  return `
    <tr class="leaderboard__row">
      ${cell('rank')}
      ${cell('player', player)}
      ${cell('games')}
      ${cell('score')}
      ${cell('streak')}
      ${cell('favorite')}
    </tr>
  `;
}

function tableHtml(rows: string): string {
  return `
    <div class="leaderboard__card">
      <table class="leaderboard__table">
        <thead>
          <tr>
            <th class="leaderboard__cell leaderboard__cell--rank" scope="col">Rank</th>
            <th class="leaderboard__cell leaderboard__cell--player" scope="col">Player</th>
            <th class="leaderboard__cell leaderboard__cell--games" scope="col">
              ${responsiveTextHtml('Games Played', 'Games', ShortTextFrom.Tablet)}
            </th>
            <th class="leaderboard__cell leaderboard__cell--score" scope="col">
              ${responsiveTextHtml('Total Score', 'Score', ShortTextFrom.Tablet)}
            </th>
            <th class="leaderboard__cell leaderboard__cell--streak" scope="col">Streak</th>
            <th class="leaderboard__cell leaderboard__cell--favorite" scope="col">
              Favorite Game
            </th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function leaderboardHtml(): string {
  const title = responsiveTextHtml('Top Players This Week', 'Top Players', ShortTextFrom.Mobile);

  return `
    <section class="leaderboard" aria-labelledby="leaderboard-title">
      <div class="leaderboard__container">
        ${sectionTitleHtml('leaderboard-title', title)}
        <div class="leaderboard__content"></div>
      </div>
    </section>
  `;
}

export function createLeaderboard(): HTMLElement {
  const section = html(leaderboardHtml());
  const content = getElement(section, '.leaderboard__content', HTMLDivElement);
  const loader = new AsyncContent<LeaderboardEntry[]>({
    container: content,
    load: fetchLeaderboard,
    renderSkeleton: (): string => tableHtml(skeletonRowHtml().repeat(SKELETON_ROWS)),
    render: (entries): void => {
      content.innerHTML =
        entries.length > 0
          ? tableHtml(entries.map((entry) => rowHtml(entry)).join(''))
          : emptyStateHtml('No players yet', 'Play a game to get on the leaderboard.');
    },
    errorTitle: 'Could not load the leaderboard',
    retrySuccessText: 'Leaderboard loaded',
  });

  void loader.load();

  return section;
}

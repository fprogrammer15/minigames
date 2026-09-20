import './leaderboard.scss';
import {
  responsiveTextHtml,
  ShortTextFrom,
} from '../../components/responsive-text/responsive-text';
import { sectionTitleHtml } from '../../components/section-title/section-title';
import { getLeaderboard } from '../../services/leaderboard-service';
import type { LeaderboardEntry } from '../../types/game';
import { formatCompact, formatNumber, getInitials } from '../../utils/format';

function rowHtml(entry: LeaderboardEntry): string {
  const rank = String(entry.rank);
  const streak = String(entry.streakDays);

  return `
    <tr class="leaderboard__row">
      <td class="leaderboard__cell leaderboard__cell--rank">#${rank}</td>
      <td class="leaderboard__cell leaderboard__cell--player">
        <span class="leaderboard__player">
          <span class="leaderboard__avatar leaderboard__avatar--${rank}" aria-hidden="true">
            ${getInitials(entry.playerName)}
          </span>
          <span class="leaderboard__name">${entry.playerName}</span>
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
        <span class="leaderboard__badge">${entry.favoriteGameName}</span>
      </td>
    </tr>
  `;
}

export function leaderboardHtml(): string {
  const title = responsiveTextHtml('Top Players This Week', 'Top Players', ShortTextFrom.Mobile);

  return `
    <section class="leaderboard" aria-labelledby="leaderboard-title">
      <div class="leaderboard__container">
        ${sectionTitleHtml('leaderboard-title', title)}

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
            <tbody>
              ${getLeaderboard()
                .map((entry) => rowHtml(entry))
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

import { developerSectionHtml } from '../../features/developer-section/developer-section';
import { heroHtml } from '../../features/hero/hero';
import { leaderboardHtml } from '../../features/leaderboard/leaderboard';
import { sliderHtml } from '../../features/slider/slider';
import { html } from '../../utils/dom';

export function renderHomePage(): HTMLElement {
  return html(`
    <div class="home">
      ${heroHtml()}
      ${sliderHtml()}
      ${leaderboardHtml()}
      ${developerSectionHtml()}
    </div>
  `);
}

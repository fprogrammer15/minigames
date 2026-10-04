import { developerSectionHtml } from '../../features/developer-section/developer-section';
import { heroHtml } from '../../features/hero/hero';
import { leaderboardHtml } from '../../features/leaderboard/leaderboard';
import { createSlider } from '../../features/slider/slider';
import { html } from '../../utils/dom';

export function renderHomePage(): HTMLElement {
  const page = html(`<div class="home">${heroHtml()}</div>`);

  page.append(createSlider(), html(leaderboardHtml()), html(developerSectionHtml()));

  return page;
}

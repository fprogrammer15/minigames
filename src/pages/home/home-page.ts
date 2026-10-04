import { developerSectionHtml } from '../../features/developer-section/developer-section';
import { heroHtml } from '../../features/hero/hero';
import { createLeaderboard } from '../../features/leaderboard/leaderboard';
import { createSlider } from '../../features/slider/slider';
import type { View } from '../../types/view';
import { html } from '../../utils/dom';

export function createHomePage(): View {
  const slider = createSlider();
  const leaderboard = createLeaderboard();
  const element = html(`<div class="home">${heroHtml()}</div>`);

  element.append(slider.element, leaderboard.element, html(developerSectionHtml()));

  return {
    element,
    // Requests that are still loading are cancelled when the user leaves the page
    destroy: (): void => {
      slider.destroy?.();
      leaderboard.destroy?.();
    },
  };
}

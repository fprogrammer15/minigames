import './category-chips.scss';
import { skeletonHtml } from '../../components/skeleton/skeleton';
import type { Category } from '../../types/game';
import { escapeHtml } from '../../utils/dom';

const CHIP_SELECTOR = '[data-category]';
const SKELETON_CHIPS = 7;

function chipHtml(category: Category): string {
  return `
    <button class="chip" type="button" aria-pressed="false" data-category="${escapeHtml(category.slug)}">
      ${escapeHtml(category.label)}
    </button>
  `;
}

export function chipsHtml(categories: Category[]): string {
  return `
    <div class="chips" role="group" aria-label="Game categories">
      ${categories.map((category) => chipHtml(category)).join('')}
    </div>
  `;
}

export function chipsSkeletonHtml(): string {
  return `<div class="chips">${skeletonHtml('chip-skeleton').repeat(SKELETON_CHIPS)}</div>`;
}

// Only one chip is active: the selected category from the URL
export function updateActiveChip(container: HTMLElement, slug: string): void {
  for (const chip of container.querySelectorAll<HTMLElement>(CHIP_SELECTOR)) {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === slug));
  }
}

export function getChipCategory(target: EventTarget | null): string | undefined {
  const chip = target instanceof Element ? target.closest<HTMLElement>(CHIP_SELECTOR) : null;

  return chip?.dataset.category;
}

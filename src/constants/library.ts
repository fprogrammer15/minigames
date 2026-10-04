import { GameSort } from '../types/api';

export interface SortOption {
  value: GameSort;
  label: string;
}

export const DEFAULT_CATEGORY = 'all';
export const DEFAULT_SORT = GameSort.RatingDesc;
export const FIRST_PAGE = 1;

export const SORT_OPTIONS: SortOption[] = [
  { value: GameSort.RatingAsc, label: 'Rating ↑' },
  { value: GameSort.RatingDesc, label: 'Rating ↓' },
  { value: GameSort.NameAsc, label: 'Name A→Z' },
  { value: GameSort.NameDesc, label: 'Name Z→A' },
];

// Pagination shows at most 4 page buttons, 3 on mobile
export const MAX_PAGE_BUTTONS = 4;
export const MAX_PAGE_BUTTONS_MOBILE = 3;

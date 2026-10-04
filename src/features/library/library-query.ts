import type { QueryChanges } from '../../app/router';
import { DEFAULT_CATEGORY, DEFAULT_SORT, FIRST_PAGE } from '../../constants/library';
import { GameSort, type GamesQuery } from '../../types/api';
import { QueryKey } from '../../types/routes';

export interface ParsedLibraryQuery {
  query: GamesQuery;
  // URL values that were wrong and must be replaced, null when the URL is fine
  fixes: QueryChanges | null;
}

const PAGE_PATTERN = /^[1-9]\d*$/;
const GAME_SORTS = new Set<string>(Object.values(GameSort));

export function isGameSort(value: string): value is GameSort {
  return GAME_SORTS.has(value);
}

// Reads the Library state from the URL. Wrong values get the defaults, because the API
// answers them with an error. Categories are checked only when they are loaded.
export function parseLibraryQuery(
  parameters: URLSearchParams,
  categorySlugs: string[] | null,
  defaultCategory = DEFAULT_CATEGORY,
): ParsedLibraryQuery {
  const fixes: QueryChanges = {};
  const category = parameters.get(QueryKey.Category);
  const sort = parameters.get(QueryKey.Sort);
  const page = parameters.get(QueryKey.Page);
  const query: GamesQuery = { category: defaultCategory, sort: DEFAULT_SORT, page: FIRST_PAGE };

  if (category !== null) {
    if (categorySlugs === null || categorySlugs.includes(category)) {
      query.category = category;
    } else {
      fixes.category = defaultCategory;
    }
  }

  if (sort !== null) {
    if (isGameSort(sort)) {
      query.sort = sort;
    } else {
      fixes.sort = DEFAULT_SORT;
    }
  }

  if (page !== null) {
    if (PAGE_PATTERN.test(page)) {
      query.page = Number(page);
    } else {
      fixes.page = String(FIRST_PAGE);
    }
  }

  return { query, fixes: Object.keys(fixes).length > 0 ? fixes : null };
}

export function isSameQuery(first: GamesQuery, second: GamesQuery | null): boolean {
  return (
    second !== null &&
    first.category === second.category &&
    first.sort === second.sort &&
    first.page === second.page
  );
}

export function toQueryChanges(query: GamesQuery): QueryChanges {
  return {
    [QueryKey.Category]: query.category,
    [QueryKey.Sort]: query.sort,
    [QueryKey.Page]: String(query.page),
  };
}

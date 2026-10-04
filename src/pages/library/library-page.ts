import './library-page.scss';
import type { Router } from '../../app/router';
import { AsyncContent } from '../../components/async-content/async-content';
import { Pagination } from '../../components/pagination/pagination';
import { sectionTitleHtml } from '../../components/section-title/section-title';
import { SortSelect } from '../../components/sort-select/sort-select';
import { emptyStateHtml } from '../../components/status-message/status-message';
import { DEFAULT_CATEGORY, DEFAULT_SORT, FIRST_PAGE } from '../../constants/library';
import {
  chipsHtml,
  chipsSkeletonHtml,
  getChipCategory,
  updateActiveChip,
} from '../../features/library/category-chips';
import { libraryCardHtml, libraryCardSkeletonHtml } from '../../features/library/library-card';
import {
  isSameQuery,
  parseLibraryQuery,
  toQueryChanges,
} from '../../features/library/library-query';
import { fetchCategories, fetchGames, type GamesResponse } from '../../services/games-service';
import type { GamesQuery } from '../../types/api';
import type { Category } from '../../types/game';
import type { View } from '../../types/view';
import { getElement, html } from '../../utils/dom';

const DEFAULT_QUERY: GamesQuery = {
  category: DEFAULT_CATEGORY,
  sort: DEFAULT_SORT,
  page: FIRST_PAGE,
};
const SKELETON_CARDS = 6;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function libraryHtml(): string {
  return `
    <section class="library" aria-labelledby="library-title">
      <div class="library__container">
        <div class="library__heading">
          ${sectionTitleHtml('library-title', 'Game Library', 'h1')}
          <p class="library__subtitle">
            Find your next cozy game: choose a category and sort the list the way you like.
          </p>
        </div>
        <div class="library__toolbar">
          <div class="library__categories"></div>
        </div>
        <div class="library__results"></div>
      </div>
    </section>
  `;
}

function cardsSkeletonHtml(): string {
  return `<ul class="library__list">${libraryCardSkeletonHtml().repeat(SKELETON_CARDS)}</ul>`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// The URL is the source of truth: user actions change the URL,
// the page reads the URL and requests the matching games from the API
class LibraryPage {
  private readonly router: Router;
  private readonly toolbar: HTMLElement;
  private readonly categoriesBlock: HTMLElement;
  private readonly results: HTMLElement;
  private readonly sortSelect: SortSelect;
  private readonly pagination: Pagination;
  private readonly categoriesLoader: AsyncContent<Category[]>;
  private readonly gamesLoader: AsyncContent<GamesResponse>;
  private readonly categoriesLoading: Promise<void>;
  private categories: Category[] | null = null;
  private parameters = new URLSearchParams();
  private query: GamesQuery | null = null;

  public readonly element: HTMLElement;

  constructor(router: Router) {
    this.router = router;
    this.element = html(libraryHtml());
    this.toolbar = getElement(this.element, '.library__toolbar', HTMLDivElement);
    this.categoriesBlock = getElement(this.element, '.library__categories', HTMLDivElement);
    this.results = getElement(this.element, '.library__results', HTMLDivElement);
    this.sortSelect = new SortSelect((sort) => {
      this.changeQuery({ sort, page: FIRST_PAGE });
    });
    this.pagination = new Pagination((page) => {
      this.changeQuery({ page });
      this.scrollToToolbar();
    });

    this.toolbar.append(this.sortSelect.element);
    this.results.after(this.pagination.element);

    this.categoriesLoader = new AsyncContent<Category[]>({
      container: this.categoriesBlock,
      load: fetchCategories,
      renderSkeleton: chipsSkeletonHtml,
      render: (categories): void => {
        this.setCategories(categories);
      },
      errorTitle: 'Could not load categories',
      retrySuccessText: 'Categories loaded',
    });

    this.gamesLoader = new AsyncContent<GamesResponse>({
      container: this.results,
      load: (signal): Promise<GamesResponse> => fetchGames(this.getQuery(), signal),
      renderSkeleton: cardsSkeletonHtml,
      render: (response): void => {
        this.renderGames(response);
      },
      errorTitle: 'Could not load games',
      retrySuccessText: 'Games loaded',
    });

    // Games wait for the categories, the URL category is checked against them
    this.results.innerHTML = cardsSkeletonHtml();
    this.sortSelect.setValue(DEFAULT_SORT);
    this.bindEvents();
    this.categoriesLoading = this.categoriesLoader.load();
  }

  private bindEvents(): void {
    this.categoriesBlock.addEventListener('click', (event: MouseEvent) => {
      const category = getChipCategory(event.target);

      if (category && category !== this.query?.category) {
        this.changeQuery({ category, page: FIRST_PAGE });
      }
    });
  }

  private getQuery(): GamesQuery {
    return this.query ?? DEFAULT_QUERY;
  }

  // Filter and sort changes reset the page to 1
  private changeQuery(changes: Partial<GamesQuery>): void {
    this.router.updateQuery(toQueryChanges({ ...this.getQuery(), ...changes }));
  }

  private getCategoryLabel(slug: string): string {
    return this.categories?.find((category) => category.slug === slug)?.label ?? capitalize(slug);
  }

  private setCategories(categories: Category[]): void {
    this.categories = categories;
    this.categoriesBlock.innerHTML = chipsHtml(categories);
    updateActiveChip(this.categoriesBlock, this.getQuery().category);
    void this.applyParameters();
  }

  private async applyParameters(): Promise<void> {
    await this.categoriesLoading;

    const slugs = this.categories?.map((category) => category.slug) ?? null;
    const defaultCategory =
      this.categories?.find((category) => category.isDefault)?.slug ?? DEFAULT_CATEGORY;
    const { query, fixes } = parseLibraryQuery(this.parameters, slugs, defaultCategory);

    // Wrong values in the URL are replaced, then the router calls update() again
    if (fixes) {
      this.router.updateQuery(fixes, { replace: true });
      return;
    }

    if (isSameQuery(query, this.query)) {
      return;
    }

    this.query = query;
    updateActiveChip(this.categoriesBlock, query.category);
    this.sortSelect.setValue(query.sort);
    this.pagination.hide();
    await this.gamesLoader.load();
  }

  private renderGames({ data, meta }: GamesResponse): void {
    this.results.innerHTML =
      data.length > 0
        ? `<ul class="library__list">${data
            .map((game) => libraryCardHtml(game, this.getCategoryLabel(game.category)))
            .join('')}</ul>`
        : emptyStateHtml(
            'Data Not Found',
            'There are no games for these filters. Try another category or page.',
          );

    this.pagination.show(this.getQuery().page, meta.totalPages);
  }

  private scrollToToolbar(): void {
    const behavior = matchMedia(REDUCED_MOTION_QUERY).matches ? 'auto' : 'smooth';

    this.toolbar.scrollIntoView({ behavior, block: 'start' });
  }

  public update(parameters: URLSearchParams): void {
    this.parameters = parameters;
    void this.applyParameters();
  }

  public destroy(): void {
    this.categoriesLoader.abort();
    this.gamesLoader.abort();
    this.sortSelect.destroy();
    this.pagination.destroy();
  }
}

export function createLibraryPage(router: Router): View {
  const page = new LibraryPage(router);

  return {
    element: page.element,
    update: (parameters): void => {
      page.update(parameters);
    },
    destroy: (): void => {
      page.destroy();
    },
  };
}

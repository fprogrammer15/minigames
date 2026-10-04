export enum GameSort {
  RatingDesc = 'rating-desc',
  RatingAsc = 'rating-asc',
  NameAsc = 'name-asc',
  NameDesc = 'name-desc',
}

export enum CommentSort {
  Newest = 'newest',
  Oldest = 'oldest',
}

export interface DataResponse<T> {
  data: T;
}

export interface ListResponse<T, M> {
  data: T[];
  meta: M;
}

export interface CollectionMeta {
  totalItems: number;
  description: string;
}

export interface GamesMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CommentsMeta {
  totalComments: number;
  returnedCount: number;
  sort: CommentSort;
}

export interface GamesQuery {
  category: string;
  sort: GameSort;
  page: number;
}

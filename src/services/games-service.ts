import { ApiPath, COMMENTS_LIMIT, LIBRARY_PAGE_SIZE } from '../constants/api';
import {
  type CollectionMeta,
  type CommentsMeta,
  CommentSort,
  type DataResponse,
  type GamesMeta,
  type GamesQuery,
  type ListResponse,
} from '../types/api';
import type { Category, GameCard, GameComment, GameDetails } from '../types/game';
import { request } from './api-client';

export type GamesResponse = ListResponse<GameCard, GamesMeta>;
export type CommentsResponse = ListResponse<GameComment, CommentsMeta>;

function getGamePath(slug: string): string {
  return `${ApiPath.Games}/${encodeURIComponent(slug)}`;
}

export async function fetchFeaturedGames(signal?: AbortSignal): Promise<GameCard[]> {
  const response = await request<GamesResponse>(ApiPath.Games, { featured: true }, signal);

  return response.data;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await request<ListResponse<Category, CollectionMeta>>(
    ApiPath.Categories,
    {},
    signal,
  );

  return response.data;
}

// Filtering, sorting and pagination are done by the server
export function fetchGames(query: GamesQuery, signal?: AbortSignal): Promise<GamesResponse> {
  return request<GamesResponse>(ApiPath.Games, { ...query, limit: LIBRARY_PAGE_SIZE }, signal);
}

export async function fetchGameDetails(slug: string, signal?: AbortSignal): Promise<GameDetails> {
  const response = await request<DataResponse<GameDetails>>(getGamePath(slug), {}, signal);

  return response.data;
}

export function fetchGameComments(slug: string, signal?: AbortSignal): Promise<CommentsResponse> {
  return request<CommentsResponse>(
    `${getGamePath(slug)}${ApiPath.Comments}`,
    { limit: COMMENTS_LIMIT, sort: CommentSort.Newest },
    signal,
  );
}

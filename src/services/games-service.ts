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
import type {
  ApiResponse,
  Category,
  Game,
  GameCard,
  GameComment,
  GameDetails,
} from '../types/game';
import { request } from './api-client';
import gamesData from './mock/all-games-seed.json';

export type GamesResponse = ListResponse<GameCard, GamesMeta>;
export type CommentsResponse = ListResponse<GameComment, CommentsMeta>;

const SLIDER_GAMES_COUNT = 5;

const gamesResponse: ApiResponse<Game[]> = gamesData;

const cardImages = import.meta.glob<string>('../assets/images/games/*-card.jpg', {
  eager: true,
  import: 'default',
  query: '?url',
});

export function getGameImage(slug: string): string {
  return cardImages[`../assets/images/games/${slug}-card.jpg`] ?? '';
}

// The first featured game is in the center, its neighbours are around it
export function getSliderGames(): Game[] {
  const featured = gamesResponse.data.filter((game) => game.featured);
  const centerOffset = Math.floor(SLIDER_GAMES_COUNT / 2);

  return Array.from({ length: SLIDER_GAMES_COUNT }, (_, index) =>
    featured.at((index - centerOffset) % featured.length),
  ).filter((game) => game !== undefined);
}

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

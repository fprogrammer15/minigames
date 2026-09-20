import type { ApiResponse, Game } from '../types/game';
import gamesData from './mock/all-games-seed.json';

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

import { ApiPath } from '../constants/api';
import type { CollectionMeta, ListResponse } from '../types/api';
import type { LeaderboardEntry } from '../types/game';
import { request } from './api-client';

export async function fetchLeaderboard(signal?: AbortSignal): Promise<LeaderboardEntry[]> {
  const response = await request<ListResponse<LeaderboardEntry, CollectionMeta>>(
    ApiPath.Leaderboard,
    {},
    signal,
  );

  return response.data;
}

import { ApiPath } from '../constants/api';
import type { CollectionMeta, ListResponse } from '../types/api';
import type { ApiResponse, LeaderboardEntry } from '../types/game';
import { request } from './api-client';
import leaderboardData from './mock/leaderboard.json';

const leaderboardResponse: ApiResponse<LeaderboardEntry[]> = leaderboardData;

export function getLeaderboard(): LeaderboardEntry[] {
  return leaderboardResponse.data;
}

export async function fetchLeaderboard(signal?: AbortSignal): Promise<LeaderboardEntry[]> {
  const response = await request<ListResponse<LeaderboardEntry, CollectionMeta>>(
    ApiPath.Leaderboard,
    {},
    signal,
  );

  return response.data;
}

import type { ApiResponse, LeaderboardEntry } from '../types/game';
import leaderboardData from './mock/leaderboard.json';

const leaderboardResponse: ApiResponse<LeaderboardEntry[]> = leaderboardData;

export function getLeaderboard(): LeaderboardEntry[] {
  return leaderboardResponse.data;
}

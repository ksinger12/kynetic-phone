import { get } from "./http-client";
import { League } from "./types/league";
import { RoundLeaderboard } from "./types/roundLeaderboard";

export function fetchLeaguesByUserId(userId: string) {
  return get<League[]>(`/api/user/${userId}/leagues`);
}

export function fetchLeagueByLeagueIdAndUserId(leagueId: string, userId: string) {
    return get<League>(`/api/user/${userId}/league/${leagueId}`)
}

export function fetchLeagueRoundLeaderboard(leagueId: string) {
    return get<RoundLeaderboard>(`/api/league/${leagueId}/round-leaderboard`)
}

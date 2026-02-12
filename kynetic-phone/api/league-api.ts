import { get, post } from "./http-client";
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

export function fetchLeaguesByClubId(clubId: string) {
  return get<League[]>(`/api/user/${clubId}/leagues`);
}

export function fetchLeagueByLeagueId(leagueId: string) {
  return get<League>(`/api/league/${leagueId}`);
}

export function joinLeague(leagueId: string, userId: string) {
  return post<League>(`/api/league/${leagueId}/user/${userId}/add`);
}
import { get, post } from "./http-client";
import { CreateTeam } from "./types/createTeam";
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

export function featchLeaguesByClubIdAndStatus(clubId: string, status: string) {
  return get<League[]>(`/api/club/${clubId}/status/${status}`);
}

export function joinLeague(leagueId: string, userId: string, body: CreateTeam) {
  return post<League>(`/api/userId/${userId}/leagueId/${leagueId}/team/create`, body);
}
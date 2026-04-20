import { get, post } from "./http-client";
import { CreateTeam } from "./types/createTeam";
import { League } from "./types/league";
import { LeagueBracket } from "./types/leagueBracket";
import { RoundLeaderboard } from "./types/roundLeaderboard";

export function fetchMyLeagues() {
  return get<League[]>("/api/me/leagues");
}

export function fetchLeaguesByStatus(clubId: string | number, status: string = "OPEN") {
  return get<League[]>(`/api/club/${clubId}/status/${status}`);
}

export function fetchMyLeagueById(leagueId: string | number) {
    return get<League>(`/api/me/league/${leagueId}`)
}

export function fetchLeagueRoundLeaderboard(leagueId: string) {
    return get<RoundLeaderboard>(`/api/league/${leagueId}/round-leaderboard`)
}

export function fetchLeagueByLeagueId(leagueId: string | number) {
  return get<League>(`/api/league/${leagueId}`);
}

export function createTeamForLeague(leagueId: string | number, body: CreateTeam) {
  return post<League>(`/api/league/${leagueId}/team/create`, body);
}
export function joinLeague(leagueId: string, userId: string, body: CreateTeam) {
  return post<League>(`/api/userId/${userId}/leagueId/${leagueId}/team/create`, body);
}

export function fetchLeagueBrackets(leagueId: string | number) {
  return get<LeagueBracket[]>(`/api/league/${leagueId}/brackets`)
}

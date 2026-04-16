import { get } from "./http-client";
import { Team } from "./types/team";

export function fetchLeagueLeaderboard(leagueId: string | number) {
    return get<Team[]>(`/api/league/${leagueId}/leaderboard`)
}

export function fetchUserLeagueTeam(leagueId: string | number) {
    return get<Team>(`/api/league/${leagueId}/team`)
}


import { get } from "./http-client";
import { Team } from "./types/team";

export function fetchLeagueLeaderboard(leagueId: string) {
    return get<Team[]>(`/api/league/${leagueId}/leaderboard`)
}


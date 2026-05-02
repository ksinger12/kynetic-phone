import { get } from "./http-client";
import { Team } from "./types/team";
import { UserTeamDto } from "./types/userTeamDto";

export function fetchLeagueLeaderboard(leagueId: string | number) {
    return get<Team[]>(`/api/league/${leagueId}/leaderboard`)
}

export function fetchUserLeagueTeam(leagueId: string | number) {
    return get<UserTeamDto>(`/api/me/teams/${leagueId}`)
}


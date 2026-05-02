import { get } from "./http-client";
import { Team } from "./types/team";
import { UserTeam } from "./types/userTeam";

export function fetchLeagueLeaderboard(leagueId: string | number) {
    return get<Team[]>(`/api/league/${leagueId}/leaderboard`)
}

// export function fetchUserLeagueTeam(leagueId: string | number) {
//     return get<UserTeam>(`/api/me/teams/${leagueId}`)
// }


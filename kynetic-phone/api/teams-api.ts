import { UserTeam } from "./types/userTeam";
import { get } from "./http-client";

export async function fetchTeamById(teamId: string | number) {
    return get<UserTeam>(`/api/team/${teamId}`)
}

export async function fetchMyTeams() {
    return get<UserTeam[]>("/api/me/teams")
}

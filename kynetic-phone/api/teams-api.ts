import { UserTeam } from "./types/userTeam";
import { get } from "./http-client";

export async function fetchTeamById(teamId: string) {
    return get<UserTeam>(`/api/team/${teamId}`)
}

export async function fetchTeamsByUserId(userId: string) {
    return get<UserTeam[]>(`/api/user/${userId}/teams`)
}

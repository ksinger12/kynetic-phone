import { get } from "./http-client";
import { League } from "./types/league";

export function fetchLeaguesByUserId(userId: string) {
  return get<League[]>(`/api/user/${userId}/leagues`);
}

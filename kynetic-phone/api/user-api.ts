import { get } from "./http-client";
import { User } from "./types/user";

export async function fetchUserByUserId(userId: string) {
    return get<User>(`/api/user/${userId}`)
}
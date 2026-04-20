import { get } from "./http-client";
import { User } from "./types/user";

export async function fetchUserByUserId(userId: string | number) {
    return get<User>(`/api/user/${userId}`)
}
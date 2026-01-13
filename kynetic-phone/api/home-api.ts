import { get } from "./http-client";
import { MenuBarItem } from "./types/menu";

export function fetchMenuBarData(userId: string) {
  return get<MenuBarItem[]>(`/api/user/${userId}/menu`);
}

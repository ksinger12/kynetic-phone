import { get } from "./http-client";
import { MenuBarItem } from "./types/menu";

export function fetchMyMenuBarData() {
  return get<MenuBarItem[]>("/api/me/menu");
}

import { post, get } from "./http-client";
import {
  RegisterRequest,
  LoginRequest,
  AuthUser,
  ChangePasswordRequest,
} from "./types/auth";

export function registerUser(
  body: RegisterRequest
): Promise<{ userId: string } | void> {
  return post<{ userId: string }, RegisterRequest>("/api/auth/register", body);
}

export function loginUser(body: LoginRequest): Promise<AuthUser> {
  return post<AuthUser, LoginRequest>("/api/auth/login", body) as Promise<AuthUser>;
}

export function fetchCurrentSession(): Promise<AuthUser> {
  return get<AuthUser>("/api/auth/me");
}

export function changePassword(body: ChangePasswordRequest): Promise<void> {
  return post<void, ChangePasswordRequest>("/api/auth/change-password", body) as Promise<void>;
}

export function logoutUser(): Promise<void> {
  return post<void>("/api/auth/logout") as Promise<void>;
}

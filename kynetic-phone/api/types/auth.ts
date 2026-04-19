export type AuthRole = "ADMIN" | "CLUB_ADMIN" | "CLUB_USER";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  roles: AuthRole[];
  mustChangePassword: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

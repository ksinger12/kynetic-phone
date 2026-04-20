export type AuthRole = "ADMIN" | "CLUB_ADMIN" | "CLUB_USER";

export interface UserClubSummary {
  clubId: number;
  clubName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  roles: AuthRole[];
  clubs: UserClubSummary[];
  mustChangePassword: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

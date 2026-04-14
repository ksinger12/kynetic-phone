export type AuthRole = "ADMIN" | "CLUB_ADMIN" | "CLUB_USER";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  password: string;
  clubs: {
    clubId: number | null;
    memberNumber: string;
  }[];
}

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

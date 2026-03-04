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
  identifier: string; // username or email
  password: string;
}

export interface AuthResponse {
  userId: string;
  token: string;
  clubs: {
    clubId: string;
    clubName: string;
  }[];
}

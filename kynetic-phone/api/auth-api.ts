// POST /api/auth/register
// body: { email, password, clubs[] }
// returns: { userId, clubs[] }

// async function registerUser() {}

// POST /api/auth/login
// body: { email, password }
// returns: { userId, clubs[] }

// async function loginUser() {}

// GET /api/users/{userId}
// returns full user profile

// async function fetchUser() {}


import { RegisterRequest, LoginRequest, AuthResponse } from "./types/auth";

// MOCK REGISTER
export async function registerUser(
  body: RegisterRequest
): Promise<{ userId: string }> {
  console.log("POST /api/auth/register", body);

  return new Promise((resolve) =>
    setTimeout(() => resolve({ userId: "1" }), 800)
  );
}

// MOCK USERNAME CHECK
export async function checkUsernameAvailable(
  username: string
): Promise<{ available: boolean }> {
  console.log("GET /api/auth/username-available?username=", username);

  return new Promise((resolve) =>
    setTimeout(() => resolve({ available: username !== "existinguser" }), 400)
  );
}

// MOCK LOGIN
export async function loginUser(
  body: LoginRequest
): Promise<AuthResponse> {
  console.log("POST /api/auth/login", body);

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          userId: "1",
          token: "mock-jwt-token",
          clubs: [
            { clubId: "1", clubName: "Cedar Brae Golf Club" }, // if no club submitted, should be: clubs: [{ clubId: null, memberNumber: "" }]
          ],
        }),
      800
    )
  );// TODO: validate member number against club records in backend
}

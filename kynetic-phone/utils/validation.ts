export function validateUsername(username: string): string | null {
  const regex = /^[a-zA-Z0-9]{8,}$/;

  if (!regex.test(username)) {
    return "Username must be at least 8 characters and contain only letters and numbers.";
  }

  return null;
}

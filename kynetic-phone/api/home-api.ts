export function fetchHomeSummary() {
  // Mock response — replace later
  return Promise.resolve({
    user: {
      id: 1,
      name: "Admin User",
      role: "ADMIN",
    },
    leagues: 3,
    teams: 12,
    lastUpdated: "2026-01-01T12:00:00Z",
  });
}

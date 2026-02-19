import { TeamData } from "./types/teamData";

/**
 * 🔥 MOCK
 * Used by teams.tsx
 * Returns summary list of teams for user
 */
export async function fetchTeamsByUserId(
  userId: string
): Promise<TeamData[]> {
  console.warn("MOCK fetchTeamsByUserId:", userId);

  return Promise.resolve([
    {
      teamId: 1,
      leagueId: 1,
      teamName: "Cedar Brae A",
      clubName: "Cedar Brae Golf Club",
      sportName: "Golf",
      leagueName: "Men's Summer League",
      points: 128,
      rank: 2,
    },
    {
      teamId: 2,
      leagueId: 2,
      teamName: "North Squad",
      clubName: "Cedar Brae Golf Club",
      sportName: "Golf",
      leagueName: "Fall Invitational",
      points: 94,
      rank: 5,
    },
  ]);
}

/**
 * 🔥 MOCK
 * Used by /teams/[teamId]
 * Returns single team (for now same shape)
 */
export async function fetchTeamById(
  teamId: string
): Promise<TeamData> {
  console.warn("MOCK fetchTeamById:", teamId);

  return Promise.resolve({
    teamId: Number(teamId),
    leagueId: 1,
    teamName: "Cedar Brae A",
    clubName: "Cedar Brae Golf Club",
    sportName: "Golf",
    leagueName: "Men's Summer League",
    points: 128,
    rank: 2,
  });
}

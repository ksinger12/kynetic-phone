export interface Team {
  id: number;
  leagueId: number;
  userId: number;
  teamName: string;
  teamSlogan: string;
  players: object[]; // just contains objects of player ids. Might evolve
}

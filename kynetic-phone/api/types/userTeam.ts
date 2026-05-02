import { Player } from "./player";

export type UserTeam = {
  teamId: number;
  leagueId: number;
  teamName: string;
  clubName: string;
  sportName: string;
  leagueName: string;
  points: number;
  rank: number;
  players: Player[];
};

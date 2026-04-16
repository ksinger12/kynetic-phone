import { Bracket } from "./bracket";
import { BracketPlayer } from "./bracketPlayer";

export interface LeagueBracket {
  bracket: Bracket;
  players: BracketPlayer[];
}

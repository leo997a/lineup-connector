
import { barcelona } from "../data/barcelona";
import { formations } from "../data/formations";
import { LineupData, Player } from "../types/players";

/**
 * Creates a custom lineup with specific players
 * @param formationName The formation to use
 * @param goalkeeperIds IDs of selected goalkeepers
 * @param defenderIds IDs of selected defenders
 * @param midfielderIds IDs of selected midfielders
 * @param forwardIds IDs of selected forwards
 * @returns A custom lineup with the selected players
 */
export const createCustomLineup = (
  formationName: string, 
  goalkeeperIds: string[], 
  defenderIds: string[], 
  midfielderIds: string[], 
  forwardIds: string[]
): LineupData => {
  // Find the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Helper function to find players by IDs
  const findPlayersByIds = (ids: string[]): Player[] => {
    return ids.map(id => {
      const player = barcelona.players.find(p => p.id === id);
      if (!player) {
        console.warn(`Player with ID ${id} not found`);
      }
      return player;
    }).filter(player => player !== undefined) as Player[];
  };
  
  // Create lineup with selected players
  const lineup: LineupData = {
    formation,
    goalkeeper: findPlayersByIds(goalkeeperIds),
    defense: findPlayersByIds(defenderIds),
    midfield: findPlayersByIds(midfielderIds),
    attack: findPlayersByIds(forwardIds)
  };
  
  return lineup;
};

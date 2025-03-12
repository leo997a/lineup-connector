
import { barcelona } from "../data/barcelona";
import { formations } from "../data/formations";
import { Formation, LineupData, Player } from "../types/players";

// This function simulates fetching data from an API
export const fetchLineup = async (formationName: string = "4-3-3"): Promise<LineupData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Filter players by position
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  // Create a lineup with the best players in each position (simplified logic)
  const lineup: LineupData = {
    formation,
    goalkeeper: [goalkeepers[0]],
    defense: defenders.slice(0, formation.lines[0]),
    midfield: midfielders.slice(0, formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0),
    attack: forwards.slice(0, formation.lines[formation.lines.length - 1])
  };
  
  return lineup;
};

// This function simulates fetching data from fotmob or similar service
export const fetchLineupFromUrl = async (url: string, formationName: string = "4-3-3"): Promise<LineupData> => {
  console.log("Fetching lineup from URL:", url);
  
  // In a real implementation, this would fetch data from the URL
  // For now, we'll simulate it using our local data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Find the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Simulating different lineup based on URL parameter
  // In real implementation, this would parse the actual response from fotmob
  const isSpecialLineup = url.includes("special");
  
  // Filter players by position
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  // Create a lineup with selected players
  // If URL contains "special", we'll create a different lineup
  const lineup: LineupData = {
    formation,
    goalkeeper: [isSpecialLineup ? goalkeepers[1] : goalkeepers[0]],
    defense: defenders.slice(isSpecialLineup ? 2 : 0, isSpecialLineup ? 2 + formation.lines[0] : formation.lines[0]),
    midfield: midfielders.slice(isSpecialLineup ? 1 : 0, isSpecialLineup ? 1 + (formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0) : (formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0)),
    attack: forwards.slice(isSpecialLineup ? 1 : 0, isSpecialLineup ? 1 + formation.lines[formation.lines.length - 1] : formation.lines[formation.lines.length - 1])
  };
  
  return lineup;
};

// Helper function to create a custom lineup
export const createCustomLineup = (
  formationName: string, 
  goalkeeperIds: string[], 
  defenderIds: string[], 
  midfielderIds: string[], 
  forwardIds: string[]
): LineupData => {
  // Find the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Helper function to find players by ids
  const findPlayersByIds = (ids: string[]): Player[] => {
    return ids.map(id => {
      const player = barcelona.players.find(p => p.id === id);
      if (!player) {
        console.warn(`Player with id ${id} not found`);
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

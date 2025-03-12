
import { barcelona } from "../data/barcelona";
import { formations } from "../data/formations";
import { Formation, LineupData, Player } from "../types/players";

/**
 * Fetches a specific lineup for a predefined match ID
 * @param matchId The ID of the match to fetch
 * @param formationName The formation to use if no specific match is found
 * @returns The lineup data for the match
 */
export const fetchSpecificMatchLineup = async (
  matchId: string, 
  formationName: string = "4-3-3"
): Promise<LineupData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Determine the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Helper function to find players by name
  const findPlayerByName = (namePattern: string): Player | undefined => {
    return barcelona.players.find(player => 
      player.name.toLowerCase().includes(namePattern.toLowerCase())
    );
  };
  
  // Match-specific lineups
  // Lineup for Barcelona vs Benfica (ID 4737555)
  if (matchId === "4737555") {
    const matchFormation = formations.find(f => f.name === "4-3-3") || formation;
    
    const lineup: LineupData = {
      formation: matchFormation,
      goalkeeper: [findPlayerByName("ter stegen") || barcelona.players.find(p => p.position === "GK")!],
      defense: [
        findPlayerByName("koundé") || findPlayerByName("kounde") || barcelona.players.find(p => p.id === "kounde")!,
        findPlayerByName("araújo") || findPlayerByName("araujo") || barcelona.players.find(p => p.id === "araujo")!,
        findPlayerByName("martínez") || findPlayerByName("martinez") || barcelona.players.find(p => p.id === "inigo")!,
        findPlayerByName("balde") || barcelona.players.find(p => p.id === "balde")!
      ],
      midfield: [
        findPlayerByName("de jong") || barcelona.players.find(p => p.id === "de-jong")!,
        findPlayerByName("pedri") || barcelona.players.find(p => p.id === "pedri")!,
        findPlayerByName("olmo") || barcelona.players.find(p => p.id === "olmo")!
      ],
      attack: [
        findPlayerByName("yamal") || barcelona.players.find(p => p.id === "yamal")!,
        findPlayerByName("lewandowski") || barcelona.players.find(p => p.id === "lewandowski")!,
        findPlayerByName("raphinha") || barcelona.players.find(p => p.id === "raphinha")!
      ]
    };
    
    // Make sure all arrays contain players
    // Replace any undefined values with players in appropriate positions
    lineup.goalkeeper = lineup.goalkeeper.filter(p => p !== undefined);
    lineup.defense = lineup.defense.filter(p => p !== undefined);
    lineup.midfield = lineup.midfield.filter(p => p !== undefined);
    lineup.attack = lineup.attack.filter(p => p !== undefined);
    
    // Fill in any missing positions
    if (lineup.goalkeeper.length === 0) {
      lineup.goalkeeper = [barcelona.players.find(p => p.position === "GK")!];
    }
    
    // Complete defense if needed
    while (lineup.defense.length < matchFormation.lines[0]) {
      const missingDefenders = barcelona.players
        .filter(p => p.position === "DF" && !lineup.defense.some(d => d.id === p.id))
        .slice(0, matchFormation.lines[0] - lineup.defense.length);
      
      lineup.defense = [...lineup.defense, ...missingDefenders];
    }
    
    // Complete midfield if needed
    const midfieldCount = matchFormation.lines.length > 1 
      ? matchFormation.lines.reduce((sum, count, index) => index > 0 && index < matchFormation.lines.length - 1 ? sum + count : sum, 0) 
      : 0;
    
    while (lineup.midfield.length < midfieldCount) {
      const missingMidfielders = barcelona.players
        .filter(p => p.position === "MF" && !lineup.midfield.some(m => m.id === p.id))
        .slice(0, midfieldCount - lineup.midfield.length);
      
      lineup.midfield = [...lineup.midfield, ...missingMidfielders];
    }
    
    // Complete attack if needed
    while (lineup.attack.length < matchFormation.lines[matchFormation.lines.length - 1]) {
      const missingForwards = barcelona.players
        .filter(p => p.position === "FW" && !lineup.attack.some(a => a.id === p.id))
        .slice(0, matchFormation.lines[matchFormation.lines.length - 1] - lineup.attack.length);
      
      lineup.attack = [...lineup.attack, ...missingForwards];
    }
    
    return lineup;
  }
  
  // If no specific match was found, return null to fall back to default lineup
  return createDefaultLineup(formation);
};

/**
 * Creates a default lineup based on the provided formation
 * @param formation The formation to use
 * @returns A default lineup with players assigned by position
 */
const createDefaultLineup = (formation: Formation): LineupData => {
  // Filter players by position
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  return {
    formation,
    goalkeeper: [goalkeepers[0]],
    defense: defenders.slice(0, formation.lines[0]),
    midfield: midfielders.slice(0, formation.lines.length > 1 
      ? formation.lines.reduce((sum, count, index) => 
          index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) 
      : 0),
    attack: forwards.slice(0, formation.lines[formation.lines.length - 1])
  };
};

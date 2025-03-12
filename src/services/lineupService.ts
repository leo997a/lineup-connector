
import { formations } from "../data/formations";
import { LineupData } from "../types/players";
import { extractMatchIdFromUrl } from "../utils/urlUtils";
import { fetchSpecificMatchLineup } from "./matchLineupService";
import { createCustomLineup } from "./customLineupService";

/**
 * Fetches a default lineup based on formation
 * @param formationName The formation to use
 * @returns The lineup data
 */
export const fetchLineup = async (formationName: string = "4-3-3"): Promise<LineupData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find the requested formation
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // Since we need a default lineup, we can use the match lineup service with a non-existent match ID
  return fetchSpecificMatchLineup("default", formationName);
};

/**
 * Fetches a lineup from a FotMob URL
 * @param url FotMob URL or match ID
 * @param formationName Fallback formation if specific match not found
 * @returns The lineup data
 */
export const fetchLineupFromUrl = async (url: string, formationName: string = "4-3-3"): Promise<LineupData> => {
  console.log("Fetching lineup from URL:", url);
  
  // Extract match ID from URL
  const matchId = extractMatchIdFromUrl(url);
  console.log("Extracted match ID:", matchId);
  
  // Fetch lineup for the specific match
  return fetchSpecificMatchLineup(matchId, formationName);
};

// Re-export createCustomLineup for use in other files
export { createCustomLineup } from "./customLineupService";

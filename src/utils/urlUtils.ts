
/**
 * Extracts a match ID from a FotMob URL or other input string
 * @param url FotMob URL or match ID string
 * @returns The extracted match ID
 */
export const extractMatchIdFromUrl = (url: string): string => {
  // If the input is just numbers, consider it a match ID
  if (url.match(/^\d+$/)) {
    return url;
  }
  
  // Extract match ID from the end of the URL (contains numbers)
  // Check for full FotMob URL like https://www.fotmob.com/matches/barcelona-vs-benfica/2sv14h#4737555:tab=lineup
  
  // Try to extract the number after # and before :
  if (url.includes("#")) {
    const afterHash = url.split("#")[1];
    if (afterHash) {
      if (afterHash.includes(":")) {
        const matchId = afterHash.split(":")[0];
        if (matchId && matchId.match(/^\d+$/)) {
          return matchId;
        }
      } else if (afterHash.match(/^\d+$/)) {
        return afterHash;
      }
    }
  }
  
  // Try to extract any long number (match ID is usually longer than 5 digits)
  const matches = url.match(/\d{5,}/g);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  // If we can't extract an ID, return the URL as is
  console.log("Could not extract match ID from URL:", url);
  return url;
};

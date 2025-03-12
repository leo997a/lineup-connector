import { useEffect, useState } from "react";
import { LineupData } from "../types/players";
import GoalkeeperPosition from "./GoalkeeperPosition";
import PlayerPosition from "./PlayerPosition";

interface FormationDisplayProps {
  lineup: LineupData;
}

const FormationDisplay: React.FC<FormationDisplayProps> = ({ lineup }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate positions based on formation
  const calculatePositions = () => {
    const { formation } = lineup;
    const positions = {
      defense: [] as { x: number, y: number }[],
      midfield: [] as { x: number, y: number }[],
      attack: [] as { x: number, y: number }[]
    };
    
    // Calculate defense positions
    const defenseCount = formation.lines[0];
    for (let i = 0; i < defenseCount; i++) {
      const x = 100 / (defenseCount + 1) * (i + 1);
      positions.defense.push({ x, y: 25 });
    }
    
    // Calculate midfield positions (could be multiple lines)
    let midfieldLines = 0;
    let midfieldPlayersPerLine: number[] = [];
    
    // Extract midfield lines from formation
    if (formation.lines.length > 2) {
      midfieldLines = formation.lines.length - 2;
      midfieldPlayersPerLine = formation.lines.slice(1, -1);
    }
    
    let midfieldY = 45;
    let midfieldPlayersProcessed = 0;
    
    for (let i = 0; i < midfieldLines; i++) {
      const playersInThisLine = midfieldPlayersPerLine[i];
      midfieldY = 45 + (i * 15);
      
      for (let j = 0; j < playersInThisLine; j++) {
        const x = 100 / (playersInThisLine + 1) * (j + 1);
        positions.midfield.push({ x, y: midfieldY });
        midfieldPlayersProcessed++;
      }
    }
    
    // If no midfield lines were calculated but we have midfielders, place them in one line
    if (midfieldLines === 0 && lineup.midfield.length > 0) {
      const midfieldCount = lineup.midfield.length;
      for (let i = 0; i < midfieldCount; i++) {
        const x = 100 / (midfieldCount + 1) * (i + 1);
        positions.midfield.push({ x, y: 45 });
      }
    }
    
    // Calculate attack positions
    const attackCount = formation.lines[formation.lines.length - 1];
    for (let i = 0; i < attackCount; i++) {
      const x = 100 / (attackCount + 1) * (i + 1);
      positions.attack.push({ x, y: 75 });
    }
    
    return positions;
  };
  
  const positions = calculatePositions();
  
  return (
    <div className={`w-full h-full pitch relative ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
      <div className="pitch-mask"></div>
      
      {/* Display goalkeeper */}
      {lineup.goalkeeper.length > 0 && (
        <GoalkeeperPosition player={lineup.goalkeeper[0]} />
      )}
      
      {/* Display defenders */}
      {lineup.defense.map((player, index) => {
        if (index < positions.defense.length) {
          return (
            <PlayerPosition
              key={`defense-${player.id}`}
              player={player}
              x={positions.defense[index].x}
              y={positions.defense[index].y}
              delay={0.1 * index}
            />
          );
        }
        return null;
      })}
      
      {/* Display midfielders */}
      {lineup.midfield.map((player, index) => {
        if (index < positions.midfield.length) {
          return (
            <PlayerPosition
              key={`midfield-${player.id}`}
              player={player}
              x={positions.midfield[index].x}
              y={positions.midfield[index].y}
              delay={0.2 + (0.1 * index)}
            />
          );
        }
        return null;
      })}
      
      {/* Display attackers */}
      {lineup.attack.map((player, index) => {
        if (index < positions.attack.length) {
          return (
            <PlayerPosition
              key={`attack-${player.id}`}
              player={player}
              x={positions.attack[index].x}
              y={positions.attack[index].y}
              delay={0.4 + (0.1 * index)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default FormationDisplay;

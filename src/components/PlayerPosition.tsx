
import { Player } from "../types/players";

interface PlayerPositionProps {
  player: Player;
  x: number; // percentage from left
  y: number; // percentage from bottom
  delay?: number; // animation delay in seconds
}

const PlayerPosition: React.FC<PlayerPositionProps> = ({ player, x, y, delay = 0 }) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 player-float" 
      style={{ 
        left: `${x}%`, 
        bottom: `${y}%`, 
        animationDelay: `${delay}s` 
      }}
    >
      <div className="player-circle">
        {player.image ? (
          <div className="relative w-full h-full">
            <img 
              src={player.image} 
              alt={player.name} 
              className="player-image"
              onError={(e) => {
                console.log(`Failed to load image for player: ${player.name}`);
                (e.target as HTMLImageElement).src = 'https://www.fcbarcelona.com/photo-resources/2022/08/02/2d5461af-13fb-4a92-a7e8-af32eeabde50/Mini_CrestFCB.jpg?width=670&height=790';
                // Change to club logo on error
              }}
            />
            {player.number && (
              <div className="absolute -bottom-1 -right-1 bg-barcelona-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {player.number}
              </div>
            )}
          </div>
        ) : (
          <div className="player-jersey">
            {player.number || "#"}
          </div>
        )}
        <div className="player-name">
          {player.name}
          {player.number && <span className="player-number">#{player.number}</span>}
        </div>
      </div>
    </div>
  );
};

export default PlayerPosition;

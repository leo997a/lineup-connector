
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
          <img 
            src={player.image} 
            alt={player.name} 
            className="player-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
        ) : (
          <div className="player-jersey">
            {player.number}
          </div>
        )}
        <div className="player-name">{player.name}</div>
      </div>
    </div>
  );
};

export default PlayerPosition;


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
              console.log(`Failed to load image for player: ${player.name}`);
              (e.target as HTMLImageElement).src = 'https://fcbarcelona-static-files.s3.amazonaws.com/fcbarcelona/photo/2018/09/21/3c5f4799-13f0-4be9-8850-df60a2a7d1a4/01-LogoFCB-Vertical.jpg';
            }}
          />
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

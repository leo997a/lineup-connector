
import { Player } from "../types/players";

interface GoalkeeperPositionProps {
  player: Player;
}

const GoalkeeperPosition: React.FC<GoalkeeperPositionProps> = ({ player }) => {
  return (
    <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 z-10 player-float" style={{ animationDelay: '0.3s' }}>
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

export default GoalkeeperPosition;

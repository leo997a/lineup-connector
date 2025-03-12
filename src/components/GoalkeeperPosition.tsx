
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
              console.log(`Failed to load image for goalkeeper: ${player.name}`);
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

export default GoalkeeperPosition;

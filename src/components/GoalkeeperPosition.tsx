
import { Player } from "../types/players";

interface GoalkeeperPositionProps {
  player: Player;
}

const GoalkeeperPosition: React.FC<GoalkeeperPositionProps> = ({ player }) => {
  return (
    <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 z-10 player-float" style={{ animationDelay: '0.3s' }}>
      <div className="player-circle">
        {player.image ? (
          <div className="relative w-full h-full">
            <img 
              src={player.image} 
              alt={player.name} 
              className="player-image"
              onError={(e) => {
                console.log(`Failed to load image for goalkeeper: ${player.name}`);
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

export default GoalkeeperPosition;

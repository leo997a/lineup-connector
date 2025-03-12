
import { Team } from "../types/players";

interface TeamInfoProps {
  team: Team;
  formation: string;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ team, formation }) => {
  return (
    <div className="flex items-center space-x-3 py-3 px-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md animate-slide-down">
      <img 
        src={team.logo} 
        alt={team.name} 
        className="w-12 h-12 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Logo';
        }}
      />
      <div>
        <h2 className="font-semibold text-lg">{team.name}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Formation:</span>
          <span className="text-sm font-bold">{formation}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;

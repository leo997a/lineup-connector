
import { useEffect, useState } from "react";
import { LineupData } from "../types/players";
import GoalkeeperPosition from "./GoalkeeperPosition";
import PlayerPosition from "./PlayerPosition";

interface FormationDisplayProps {
  lineup: LineupData;
  fieldColor?: string; // لون أرضية الملعب
  linesColor?: string; // لون خطوط الملعب
}

const FormationDisplay: React.FC<FormationDisplayProps> = ({ 
  lineup,
  fieldColor = "#006428", // لون افتراضي للملعب (أخضر)
  linesColor = "#ffffff"  // لون افتراضي للخطوط (أبيض)
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // إضافة تأخير صغير لتفعيل الرسوم المتحركة
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // حساب المواقع بناءً على التشكيل
  const calculatePositions = () => {
    const { formation } = lineup;
    const positions = {
      defense: [] as { x: number, y: number }[],
      midfield: [] as { x: number, y: number }[],
      attack: [] as { x: number, y: number }[]
    };
    
    // حساب مواقع الدفاع
    const defenseCount = formation.lines[0];
    for (let i = 0; i < defenseCount; i++) {
      const x = 100 / (defenseCount + 1) * (i + 1);
      positions.defense.push({ x, y: 25 });
    }
    
    // حساب مواقع الوسط (يمكن أن تكون خطوط متعددة)
    let midfieldLines = 0;
    let midfieldPlayersPerLine: number[] = [];
    
    // استخراج خطوط الوسط من التشكيل
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
    
    // إذا لم يتم حساب خطوط الوسط ولكن لدينا لاعبي وسط، ضعهم في خط واحد
    if (midfieldLines === 0 && lineup.midfield.length > 0) {
      const midfieldCount = lineup.midfield.length;
      for (let i = 0; i < midfieldCount; i++) {
        const x = 100 / (midfieldCount + 1) * (i + 1);
        positions.midfield.push({ x, y: 45 });
      }
    }
    
    // حساب مواقع الهجوم
    const attackCount = formation.lines[formation.lines.length - 1];
    for (let i = 0; i < attackCount; i++) {
      const x = 100 / (attackCount + 1) * (i + 1);
      positions.attack.push({ x, y: 75 });
    }
    
    return positions;
  };
  
  const positions = calculatePositions();
  
  // أنماط CSS المضمنة للملعب
  const pitchStyle = {
    background: `
      linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, #004d98, ${fieldColor})
    `,
    backgroundSize: '20px 20px, 20px 20px, 100% 100%',
  };
  
  return (
    <div 
      className={`w-full h-full pitch relative ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`} 
      style={pitchStyle}
    >
      <div className="pitch-mask"></div>
      
      {/* رسم الخطوط الرئيسية للملعب */}
      <div className="absolute inset-0 flex flex-col">
        {/* منطقة المرمى */}
        <div className="absolute w-1/5 h-8 border-2 bottom-0 left-1/2 transform -translate-x-1/2" style={{ borderColor: linesColor, borderBottom: 'none' }}></div>
        
        {/* دائرة منتصف الملعب */}
        <div className="absolute w-24 h-24 rounded-full border-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ borderColor: linesColor }}></div>
        
        {/* خط منتصف الملعب */}
        <div className="absolute w-full h-0.5 top-1/2 transform -translate-y-1/2" style={{ backgroundColor: linesColor }}></div>
      </div>
      
      {/* عرض حارس المرمى */}
      {lineup.goalkeeper.length > 0 && (
        <GoalkeeperPosition player={lineup.goalkeeper[0]} />
      )}
      
      {/* عرض المدافعين */}
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
      
      {/* عرض لاعبي الوسط */}
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
      
      {/* عرض المهاجمين */}
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

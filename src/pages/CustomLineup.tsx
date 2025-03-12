
import { useState, useEffect } from "react";
import { barcelona } from "../data/barcelona";
import { createCustomLineup } from "../services/lineupService";
import { LineupData, Player } from "../types/players";
import FormationDisplay from "../components/FormationDisplay";
import TeamInfo from "../components/TeamInfo";
import FormationSelector from "../components/FormationSelector";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, UserPlus, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CustomLineup = () => {
  const [lineup, setLineup] = useState<LineupData | null>(null);
  const [formation, setFormation] = useState("4-3-3");
  const [selectedGoalkeepers, setSelectedGoalkeepers] = useState<string[]>([]);
  const [selectedDefenders, setSelectedDefenders] = useState<string[]>([]);
  const [selectedMidfielders, setSelectedMidfielders] = useState<string[]>([]);
  const [selectedForwards, setSelectedForwards] = useState<string[]>([]);
  const [fieldColor, setFieldColor] = useState("#006428");
  const [linesColor, setLinesColor] = useState("#ffffff");
  const [showColorPanel, setShowColorPanel] = useState(false);
  const { toast } = useToast();

  // تصفية اللاعبين حسب المركز
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");

  useEffect(() => {
    // إعادة تعيين الاختيارات عند تغيير التشكيل
    const selectedFormation = formation.split('-').map(Number);
    
    // الاحتفاظ فقط بحارس المرمى الأول المحدد
    if (selectedGoalkeepers.length === 0 && goalkeepers.length > 0) {
      setSelectedGoalkeepers([goalkeepers[0].id]);
    }
    
    // تحديد المدافعين حسب متطلبات التشكيل
    if (selectedDefenders.length > selectedFormation[0]) {
      setSelectedDefenders(selectedDefenders.slice(0, selectedFormation[0]));
    }
    
    // حساب عدد لاعبي الوسط بناءً على التشكيل
    let midfieldersCount = 0;
    if (selectedFormation.length > 2) {
      for (let i = 1; i < selectedFormation.length - 1; i++) {
        midfieldersCount += selectedFormation[i];
      }
    }
    
    // تحديد لاعبي الوسط حسب متطلبات التشكيل
    if (selectedMidfielders.length > midfieldersCount) {
      setSelectedMidfielders(selectedMidfielders.slice(0, midfieldersCount));
    }
    
    // تحديد المهاجمين حسب متطلبات التشكيل
    if (selectedForwards.length > selectedFormation[selectedFormation.length - 1]) {
      setSelectedForwards(selectedForwards.slice(0, selectedFormation[selectedFormation.length - 1]));
    }
  }, [formation]);

  useEffect(() => {
    updateLineup();
  }, [selectedGoalkeepers, selectedDefenders, selectedMidfielders, selectedForwards, formation]);

  const updateLineup = () => {
    try {
      const data = createCustomLineup(
        formation,
        selectedGoalkeepers,
        selectedDefenders,
        selectedMidfielders,
        selectedForwards
      );
      setLineup(data);
    } catch (error) {
      console.error("خطأ في إنشاء التشكيلة المخصصة:", error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التشكيلة المخصصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
  };

  const togglePlayer = (
    playerId: string,
    selectedPlayers: string[],
    setSelectedPlayers: React.Dispatch<React.SetStateAction<string[]>>,
    maxSelections: number
  ) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedPlayers.length >= maxSelections) {
        toast({
          title: "تم تجاوز الحد",
          description: `يمكنك تحديد ${maxSelections} لاعبين فقط لهذا المركز في تشكيلة ${formation}.`,
          variant: "destructive",
        });
        return;
      }
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const renderPlayerCard = (
    player: Player,
    isSelected: boolean,
    onClick: () => void
  ) => {
    return (
      <div
        key={player.id}
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected
            ? "bg-barcelona-primary/10 border border-barcelona-primary"
            : "hover:bg-gray-100 border border-transparent"
        }`}
        onClick={onClick}
      >
        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Logo';
              }}
            />
          ) : (
            <div className="h-full w-full bg-barcelona-primary flex items-center justify-center text-white font-bold">
              {player.number}
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-barcelona-primary/30 flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-medium truncate" dir="rtl">{player.name}</p>
          <p className="text-xs text-gray-500" dir="rtl">#{player.number} · {player.position}</p>
        </div>
      </div>
    );
  };

  // حساب الحد الأقصى للاختيارات بناءً على التشكيل
  const formationParts = formation.split('-').map(Number);
  const maxDefenders = formationParts[0];
  
  let maxMidfielders = 0;
  if (formationParts.length > 2) {
    for (let i = 1; i < formationParts.length - 1; i++) {
      maxMidfielders += formationParts[i];
    }
  }
  
  const maxForwards = formationParts[formationParts.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-barcelona-primary/5 to-barcelona-secondary/5" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-barcelona-primary to-barcelona-secondary">
            تشكيلة برشلونة المخصصة
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أنشئ تشكيلة برشلونة الخاصة بك عن طريق اختيار اللاعبين والتشكيل
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            {lineup && (
              <TeamInfo team={barcelona} formation={lineup.formation.name} />
            )}
            
            <Card className="p-4 animate-slide-down" style={{ animationDelay: '0.15s' }}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">التشكيل</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowColorPanel(!showColorPanel)}
                  className="flex items-center"
                >
                  <Palette className="h-4 w-4 ml-1" />
                  تخصيص الملعب
                </Button>
              </div>
              
              <FormationSelector
                currentFormation={formation}
                onFormationChange={handleFormationChange}
              />

              {showColorPanel && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-3">
                  <div>
                    <Label htmlFor="fieldColor" className="text-sm">لون الملعب</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        id="fieldColor"
                        type="color"
                        value={fieldColor}
                        onChange={(e) => setFieldColor(e.target.value)}
                        className="w-20 h-8 p-1"
                      />
                      <span className="text-xs text-gray-500 mr-2">{fieldColor}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="linesColor" className="text-sm">لون الخطوط</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        id="linesColor"
                        type="color"
                        value={linesColor}
                        onChange={(e) => setLinesColor(e.target.value)}
                        className="w-20 h-8 p-1"
                      />
                      <span className="text-xs text-gray-500 mr-2">{linesColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
            
            <Card className="animate-slide-down" style={{ animationDelay: '0.25s' }}>
              <Tabs defaultValue="goalkeeper" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="goalkeeper">الحراس ({selectedGoalkeepers.length}/1)</TabsTrigger>
                  <TabsTrigger value="defenders">الدفاع ({selectedDefenders.length}/{maxDefenders})</TabsTrigger>
                  <TabsTrigger value="midfielders">الوسط ({selectedMidfielders.length}/{maxMidfielders})</TabsTrigger>
                  <TabsTrigger value="forwards">الهجوم ({selectedForwards.length}/{maxForwards})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="goalkeeper" className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <ScrollArea className="h-[300px]">
                      {goalkeepers.map(player => (
                        <div key={player.id} className="mb-2">
                          {renderPlayerCard(
                            player,
                            selectedGoalkeepers.includes(player.id),
                            () => togglePlayer(player.id, selectedGoalkeepers, setSelectedGoalkeepers, 1)
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="defenders" className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <ScrollArea className="h-[300px]">
                      {defenders.map(player => (
                        <div key={player.id} className="mb-2">
                          {renderPlayerCard(
                            player,
                            selectedDefenders.includes(player.id),
                            () => togglePlayer(player.id, selectedDefenders, setSelectedDefenders, maxDefenders)
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="midfielders" className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <ScrollArea className="h-[300px]">
                      {midfielders.map(player => (
                        <div key={player.id} className="mb-2">
                          {renderPlayerCard(
                            player,
                            selectedMidfielders.includes(player.id),
                            () => togglePlayer(player.id, selectedMidfielders, setSelectedMidfielders, maxMidfielders)
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </TabsContent>
                
                <TabsContent value="forwards" className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <ScrollArea className="h-[300px]">
                      {forwards.map(player => (
                        <div key={player.id} className="mb-2">
                          {renderPlayerCard(
                            player,
                            selectedForwards.includes(player.id),
                            () => togglePlayer(player.id, selectedForwards, setSelectedForwards, maxForwards)
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="lg:col-span-2 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-xl animate-scale-in">
            {lineup ? (
              <FormationDisplay 
                lineup={lineup} 
                fieldColor={fieldColor}
                linesColor={linesColor}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
                <p className="text-gray-500">قم ببناء التشكيلة باختيار اللاعبين</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="ml-4"
          >
            العودة إلى التشكيلة التلقائية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomLineup;

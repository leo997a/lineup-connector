
import { useState, useEffect } from "react";
import { barcelona } from "../data/barcelona";
import { fetchLineup, fetchLineupFromUrl } from "../services/lineupService";
import { LineupData } from "../types/players";
import FormationDisplay from "../components/FormationDisplay";
import TeamInfo from "../components/TeamInfo";
import FormationSelector from "../components/FormationSelector";
import UrlInput from "../components/UrlInput";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [lineup, setLineup] = useState<LineupData | null>(null);
  const [formation, setFormation] = useState("4-3-3");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFormation(formation);
  }, [formation]);

  const loadFormation = async (formationName: string) => {
    setLoading(true);
    try {
      const data = await fetchLineup(formationName);
      setLineup(data);
    } catch (error) {
      console.error("Error loading formation:", error);
      toast({
        title: "Error",
        description: "Failed to load the formation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
  };

  const handleFetchFromUrl = async (url: string) => {
    setLoading(true);
    try {
      const data = await fetchLineupFromUrl(url, formation);
      setLineup(data);
      toast({
        title: "Success",
        description: "Lineup fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching lineup from URL:", error);
      toast({
        title: "Error",
        description: "Failed to fetch lineup from URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barcelona-primary/5 to-barcelona-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-barcelona-primary to-barcelona-secondary">
            FC Barcelona Formation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualize Barcelona's lineup with different formations or fetch data from FotMob
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-1">
            {lineup && (
              <TeamInfo team={barcelona} formation={lineup.formation.name} />
            )}
            
            <div className="p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md space-y-4 animate-slide-down" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-lg font-semibold">Formation Options</h2>
              <FormationSelector
                currentFormation={formation}
                onFormationChange={handleFormationChange}
              />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Fetch from FotMob</h3>
                <UrlInput onFetchFromUrl={handleFetchFromUrl} />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a FotMob match URL to fetch the lineup data automatically
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md animate-slide-down" style={{ animationDelay: '0.25s' }}>
              <h3 className="text-sm font-medium mb-2">Instructions</h3>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>Select a formation from the dropdown</li>
                <li>Or enter a FotMob URL to fetch lineup data</li>
                <li>Hover over player icons to see details</li>
                <li>The visualization updates in real-time</li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-2 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-xl animate-scale-in">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
                <div className="text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-barcelona-primary/20 border-t-barcelona-primary rounded-full mb-3"></div>
                  <p className="text-sm text-gray-600">Loading formation...</p>
                </div>
              </div>
            ) : lineup ? (
              <FormationDisplay lineup={lineup} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
                <p className="text-gray-500">No formation data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

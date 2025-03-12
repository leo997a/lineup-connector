
import { useState, useEffect } from "react";
import { barcelona } from "../data/barcelona";
import { fetchLineup, fetchLineupFromUrl } from "../services/lineupService";
import { LineupData } from "../types/players";
import FormationDisplay from "../components/FormationDisplay";
import TeamInfo from "../components/TeamInfo";
import FormationSelector from "../components/FormationSelector";
import UrlInput from "../components/UrlInput";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [lineup, setLineup] = useState<LineupData | null>(null);
  const [formation, setFormation] = useState("4-3-3");
  const [loading, setLoading] = useState(true);
  const [fieldColor, setFieldColor] = useState("#006428");
  const [linesColor, setLinesColor] = useState("#ffffff");
  const [showColorPanel, setShowColorPanel] = useState(false);
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
        title: "خطأ",
        description: "فشل في تحميل التشكيل. يرجى المحاولة مرة أخرى.",
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
        title: "تم بنجاح",
        description: "تم جلب التشكيلة بنجاح",
      });
    } catch (error) {
      console.error("Error fetching lineup from URL:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب التشكيلة من الرابط. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barcelona-primary/5 to-barcelona-secondary/5" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-barcelona-primary to-barcelona-secondary">
            تشكيلة برشلونة
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            عرض تشكيلة برشلونة بتشكيلات مختلفة أو جلب البيانات من FotMob
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-1">
            {lineup && (
              <TeamInfo team={barcelona} formation={lineup.formation.name} />
            )}
            
            <Card className="p-4 bg-white shadow-md space-y-4 animate-slide-down" style={{ animationDelay: '0.15s' }}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">خيارات التشكيل</h2>
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
                <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-3">
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
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">جلب من FotMob</h3>
                <UrlInput onFetchFromUrl={handleFetchFromUrl} />
                <p className="text-xs text-gray-500 mt-1">
                  أدخل رابط مباراة من FotMob أو معرف المباراة لجلب بيانات التشكيلة تلقائيًا
                </p>
              </div>
            </Card>
            
            <Card className="p-4 bg-white shadow-md animate-slide-down" style={{ animationDelay: '0.25s' }}>
              <h3 className="text-sm font-medium mb-2">تعليمات</h3>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pr-4">
                <li>اختر تشكيلاً من القائمة المنسدلة</li>
                <li>أو أدخل رابط FotMob لجلب بيانات التشكيلة</li>
                <li>مرر مؤشر الفأرة فوق أيقونات اللاعبين لرؤية التفاصيل</li>
                <li>يتم تحديث العرض المرئي في الوقت الفعلي</li>
                <li>يمكنك تغيير لون الملعب والخطوط</li>
                <li>يمكنك استخدام معرف المباراة بدلاً من الرابط الكامل</li>
              </ul>
            </Card>
          </div>
          
          <div className="md:col-span-2 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-xl animate-scale-in">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
                <div className="text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-barcelona-primary/20 border-t-barcelona-primary rounded-full mb-3"></div>
                  <p className="text-sm text-gray-600">جاري تحميل التشكيل...</p>
                </div>
              </div>
            ) : lineup ? (
              <FormationDisplay 
                lineup={lineup} 
                fieldColor={fieldColor}
                linesColor={linesColor}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
                <p className="text-gray-500">لا توجد بيانات تشكيل متاحة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

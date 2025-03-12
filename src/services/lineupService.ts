
import { barcelona } from "../data/barcelona";
import { formations } from "../data/formations";
import { Formation, LineupData, Player } from "../types/players";

// هذه الدالة تمثل جلب البيانات من API (محاكاة)
export const fetchLineup = async (formationName: string = "4-3-3"): Promise<LineupData> => {
  // محاكاة تأخير API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // البحث عن التشكيل المطلوب
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // تصفية اللاعبين حسب المركز
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  // إنشاء تشكيلة بأفضل اللاعبين في كل مركز (منطق مبسط)
  const lineup: LineupData = {
    formation,
    goalkeeper: [goalkeepers[0]],
    defense: defenders.slice(0, formation.lines[0]),
    midfield: midfielders.slice(0, formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0),
    attack: forwards.slice(0, formation.lines[formation.lines.length - 1])
  };
  
  return lineup;
};

// هذه الدالة تمثل جلب البيانات من FotMob
export const fetchLineupFromUrl = async (url: string, formationName: string = "4-3-3"): Promise<LineupData> => {
  console.log("Fetching lineup from URL:", url);
  
  // استخراج معرف المباراة من الرابط
  let matchId = "";
  
  // التحقق مما إذا كان الرابط يحتوي على معرف المباراة
  if (url.includes("#")) {
    const parts = url.split("#");
    if (parts.length > 1) {
      matchId = parts[1].split(":")[0];
    }
  } else if (url.match(/^\d+$/)) {
    // إذا كان المدخل هو فقط أرقام، فنعتبره معرف المباراة
    matchId = url;
  }
  
  console.log("تم استخراج معرف المباراة:", matchId);
  
  // محاكاة تأخير API
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // في التطبيق الحقيقي، سنستخدم هنا معرف المباراة للاستعلام عن FotMob API
  // سنُحاكي ذلك باستخدام تشكيلة مختلفة بناءً على المعرف
  
  // البحث عن التشكيل المطلوب
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // محاكاة تشكيلة مختلفة بناءً على معرف المباراة
  const useSpecialLineup = matchId.includes("4737555");
  
  // تصفية اللاعبين حسب المركز
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  // إنشاء تشكيلة مع اللاعبين المختارين
  // إذا كان معرف المباراة هو "4737555"، فسننشئ تشكيلة خاصة
  const lineup: LineupData = {
    formation,
    goalkeeper: [useSpecialLineup ? goalkeepers[1] : goalkeepers[0]],
    defense: defenders.slice(useSpecialLineup ? 2 : 0, useSpecialLineup ? 2 + formation.lines[0] : formation.lines[0]),
    midfield: midfielders.slice(useSpecialLineup ? 1 : 0, useSpecialLineup ? 1 + (formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0) : (formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0)),
    attack: forwards.slice(useSpecialLineup ? 1 : 0, useSpecialLineup ? 1 + formation.lines[formation.lines.length - 1] : formation.lines[formation.lines.length - 1])
  };
  
  return lineup;
};

// دالة مساعدة لإنشاء تشكيلة مخصصة
export const createCustomLineup = (
  formationName: string, 
  goalkeeperIds: string[], 
  defenderIds: string[], 
  midfielderIds: string[], 
  forwardIds: string[]
): LineupData => {
  // البحث عن التشكيل المطلوب
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // دالة مساعدة للبحث عن اللاعبين بواسطة المعرفات
  const findPlayersByIds = (ids: string[]): Player[] => {
    return ids.map(id => {
      const player = barcelona.players.find(p => p.id === id);
      if (!player) {
        console.warn(`لم يتم العثور على لاعب بمعرف ${id}`);
      }
      return player;
    }).filter(player => player !== undefined) as Player[];
  };
  
  // إنشاء تشكيلة باللاعبين المختارين
  const lineup: LineupData = {
    formation,
    goalkeeper: findPlayersByIds(goalkeeperIds),
    defense: findPlayersByIds(defenderIds),
    midfield: findPlayersByIds(midfielderIds),
    attack: findPlayersByIds(forwardIds)
  };
  
  return lineup;
};


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

// تعديل وظيفة استخراج معرف المباراة
const extractMatchIdFromUrl = (url: string): string => {
  // إذا كان المدخل هو فقط أرقام، فنعتبره معرف المباراة
  if (url.match(/^\d+$/)) {
    return url;
  }
  
  // استخراج معرف المباراة من نهاية الرابط (يحتوي على أرقام)
  // التحقق من رابط FotMob الكامل مثل https://www.fotmob.com/matches/barcelona-vs-benfica/2sv14h#4737555:tab=lineup
  
  // محاولة استخراج الرقم بعد # وقبل :
  if (url.includes("#")) {
    const afterHash = url.split("#")[1];
    if (afterHash) {
      if (afterHash.includes(":")) {
        const matchId = afterHash.split(":")[0];
        if (matchId && matchId.match(/^\d+$/)) {
          return matchId;
        }
      } else if (afterHash.match(/^\d+$/)) {
        return afterHash;
      }
    }
  }
  
  // محاولة استخراج أي رقم طويل (معرف المباراة عادةً أطول من 5 أرقام)
  const matches = url.match(/\d{5,}/g);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  
  // إذا لم نتمكن من استخراج معرف، نعيد الرابط كما هو
  console.log("لم نتمكن من استخراج معرف المباراة من الرابط:", url);
  return url;
};

// هذه الدالة تمثل جلب البيانات من FotMob
export const fetchLineupFromUrl = async (url: string, formationName: string = "4-3-3"): Promise<LineupData> => {
  console.log("Fetching lineup from URL:", url);
  
  // استخراج معرف المباراة من الرابط
  const matchId = extractMatchIdFromUrl(url);
  console.log("تم استخراج معرف المباراة:", matchId);
  
  // محاكاة تأخير API
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // تحديد التشكيل المطلوب
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // محاكاة تشكيلة من FotMob بناءً على معرف المباراة
  let lineup: LineupData;
  
  // نموذج محاكاة لتشكيلة مباراة برشلونة ضد بنفيكا (المعرف 4737555)
  if (matchId === "4737555") {
    // استخدام التشكيل 4-3-3 لهذه المباراة المحددة
    const matchFormation = formations.find(f => f.name === "4-3-3") || formation;
    
    // البحث عن اللاعبين بالاسم
    const findPlayerByName = (namePattern: string): Player | undefined => {
      return barcelona.players.find(player => 
        player.name.toLowerCase().includes(namePattern.toLowerCase())
      );
    };
    
    // تحديد التشكيلة الأساسية الفعلية لمباراة برشلونة ضد بنفيكا
    lineup = {
      formation: matchFormation,
      goalkeeper: [findPlayerByName("ter stegen") || barcelona.players.find(p => p.position === "GK")!],
      defense: [
        findPlayerByName("koundé") || findPlayerByName("kounde") || barcelona.players.find(p => p.id === "kounde")!,
        findPlayerByName("araújo") || findPlayerByName("araujo") || barcelona.players.find(p => p.id === "araujo")!,
        findPlayerByName("martínez") || findPlayerByName("martinez") || barcelona.players.find(p => p.id === "inigo")!,
        findPlayerByName("balde") || barcelona.players.find(p => p.id === "balde")!
      ],
      midfield: [
        findPlayerByName("de jong") || barcelona.players.find(p => p.id === "de-jong")!,
        findPlayerByName("pedri") || barcelona.players.find(p => p.id === "pedri")!,
        findPlayerByName("olmo") || barcelona.players.find(p => p.id === "olmo")!
      ],
      attack: [
        findPlayerByName("yamal") || barcelona.players.find(p => p.id === "yamal")!,
        findPlayerByName("lewandowski") || barcelona.players.find(p => p.id === "lewandowski")!,
        findPlayerByName("raphinha") || barcelona.players.find(p => p.id === "raphinha")!
      ]
    };
    
    // التأكد من أن جميع المصفوفات تحتوي على لاعبين
    // إذا كان هناك قيم undefined، استبدلها بلاعبين من موقع مناسب
    lineup.goalkeeper = lineup.goalkeeper.filter(p => p !== undefined);
    lineup.defense = lineup.defense.filter(p => p !== undefined);
    lineup.midfield = lineup.midfield.filter(p => p !== undefined);
    lineup.attack = lineup.attack.filter(p => p !== undefined);
    
    // إكمال أي مراكز مفقودة
    if (lineup.goalkeeper.length === 0) {
      lineup.goalkeeper = [barcelona.players.find(p => p.position === "GK")!];
    }
    
    // إكمال الدفاع إذا كان ناقصًا
    while (lineup.defense.length < matchFormation.lines[0]) {
      const missingDefenders = barcelona.players
        .filter(p => p.position === "DF" && !lineup.defense.some(d => d.id === p.id))
        .slice(0, matchFormation.lines[0] - lineup.defense.length);
      
      lineup.defense = [...lineup.defense, ...missingDefenders];
    }
    
    // إكمال الوسط إذا كان ناقصًا
    const midfieldCount = matchFormation.lines.length > 1 
      ? matchFormation.lines.reduce((sum, count, index) => index > 0 && index < matchFormation.lines.length - 1 ? sum + count : sum, 0) 
      : 0;
    
    while (lineup.midfield.length < midfieldCount) {
      const missingMidfielders = barcelona.players
        .filter(p => p.position === "MF" && !lineup.midfield.some(m => m.id === p.id))
        .slice(0, midfieldCount - lineup.midfield.length);
      
      lineup.midfield = [...lineup.midfield, ...missingMidfielders];
    }
    
    // إكمال الهجوم إذا كان ناقصًا
    while (lineup.attack.length < matchFormation.lines[matchFormation.lines.length - 1]) {
      const missingForwards = barcelona.players
        .filter(p => p.position === "FW" && !lineup.attack.some(a => a.id === p.id))
        .slice(0, matchFormation.lines[matchFormation.lines.length - 1] - lineup.attack.length);
      
      lineup.attack = [...lineup.attack, ...missingForwards];
    }
  } else {
    // في حالة عدم وجود معرف مباراة محدد، استخدم تشكيلة افتراضية
    // تصفية اللاعبين حسب المركز
    const goalkeepers = barcelona.players.filter(player => player.position === "GK");
    const defenders = barcelona.players.filter(player => player.position === "DF");
    const midfielders = barcelona.players.filter(player => player.position === "MF");
    const forwards = barcelona.players.filter(player => player.position === "FW");
    
    lineup = {
      formation,
      goalkeeper: [goalkeepers[0]],
      defense: defenders.slice(0, formation.lines[0]),
      midfield: midfielders.slice(0, formation.lines.length > 1 ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) : 0),
      attack: forwards.slice(0, formation.lines[formation.lines.length - 1])
    };
  }
  
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

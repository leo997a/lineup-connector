
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
  
  // تحقق من وجود معرف مباراة في نهاية الرابط (بعد # أو :)
  if (url.includes("#") || url.includes(":")) {
    // استخراج بواسطة #
    if (url.includes("#")) {
      const parts = url.split("#");
      if (parts.length > 1) {
        const idPart = parts[1].split(":")[0];
        if (idPart && idPart.match(/^\d+$/)) {
          return idPart;
        }
      }
    }
    
    // استخراج بواسطة :
    if (url.includes(":")) {
      const parts = url.split(":");
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part && part.match(/^\d+$/)) {
          return part;
        }
      }
    }
  }
  
  // إذا وجدنا رقماً في الرابط، قد يكون معرف المباراة
  const matches = url.match(/\d+/g);
  if (matches && matches.length > 0) {
    for (const match of matches) {
      if (match.length >= 5) { // معرفات المباريات عادة أطول من 5 أرقام
        return match;
      }
    }
  }
  
  // إذا لم نتمكن من استخراج معرف، نعيد الرابط كما هو
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
  
  // في التطبيق الحقيقي، هنا سنقوم بالاتصال بـ API FotMob أو استخدام تقنية web scraping
  // للحصول على التشكيلة الفعلية بناءً على معرف المباراة
  
  // تحديد التشكيل المطلوب
  // نحاول استخراج التشكيل من البيانات المجلوبة (في تطبيق حقيقي)
  // لكن هنا سنستخدم التشكيل المقدم من المستخدم كافتراضي
  const formation = formations.find(f => f.name === formationName) || formations[0];
  
  // محاكاة تشكيلة من FotMob بناءً على معرف المباراة
  // في تطبيق حقيقي، هذه البيانات ستأتي من API أو استخراج البيانات من الموقع
  let selectedGoalkeeper: Player | undefined;
  let selectedDefenders: Player[] = [];
  let selectedMidfielders: Player[] = [];
  let selectedForwards: Player[] = [];
  
  // نموذج محاكاة لتشكيلة مباراة برشلونة ضد بنفيكا (المعرف 4737555)
  if (matchId === "4737555") {
    // حارس المرمى - تير شتيغن
    selectedGoalkeeper = barcelona.players.find(p => p.name.includes("Ter Stegen"));
    
    // الدفاع - كوندي، أراوخو، إنيغو، بالدي
    const defenderNames = ["Koundé", "Araújo", "Martínez", "Balde"];
    selectedDefenders = barcelona.players.filter(p => p.position === "DF" && defenderNames.some(name => p.name.includes(name)));
    
    // الوسط - دي يونغ، بيدري، غوندوغان
    const midfielderNames = ["De Jong", "Pedri", "Gündoğan"];
    selectedMidfielders = barcelona.players.filter(p => p.position === "MF" && midfielderNames.some(name => p.name.includes(name)));
    
    // الهجوم - يامال، ليفاندوفسكي، رافينيا
    const forwardNames = ["Yamal", "Lewandowski", "Raphinha"];
    selectedForwards = barcelona.players.filter(p => p.position === "FW" && forwardNames.some(name => p.name.includes(name)));
  } else {
    // في حالة عدم مطابقة المعرف لمباراة معروفة، نستخدم تشكيلة افتراضية
    // تصفية اللاعبين حسب المركز
    const goalkeepers = barcelona.players.filter(player => player.position === "GK");
    const defenders = barcelona.players.filter(player => player.position === "DF");
    const midfielders = barcelona.players.filter(player => player.position === "MF");
    const forwards = barcelona.players.filter(player => player.position === "FW");
    
    selectedGoalkeeper = goalkeepers[0];
    selectedDefenders = defenders.slice(0, formation.lines[0]);
    
    const midfieldCount = formation.lines.length > 1 
      ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) 
      : 0;
    selectedMidfielders = midfielders.slice(0, midfieldCount);
    
    selectedForwards = forwards.slice(0, formation.lines[formation.lines.length - 1]);
  }
  
  // تحقق وإكمال اللاعبين الناقصين (في حالة لم يتم العثور على بعض اللاعبين)
  // تصفية اللاعبين حسب المركز كاحتياطي
  const goalkeepers = barcelona.players.filter(player => player.position === "GK");
  const defenders = barcelona.players.filter(player => player.position === "DF");
  const midfielders = barcelona.players.filter(player => player.position === "MF");
  const forwards = barcelona.players.filter(player => player.position === "FW");
  
  // إذا لم يتم العثور على حارس المرمى
  if (!selectedGoalkeeper) {
    selectedGoalkeeper = goalkeepers[0];
  }
  
  // إكمال اللاعبين الناقصين في الدفاع
  while (selectedDefenders.length < formation.lines[0]) {
    const missingCount = formation.lines[0] - selectedDefenders.length;
    const additionalDefenders = defenders
      .filter(d => !selectedDefenders.some(sd => sd.id === d.id))
      .slice(0, missingCount);
    selectedDefenders = [...selectedDefenders, ...additionalDefenders];
  }
  
  // إكمال اللاعبين الناقصين في الوسط
  const midfieldCount = formation.lines.length > 1 
    ? formation.lines.reduce((sum, count, index) => index > 0 && index < formation.lines.length - 1 ? sum + count : sum, 0) 
    : 0;
  while (selectedMidfielders.length < midfieldCount) {
    const missingCount = midfieldCount - selectedMidfielders.length;
    const additionalMidfielders = midfielders
      .filter(m => !selectedMidfielders.some(sm => sm.id === m.id))
      .slice(0, missingCount);
    selectedMidfielders = [...selectedMidfielders, ...additionalMidfielders];
  }
  
  // إكمال اللاعبين الناقصين في الهجوم
  while (selectedForwards.length < formation.lines[formation.lines.length - 1]) {
    const missingCount = formation.lines[formation.lines.length - 1] - selectedForwards.length;
    const additionalForwards = forwards
      .filter(f => !selectedForwards.some(sf => sf.id === f.id))
      .slice(0, missingCount);
    selectedForwards = [...selectedForwards, ...additionalForwards];
  }
  
  // إنشاء كائن التشكيلة النهائي
  const lineup: LineupData = {
    formation,
    goalkeeper: [selectedGoalkeeper],
    defense: selectedDefenders.slice(0, formation.lines[0]),
    midfield: selectedMidfielders.slice(0, midfieldCount),
    attack: selectedForwards.slice(0, formation.lines[formation.lines.length - 1])
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

export type Mood = '🙂' | '😐' | '☹️';
export type Energy = 'Låg' | 'Normal' | 'Hög';

export type DailyStory = {
  id:string;
  date:string;
  createdAt:string;
  author:string;
  mood:Mood;
  story:string;
  joys:string[];
  difficulties:string[];
  energy:Energy;
  remember:string;
};

export type Observation = {
  id:string;
  icon:string;
  title:string;
  explanation:string;
  confidence:number;
  confidenceLabel:'Försiktig'|'Medel'|'Hög';
  evidenceIds:string[];
  evidenceCount:number;
  generatedAt:string;
  engine:'Observation Engine v1';
};

const confidenceLabel=(value:number):Observation['confidenceLabel']=>value>=0.75?'Hög':value>=0.5?'Medel':'Försiktig';
const confidence=(matches:number,total:number)=>Math.min(0.92,Math.max(0.3,(matches/Math.max(total,1))*0.65+Math.min(matches,8)*0.045));

export function buildObservations(stories:DailyStory[]):Observation[]{
  if(stories.length<3) return [];
  const generatedAt=new Date().toISOString();
  const observations:Observation[]=[];

  const joyTags=[...new Set(stories.flatMap(story=>story.joys))];
  joyTags.forEach(tag=>{
    const evidence=stories.filter(story=>story.joys.includes(tag));
    const positive=evidence.filter(story=>story.mood==='🙂');
    if(evidence.length>=3 && positive.length/evidence.length>=0.6){
      const value=confidence(positive.length,stories.length);
      observations.push({id:`joy-${tag}`,icon:'♥',title:`${tag} återkommer ofta på positiva dagar.`,explanation:`När ${tag.toLowerCase()} finns med är dagen ofta beskriven som positiv. Det här är ett återkommande samband, inte ett säkert orsakssamband.`,confidence:value,confidenceLabel:confidenceLabel(value),evidenceIds:evidence.map(item=>item.id),evidenceCount:evidence.length,generatedAt,engine:'Observation Engine v1'});
    }
  });

  const difficultyTags=[...new Set(stories.flatMap(story=>story.difficulties))];
  difficultyTags.forEach(tag=>{
    const evidence=stories.filter(story=>story.difficulties.includes(tag));
    const difficult=evidence.filter(story=>story.mood==='☹️'||story.energy==='Låg');
    if(evidence.length>=3 && difficult.length/evidence.length>=0.6){
      const value=confidence(difficult.length,stories.length);
      observations.push({id:`difficulty-${tag}`,icon:'◷',title:`${tag} verkar ofta höra ihop med tyngre dagar.`,explanation:`Anteckningar som nämner ${tag.toLowerCase()} innehåller ofta låg energi eller en tung helhetskänsla. Familjen avgör om observationen stämmer.`,confidence:value,confidenceLabel:confidenceLabel(value),evidenceIds:evidence.map(item=>item.id),evidenceCount:evidence.length,generatedAt,engine:'Observation Engine v1'});
    }
  });

  const lowEnergy=stories.filter(story=>story.energy==='Låg');
  const lowAndDifficult=lowEnergy.filter(story=>story.mood==='☹️'||story.difficulties.length>0);
  if(lowEnergy.length>=3 && lowAndDifficult.length/lowEnergy.length>=0.6){
    const value=confidence(lowAndDifficult.length,stories.length);
    observations.push({id:'energy-low',icon:'🌙',title:'Låg energi återkommer ofta när dagen varit mer krävande.',explanation:'På dagar med låg energi finns det ofta också svårigheter eller en tyngre helhetskänsla. Underlaget visar ett mönster, inte en diagnos.',confidence:value,confidenceLabel:confidenceLabel(value),evidenceIds:lowEnergy.map(item=>item.id),evidenceCount:lowEnergy.length,generatedAt,engine:'Observation Engine v1'});
  }

  return observations.sort((a,b)=>b.confidence-a.confidence).slice(0,6);
}

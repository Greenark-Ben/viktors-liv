export type LivExperience='liv'|'studio'|'viktor';
export type LivAudience='family-admin'|'family-member'|'viktor'|'professional'|'municipality'|'trusted-relative';
export type LivDomain='today'|'profile'|'life'|'learning'|'actions'|'journey'|'knowledge'|'people'|'relationships'|'documents'|'economy'|'photos';
export type AccessLevel='hidden'|'summary'|'read'|'contribute'|'manage';

export type ProjectionGrant={domain:LivDomain;access:AccessLevel;reason:string};
export type ProjectionPolicy={
 id:string;
 name:string;
 audience:LivAudience;
 experience:LivExperience;
 grants:ProjectionGrant[];
 createdAt:string;
 updatedAt:string;
};

export type SourceContract={domain:LivDomain;storageKey:string;authority:'family';containsSensitiveData:boolean};

export const sourceContracts:SourceContract[]=[
 {domain:'today',storageKey:'viktors-liv.today.v1',authority:'family',containsSensitiveData:false},
 {domain:'profile',storageKey:'viktors-liv.person.v2',authority:'family',containsSensitiveData:true},
 {domain:'life',storageKey:'liv.daily-stories.v1',authority:'family',containsSensitiveData:true},
 {domain:'actions',storageKey:'liv.next-steps.v1',authority:'family',containsSensitiveData:true},
 {domain:'actions',storageKey:'liv.decisions.v1',authority:'family',containsSensitiveData:true},
 {domain:'actions',storageKey:'liv.meetings.v1',authority:'family',containsSensitiveData:true},
 {domain:'relationships',storageKey:'liv.relationships.v1',authority:'family',containsSensitiveData:true},
 {domain:'journey',storageKey:'viktors-liv.journey.v1',authority:'family',containsSensitiveData:true},
 {domain:'knowledge',storageKey:'viktors-liv.knowledge.v1',authority:'family',containsSensitiveData:false},
 {domain:'people',storageKey:'viktors-liv.people.v1',authority:'family',containsSensitiveData:true},
 {domain:'documents',storageKey:'viktors-liv.documents.v1',authority:'family',containsSensitiveData:true},
 {domain:'photos',storageKey:'viktors-liv.viktor-photos.v1',authority:'family',containsSensitiveData:true}
];

export const RENAISSANCE_POLICY_KEY='liv.projection-policies.v1';
export const RENAISSANCE_SESSION_KEY='liv.experience-session.v1';

export const defaultFamilyPolicy:ProjectionPolicy={
 id:'family-admin-default',name:'Familjens fullständiga vy',audience:'family-admin',experience:'studio',
 grants:[
  {domain:'today',access:'manage',reason:'Familjen samordnar vardagen.'},
  {domain:'profile',access:'manage',reason:'Familjen äger berättelsen om Viktor.'},
  {domain:'life',access:'manage',reason:'Familjen bevarar dagar och minnen.'},
  {domain:'learning',access:'manage',reason:'Familjen avgör vad observationer betyder.'},
  {domain:'actions',access:'manage',reason:'Familjen äger beslut och nästa steg.'},
  {domain:'journey',access:'manage',reason:'Familjen bevarar Viktors historia.'},
  {domain:'knowledge',access:'manage',reason:'Familjen förvaltar användbar kunskap.'},
  {domain:'people',access:'manage',reason:'Familjen förvaltar förtroendekretsen.'},
  {domain:'relationships',access:'manage',reason:'Familjen avgör hur sammanhang hänger ihop.'},
  {domain:'documents',access:'manage',reason:'Familjen äger dokumentens betydelse.'},
  {domain:'economy',access:'manage',reason:'Endast behöriga familjemedlemmar hanterar ekonomi.'},
  {domain:'photos',access:'manage',reason:'Familjen avgör vilka bilder som bevaras och delas.'}
 ],createdAt:'2026-07-25T00:00:00.000Z',updatedAt:'2026-07-25T00:00:00.000Z'
};

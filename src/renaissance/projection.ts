import {AccessLevel,defaultFamilyPolicy,LivDomain,LivExperience,ProjectionPolicy,RENAISSANCE_POLICY_KEY,RENAISSANCE_SESSION_KEY} from './foundation';

const rank:Record<AccessLevel,number>={hidden:0,summary:1,read:2,contribute:3,manage:4};

export type ExperienceSession={policyId:string;experience:LivExperience;startedAt:string};
export type ProjectionDecision={domain:LivDomain;access:AccessLevel;visible:boolean;editable:boolean;reason:string;policyId:string};

export function readPolicies():ProjectionPolicy[]{
 try{
  const stored=JSON.parse(localStorage.getItem(RENAISSANCE_POLICY_KEY)||'[]') as ProjectionPolicy[];
  return stored.length?stored:[defaultFamilyPolicy];
 }catch{return[defaultFamilyPolicy]}
}

export function writePolicies(policies:ProjectionPolicy[]){
 localStorage.setItem(RENAISSANCE_POLICY_KEY,JSON.stringify(policies));
 window.dispatchEvent(new Event('liv:projection-policies-changed'));
}

export function readSession():ExperienceSession{
 try{
  const value=JSON.parse(localStorage.getItem(RENAISSANCE_SESSION_KEY)||'null') as ExperienceSession|null;
  return value||{policyId:defaultFamilyPolicy.id,experience:'liv',startedAt:new Date().toISOString()};
 }catch{return{policyId:defaultFamilyPolicy.id,experience:'liv',startedAt:new Date().toISOString()}}
}

export function beginExperience(policyId:string,experience:LivExperience):ExperienceSession{
 const session={policyId,experience,startedAt:new Date().toISOString()};
 localStorage.setItem(RENAISSANCE_SESSION_KEY,JSON.stringify(session));
 window.dispatchEvent(new CustomEvent('liv:experience-changed',{detail:session}));
 return session;
}

export function projectDomain(policy:ProjectionPolicy,domain:LivDomain,minimum:AccessLevel='summary'):ProjectionDecision{
 const grant=policy.grants.find(item=>item.domain===domain);
 const access=grant?.access||'hidden';
 return{
  domain,access,
  visible:rank[access]>=rank[minimum],
  editable:rank[access]>=rank.contribute,
  reason:grant?.reason||'Den här informationen ingår inte i personens valda projektion.',
  policyId:policy.id
 };
}

export function resolveActivePolicy():ProjectionPolicy{
 const session=readSession();
 return readPolicies().find(policy=>policy.id===session.policyId)||defaultFamilyPolicy;
}

export function assertCanWrite(domain:LivDomain):ProjectionDecision{
 const decision=projectDomain(resolveActivePolicy(),domain,'contribute');
 if(!decision.editable) throw new Error(`LIV projection refused write to ${domain}: ${decision.reason}`);
 return decision;
}

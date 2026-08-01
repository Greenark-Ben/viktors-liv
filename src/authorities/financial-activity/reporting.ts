import type{FinancialActivityRecord,FinancialReportingPeriod}from'./contracts';
import{assertFinancialReportingPeriod}from'./invariants';

const now=()=>new Date().toISOString();
const id=(prefix:string)=>`${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export function createFinancialReportingPeriod(input:{title:string;startsOn:string;endsOn:string}):FinancialReportingPeriod{const period:FinancialReportingPeriod={id:id('financial-period'),version:1,title:input.title.trim(),startsOn:input.startsOn,endsOn:input.endsOn,status:'open',activityIds:[],createdAt:now()};assertFinancialReportingPeriod(period);return period}
export function includeActivityInReportingPeriod(period:FinancialReportingPeriod,activity:FinancialActivityRecord):FinancialReportingPeriod{if(period.status!=='open')throw new Error('Closed reporting periods cannot be changed.');if(activity.occurredOn<period.startsOn||activity.occurredOn>period.endsOn)throw new Error('The activity falls outside the reporting period.');const next={...period,activityIds:[...new Set([...period.activityIds,activity.id])]};assertFinancialReportingPeriod(next);return next}
export function removeActivityFromReportingPeriod(period:FinancialReportingPeriod,activityId:string):FinancialReportingPeriod{if(period.status!=='open')throw new Error('Closed reporting periods cannot be changed.');const next={...period,activityIds:period.activityIds.filter(id=>id!==activityId)};assertFinancialReportingPeriod(next);return next}
export function closeFinancialReportingPeriod(period:FinancialReportingPeriod):FinancialReportingPeriod{if(period.status==='closed')return period;const next={...period,status:'closed' as const,closedAt:now()};assertFinancialReportingPeriod(next);return next}

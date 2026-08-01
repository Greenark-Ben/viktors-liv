import type{FinancialActivityRecord,FinancialReportingPeriod}from'./contracts';

export interface FinancialInvariantResult{valid:boolean;reasons:string[]}
const validDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));
export function validateFinancialActivity(record:FinancialActivityRecord):FinancialInvariantResult{
 const reasons:string[]=[];
 if(!record.merchant.trim())reasons.push('A financial activity requires a merchant or payee.');
 if(!record.description.trim())reasons.push('A financial activity requires a description.');
 if(!validDate(record.occurredOn))reasons.push('The activity date must be a valid ISO date.');
 if(!Number.isInteger(record.total.minorUnits)||record.total.minorUnits<0)reasons.push('The total must be a non-negative integer amount in minor units.');
 if(!record.lines.length)reasons.push('A financial activity requires at least one line.');
 const lineTotal=record.lines.reduce((sum,line)=>sum+line.amount.minorUnits,0);
 if(record.lines.some(line=>!line.description.trim()||!line.category.trim()||line.quantity<=0||!Number.isInteger(line.amount.minorUnits)||line.amount.minorUnits<0))reasons.push('Every line requires description, category, positive quantity and a valid amount.');
 if(lineTotal!==record.total.minorUnits)reasons.push('The sum of activity lines must equal the recorded total.');
 if(record.reimbursement.status==='pending'&&record.payer.kind==='viktor')reasons.push('A payment made by Viktor cannot be pending reimbursement to another payer.');
 if(record.reimbursement.status==='reimbursed'&&(!record.reimbursement.reimbursedOn||!validDate(record.reimbursement.reimbursedOn)))reasons.push('A reimbursed activity requires a valid reimbursement date.');
 if(record.status==='reported'&&!record.reportingPeriodId)reasons.push('A reported activity must reference a reporting period.');
 if(record.kind==='correction'&&!record.correctionOfId)reasons.push('A correction must reference the activity it corrects.');
 return{valid:reasons.length===0,reasons};
}
export function assertFinancialActivity(record:FinancialActivityRecord):void{const result=validateFinancialActivity(record);if(!result.valid)throw new Error(result.reasons.join(' '))}
export function validateFinancialReportingPeriod(period:FinancialReportingPeriod):FinancialInvariantResult{const reasons:string[]=[];if(!period.title.trim())reasons.push('A reporting period requires a title.');if(!validDate(period.startsOn)||!validDate(period.endsOn)||period.startsOn>period.endsOn)reasons.push('A reporting period requires a valid date range.');if(new Set(period.activityIds).size!==period.activityIds.length)reasons.push('Reporting period activities must be unique.');return{valid:reasons.length===0,reasons}}
export function assertFinancialReportingPeriod(period:FinancialReportingPeriod):void{const result=validateFinancialReportingPeriod(period);if(!result.valid)throw new Error(result.reasons.join(' '))}

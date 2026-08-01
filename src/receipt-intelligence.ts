import{createWorker}from'tesseract.js';
import{GlobalWorkerOptions,getDocument}from'pdfjs-dist';

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.mjs',import.meta.url).toString();

export interface ReceiptSuggestion<T>{value:T;confidence:'low'|'medium'|'high';evidence:string}
export interface ReceiptIntelligenceResult{
 text:string;
 merchant?:ReceiptSuggestion<string>;
 purchaseDate?:ReceiptSuggestion<string>;
 totalMinorUnits?:ReceiptSuggestion<number>;
 category?:ReceiptSuggestion<string>;
 description?:ReceiptSuggestion<string>;
}

const categoryRules:[string,RegExp][]=[
 ['Kläder',/kläder|jacka|byxor|tröja|skor|sockor|strumpor|h&m|kappahl|lindex|dressmann|stadium/i],
 ['Hygien',/hygien|schampo|tvål|tandkräm|deo|apotek|kronans|hjärtat/i],
 ['Mat',/ica|coop|willys|hemköp|lidl|mat|livsmedel|restaurang|café/i],
 ['Transport',/skånetrafiken|sj|taxi|buss|tåg|parkering|bensin|circle k|preem/i],
 ['Vård',/vård|läkare|tandvård|medicin|recept|region/i],
 ['Fritid',/bio|museum|aktivitet|simhall|bowling|konsert/i],
 ['Hjälpmedel',/hjälpmedel|ortos|rullstol|kommunikation/i],
];

function normaliseLines(text:string):string[]{return text.split(/\r?\n/).map(line=>line.replace(/\s+/g,' ').trim()).filter(Boolean)}
function parseAmount(value:string):number|undefined{const cleaned=value.replace(/\s/g,'').replace(/kr|sek/gi,'').replace(',','.').replace(/[^0-9.]/g,'');const amount=Number(cleaned);return Number.isFinite(amount)&&amount>0?Math.round(amount*100):undefined}
function isoDate(year:number,month:number,day:number):string|undefined{const date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?`${year.toString().padStart(4,'0')}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`:undefined}
function parseDate(text:string):ReceiptSuggestion<string>|undefined{
 const patterns=[/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/,/(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})/];
 for(const pattern of patterns){const match=text.match(pattern);if(!match)continue;const y=pattern===patterns[0]?Number(match[1]):Number(match[3]);const m=Number(match[2]);const d=pattern===patterns[0]?Number(match[3]):Number(match[1]);const value=isoDate(y,m,d);if(value)return{value,confidence:'high',evidence:match[0]}}
 return undefined;
}
function parseTotal(lines:string[]):ReceiptSuggestion<number>|undefined{
 const labelled=lines.filter(line=>/att betala|summa|total|belopp/i.test(line));
 const candidates=(labelled.length?labelled:lines.slice(-8)).flatMap(line=>[...line.matchAll(/(\d{1,6}(?:[ ,.\u00a0]\d{3})*(?:[,.]\d{2}))/g)].map(match=>({line,value:parseAmount(match[1])}))).filter((candidate):candidate is{line:string;value:number}=>candidate.value!==undefined);
 if(!candidates.length)return undefined;const best=candidates.sort((a,b)=>b.value-a.value)[0];return{value:best.value,confidence:labelled.includes(best.line)?'high':'medium',evidence:best.line};
}
function parseMerchant(lines:string[]):ReceiptSuggestion<string>|undefined{
 const ignored=/kvitto|org\.?nr|moms|datum|total|summa|öppet köp|välkommen|telefon|www\.|kund/i;
 const candidate=lines.slice(0,8).find(line=>line.length>=2&&line.length<=48&&!ignored.test(line)&&/[A-Za-zÅÄÖåäö]{2}/.test(line));
 return candidate?{value:candidate,confidence:'medium',evidence:candidate}:undefined;
}
function parseCategory(text:string):ReceiptSuggestion<string>|undefined{for(const[category,rule]of categoryRules){const match=text.match(rule);if(match)return{value:category,confidence:'medium',evidence:match[0]}}return undefined}
function descriptionFor(merchant?:string,category?:string):ReceiptSuggestion<string>|undefined{if(!merchant&&!category)return undefined;const value=category?`${category} till Viktor${merchant?` från ${merchant}`:''}`:`Inköp till Viktor från ${merchant}`;return{value,confidence:'low',evidence:'Skapat som redigerbart förslag från butik och kategori'}}

async function pdfFirstPage(file:File):Promise<HTMLCanvasElement>{const data=new Uint8Array(await file.arrayBuffer());const pdf=await getDocument({data}).promise;const page=await pdf.getPage(1);const viewport=page.getViewport({scale:2});const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);const context=canvas.getContext('2d');if(!context)throw new Error('PDF-sidan kunde inte förberedas för läsning.');await page.render({canvasContext:context,viewport,canvas}).promise;return canvas}

export async function analyseReceipt(file:File,onProgress?:(progress:number,status:string)=>void):Promise<ReceiptIntelligenceResult>{
 const input=file.type==='application/pdf'?await pdfFirstPage(file):file;
 const worker=await createWorker('swe+eng',undefined,{logger:message=>{if(message.status&&typeof message.progress==='number')onProgress?.(message.progress,message.status)}});
 try{const result=await worker.recognize(input);const text=result.data.text.trim();if(!text)throw new Error('Ingen läsbar text hittades i kvittot.');const lines=normaliseLines(text);const merchant=parseMerchant(lines);const category=parseCategory(text);return{text,merchant,purchaseDate:parseDate(text),totalMinorUnits:parseTotal(lines),category,description:descriptionFor(merchant?.value,category?.value)}}finally{await worker.terminate()}
}

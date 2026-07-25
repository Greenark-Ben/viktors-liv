import {ProjectionPolicy} from './foundation';

const now='2026-07-25T00:00:00.000Z';

export const viktorProjection:ProjectionPolicy={
 id:'viktor-default',name:'Viktors egen vy',audience:'viktor',experience:'viktor',createdAt:now,updatedAt:now,
 grants:[
  {domain:'today',access:'read',reason:'Viktor ser sin dag i lugn och tydlig ordning.'},
  {domain:'profile',access:'read',reason:'Viktor kan se sin egen berättelse och sina intressen.'},
  {domain:'photos',access:'read',reason:'Familjens godkända bilder kan visas för Viktor.'},
  {domain:'life',access:'summary',reason:'Utvalda positiva minnen kan visas utan familjens privata anteckningar.'},
  {domain:'people',access:'summary',reason:'Viktor kan se bekanta personer och deras roller.'},
  {domain:'actions',access:'hidden',reason:'Administrativa beslut och uppgifter visas inte i Viktor Mode.'},
  {domain:'documents',access:'hidden',reason:'Myndighetsdokument hör till familjens arbetsyta.'},
  {domain:'economy',access:'hidden',reason:'Ekonomi visas aldrig i Viktor Mode.'},
  {domain:'relationships',access:'hidden',reason:'Den tekniska relationsmodellen visas inte i Viktor Mode.'},
  {domain:'learning',access:'hidden',reason:'Familjens observationstolkningar visas inte direkt för Viktor.'},
  {domain:'journey',access:'summary',reason:'Utvalda livshändelser kan visas som en trygg berättelse.'},
  {domain:'knowledge',access:'hidden',reason:'Fackkunskap hör till familjens och professionellas arbetsyta.'}
 ]
};

export const professionalProjection:ProjectionPolicy={
 id:'professional-default',name:'Professionell förståelse',audience:'professional',experience:'liv',createdAt:now,updatedAt:now,
 grants:[
  {domain:'profile',access:'read',reason:'Professionella behöver förstå Viktor som person.'},
  {domain:'today',access:'summary',reason:'Endast relevant vardagsinformation delas.'},
  {domain:'learning',access:'read',reason:'Familjens godkända lärdomar kan stödja ett bättre bemötande.'},
  {domain:'knowledge',access:'read',reason:'Relevant kunskap kan delas med stödpersoner.'},
  {domain:'people',access:'summary',reason:'Endast relevanta kontaktroller visas.'},
  {domain:'actions',access:'contribute',reason:'Professionella kan bidra till tilldelade möten och nästa steg.'},
  {domain:'documents',access:'read',reason:'Endast uttryckligen delade dokument visas.'},
  {domain:'relationships',access:'summary',reason:'Sammanhang visas utan privata familjerelationer.'},
  {domain:'journey',access:'summary',reason:'Viktiga övergångar kan delas när familjen godkänner det.'},
  {domain:'photos',access:'hidden',reason:'Bilder är privata om familjen inte uttryckligen delar dem.'},
  {domain:'life',access:'hidden',reason:'Familjens dagliga berättelser är privata som standard.'},
  {domain:'economy',access:'hidden',reason:'Ekonomi delas aldrig med professionella som standard.'}
 ]
};

export const municipalityProjection:ProjectionPolicy={
 id:'municipality-default',name:'Kommunens underlag',audience:'municipality',experience:'liv',createdAt:now,updatedAt:now,
 grants:[
  {domain:'profile',access:'summary',reason:'Endast relevant person- och stödprofil delas.'},
  {domain:'documents',access:'read',reason:'Beslut och underlag kan delas med kommunen.'},
  {domain:'actions',access:'contribute',reason:'Kommunen kan bidra till uttryckligen tilldelade uppföljningar.'},
  {domain:'people',access:'summary',reason:'Endast relevanta ansvariga visas.'},
  {domain:'knowledge',access:'summary',reason:'Relevant rättighets- och övergångskunskap kan visas.'},
  {domain:'today',access:'hidden',reason:'Vardagsplanering delas inte med kommunen som standard.'},
  {domain:'life',access:'hidden',reason:'Familjens berättelser är privata.'},
  {domain:'learning',access:'hidden',reason:'Observationer delas endast genom ett uttryckligt familjebeslut.'},
  {domain:'journey',access:'hidden',reason:'Viktors livshistoria är privat som standard.'},
  {domain:'photos',access:'hidden',reason:'Bilder delas inte med kommunen som standard.'},
  {domain:'relationships',access:'hidden',reason:'Familjens relationsgraf är privat.'},
  {domain:'economy',access:'hidden',reason:'Familjens ekonomi är privat.'}
 ]
};

export const renaissanceDefaults=[viktorProjection,professionalProjection,municipalityProjection];

import {CENSUS_YEARS,searchCensus,searchVital} from '../lib/genealogy-providers.js';
export const config={maxDuration:60};
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const q=new URL(req.url,'https://family.example').searchParams,first=String(q.get('first')||'').trim(),surname=String(q.get('surname')||'').trim(),source=q.get('source'),year=Number(q.get('year'));
 if(!first||!surname||first.length>80||surname.length>80||!['census','vital'].includes(source)||(source==='census'&&!CENSUS_YEARS.includes(year)))return res.status(400).json({error:'Choose a supported source and provide given name and surname.'});
 const start=Number(q.get('start'))||0,end=Number(q.get('end'))||0;
 if((start&&(start<1500||start>2026))||(end&&(end<1500||end>2026))||(start&&end&&start>end))return res.status(400).json({error:'Invalid date range.'});
 try{const data=source==='census'?await searchCensus(year,first,surname):await searchVital(first,surname,start,end);res.setHeader('Cache-Control','s-maxage=86400, stale-while-revalidate=3600');return res.status(200).json({...data,checkedAt:new Date().toISOString()});}
 catch(e){res.setHeader('Cache-Control','no-store');return res.status(502).json({error:e.name==='TimeoutError'?'The source took too long to respond.':e.message,results:[],status:'unavailable'});}
}

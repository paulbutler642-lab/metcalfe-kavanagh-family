export const EVENTS=['birth','baptism','marriage','death','burial'];
export const CENSUS_YEARS=[1821,1831,1841,1851,1901,1911,1926];
const text=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/g,' ').trim();
export function parseVitalSearch(html){
 const rows=[];
 for(const m of html.matchAll(/<a\b[^>]*href=["'](?:https:\/\/www\.irishgenealogy\.ie)?\/view\/?\?record_id=([^"'&]+)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)){
  const header=m[2].match(/<h[345]\b[^>]*>([\s\S]*?)<\/h[345]>/i);if(!header)continue;
  const title=text(header[1]),event=title.match(/^(birth|baptism|marriage|death|burial) of /i)?.[1].toLowerCase();if(!event)continue;
  let name=title.replace(/^\w+ of /i,'').replace(/\s+(?:on|in)\s+.*$/i,'').replace(/\s+of\s+.*$/i,'');
  const fields={};for(const f of m[2].matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>([\s\S]*?)<\/div>/gi))fields[text(f[1]).replace(/:\s*$/,'')]=text(f[2]);
  rows.push({id:m[1],provider:'vital',event,name,names:event==='marriage'?name.split(/ and /i):[name],title,date:title.match(/\s(?:on|in)\s+(.+?)(?:\s*[ᐧ·]|\s+(?:Civil|Church) record|$)/i)?.[1]||'',fields,url:`https://www.irishgenealogy.ie/view/?record_id=${encodeURIComponent(m[1])}`});
 }
 const count=html.match(/(\d[\d,]*\+?|No)\s+results?\s+found/i)?.[1];
 if(count===undefined&&!rows.length)throw Error('The source returned an unrecognised page; its records could not be checked.');
 return {results:rows,count:count==='No'?0:parseInt(String(count).replace(/,/g,''))||rows.length};
}
export function parseVitalDetail(html){
 const fields={};for(const m of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
  const cells=[...m[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1]));
  if(cells.length>=2&&cells[0]&&!/view record image/i.test(cells[0]))fields[cells[0].replace(/:$/,'')]=cells.slice(1).join(' / ');
 }return fields;
}
async function get(url,kind='json',deadline=Date.now()+10000){
 if(Date.now()>=deadline)throw Error('Search time limit reached; some records remain unchecked.');
 const r=await fetch(url,{signal:AbortSignal.timeout(Math.min(10000,Math.max(1,deadline-Date.now()))),headers:{accept:kind==='json'?'application/json':'text/html','user-agent':'Metcalfe-Kavanagh-Family-History/2.0'}});
 if(!r.ok)throw Error(r.status===403||r.status===429?'The source is refusing automated access. Open its search to continue.':`Source unavailable (HTTP ${r.status}).`);
 const body=kind==='json'?await r.json():await r.text();return body;
}
export function censusURL(year,first,surname){
 const url=new URL(year===1926?'https://c26-api.nationalarchives.ie/api/census/query_c26a':`https://api-census.nationalarchives.ie/census/${year<1901?'query_c19':'query'}`);
 url.searchParams.set(year===1926?'first_name__icontains':'firstname__icontains',first);url.searchParams.set('surname__icontains',surname);url.searchParams.set('limit','100');if(year!==1926)url.searchParams.set('census_year',year);return url;
}
function normalCensus(r,year){return {id:r.a_id??r.id,provider:'census',event:'census',year,name:[r.first_name||r.firstname,r.surname].filter(Boolean).join(' '),date:String(year),age:r.updated_age??r.age,place:[r.house_number,r.townland,r.county].filter(Boolean).join(', '),occupation:r.occupation_updated||r.occupation||'',household:r.image_group,relation:r.updated_relationship_to_head||r.relation_to_head_updated||r.relationship_to_head||r.relation_to_head||'',fields:{},url:year===1926?`https://nationalarchives.ie/collections/search-the-1926-census/census-record/#a_id=${encodeURIComponent(r.a_id)}`:`https://nationalarchives.ie/collections/${year<1901?'search-the-census-c19':'search-the-census'}/census-record/#id=${encodeURIComponent(r.id)}`,image:r.images?.find(i=>i.form==='Form A')?.url?new URL(r.images.find(i=>i.form==='Form A').url,'https://api-census.nationalarchives.ie').href:''};}
export async function searchCensus(year,first,surname,born=0){
 const deadline=Date.now()+45000,url=censusURL(year,first,surname),results=[];let incomplete=false;
 if(born){url.searchParams.set('age__gte',Math.max(0,year-born-2));url.searchParams.set('age__lte',Math.max(0,year-born+2));if(year===1926){url.searchParams.delete('age__gte');url.searchParams.delete('age__lte');}}
 for(let page=0;page<3;page++){url.searchParams.set('offset',page*100);const data=await get(url,'json',deadline);if(!Array.isArray(data.results))throw Error('Unrecognised census response.');results.push(...data.results.map(r=>normalCensus(r,year)));if(!data.meta?.next)break;incomplete=page===2;}
 // Fetch the actual household: same-surname result rows alone omit parents and spouses.
 let enriched=0;const groups=new Map();
 for(const row of results){if(row.household==null||groups.has(String(row.household)))continue;if(enriched++>=5){incomplete=true;break;}const householdURL=censusURL(year,'','');householdURL.searchParams.delete(year===1926?'first_name__icontains':'firstname__icontains');householdURL.searchParams.delete('surname__icontains');householdURL.searchParams.set('image_group',row.household);
  try{const data=await get(householdURL,'json',deadline);groups.set(String(row.household),(data.results||[]).map(r=>normalCensus(r,year)));}catch{incomplete=true;}
 }
 for(const row of results)row.members=groups.get(String(row.household))||[];
 return {results:born?results.filter(r=>r.age===null||r.age===undefined||Math.abs(year-Number(r.age)-born)<=2):results,incomplete};
}
export function vitalURL(first,surname,start,end){const url=new URL('https://www.irishgenealogy.ie/search/');url.searchParams.set('church-or-civil','all');url.searchParams.set('firstname',first);url.searchParams.set('lastname',surname);url.searchParams.set('per_page','100');for(const ev of EVENTS)url.searchParams.set(`event-${ev}`,'1');if(start)url.searchParams.set('yearStart',start);if(end)url.searchParams.set('yearEnd',end);return url;}
export async function searchVital(first,surname,start,end){
 const deadline=Date.now()+45000,url=vitalURL(first,surname,start,end),results=[];let incomplete=false;
 for(let page=1;page<=3;page++){url.searchParams.set('pg',page);const data=parseVitalSearch(await get(url,'html',deadline));results.push(...data.results);if(page*100>=data.count)break;incomplete=page===3;}
 for(const row of results.slice(0,6)){try{row.fields={...row.fields,...parseVitalDetail(await get(row.url,'html',deadline))};row.detailsChecked=true;}catch{incomplete=true;}}
 if(results.length>6)incomplete=true;
 return {results,incomplete};
}

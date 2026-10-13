import {familyContext,runGenealogySearch,renderSearchResults,providerLinks} from '/genealogy-search.js?v=20261013-manual-2';
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const getYear=s=>Number((String(s||'').match(/[0-9]{4}/)||[])[0])||0;
function readResearch(id){try{return JSON.parse(localStorage.getItem('research-checklist:'+id)||'{}')}catch{return {}}}
async function syncResearch(db,personId){
 const {data:{user}}=await db.auth.getUser();if(!user)return null;
 const {data,error}=await db.from('research_progress').select('record_key,status').eq('user_id',user.id).eq('person_id',String(personId));
 if(error)throw error;
 const local=readResearch(personId),merged={...local};for(const item of data||[])merged[item.record_key]=item.status;
 localStorage.setItem('research-checklist:'+personId,JSON.stringify(merged));return user.id;
}
function researchAssistant(person,context,data){
 const born=getYear(person.birth_date||person.birth_date_text),died=getYear(person.death_date||person.death_date_text);
 const family=[...(context.parents||[]),...(context.spouses||[]),...(context.relatives||[])];
 const unique=[...new Map(family.map(p=>[p.id,p])).values()];
 const checks=[['Birth',born?String(born):'Year unknown','birth'],['Marriage',(context.spouses||[]).map(p=>p.name).join(', ')||'Spouse not recorded','marriage'],['Death',died?String(died):'Year unknown','death'],...[1901,1911,1926].filter(y=>(!born||born<=y)&&(!died||died>=y)).map(y=>[y+' census',born?'Expected age about '+(y-born):'Birth year unknown','census',y])];
 const saved=readResearch(person.id);
 const items=checks.map(([label,detail,event,censusYear])=>{
  const candidates=data.results.filter(x=>x.event===event&&(!censusYear||x.year===censusYear)&&x.status!=='conflict');
  const source=data.sources.filter(s=>event==='census'?s.source==='census'&&s.year===censusYear:s.source==='vital'&&s.event===event);
  const blocked=source.some(s=>s.errors.length),status=candidates.length?candidates.length+' unverified candidate(s)':blocked?'Source unavailable':'Research needed';
  const key=event+(censusYear||'');return '<li><strong>'+escapeHTML(label)+'</strong> — '+escapeHTML(detail)+' · '+escapeHTML(status)+' <select data-check="'+key+'"><option value="todo">To research</option><option value="searched"'+(saved[key]==='searched'?' selected':'')+'>Searched</option><option value="review"'+(saved[key]==='review'?' selected':'')+'>Review candidate</option><option value="verified"'+(saved[key]==='verified'?' selected':'')+'>Reviewed original</option></select></li>';
 }).join('');
 const relatives=unique.slice(0,8).map(p=>escapeHTML(p.name)).join(', ');
 return '<section class="auto-record-card" aria-label="Research assistant"><h3>Research assistant</h3><p>Automatically generated research checklist. Candidates are not verified until the original records have been reviewed.</p><ul>'+items+'</ul><p><strong>Known family for cross-checking:</strong> '+(relatives||'No linked relatives available')+'</p><p><strong>Suggested next step:</strong> '+(born?'Check the '+(born<=1901?'1901':'next available')+' census using the expected age and household relatives.':'Find a reliable birth year, then search the census and civil records.')+'</p><p>Use the original archive links below to investigate missing records. Confirm matches before adding them to the family tree.</p></section>';
}
async function run(){
 const q=new URLSearchParams(location.search),id=q.get('id'),db=window.__SUPABASE_CLIENT__;if(q.get('view')!=='profile'||!id||!db)return;
 const {data:person,error}=await db.from('people').select('*').eq('id',id).single();if(error||!person)return;
 let tries=0;while(!document.querySelector('.profile-v1-content')&&tries++<40)await new Promise(r=>setTimeout(r,100));
 const host=document.querySelector('.profile-v1-content');if(!host)return;
 const style=document.createElement('style');style.textContent='.auto-record-card{border:1px solid #d8dfda;border-radius:12px;padding:18px;margin:14px 0;background:#fff}.genealogy-status{padding:14px;background:#eef3ee;border-radius:8px}.genealogy-results summary{cursor:pointer;font-weight:600;padding:12px 0}.genealogy-results dt{font-weight:600}.genealogy-results dd{margin:0 0 8px}.genealogy-results ul{padding-left:22px}.genealogy-results li{margin:6px 0}';document.head.append(style);
 const section=document.createElement('section');section.id='automatic-record-search';section.className='card profile-panel genealogy-results';section.innerHTML='<h2>Automatic genealogy search</h2><p>Searching available Irish censuses and civil and church records, including surname variants. Candidates are checked against this person’s dates and known family.</p><p class="genealogy-status" role="status">Preparing family checks…</p><button class="btn" type="button" disabled>Search again</button><div class="genealogy-output"></div>'+providerLinks(person);
 const anchor=host.querySelector('#verified-records');anchor?anchor.after(section):host.append(section);
 const button=section.querySelector('button'),status=section.querySelector('[role=status]'),output=section.querySelector('.genealogy-output');
 const search=async()=>{button.disabled=true;try{const context=await familyContext(db,person);let syncUser=null;try{syncUser=await syncResearch(db,person.id)}catch(e){console.warn('Research sync unavailable:',e.message)}const data=await runGenealogySearch(person,context,message=>status.textContent=message);output.innerHTML=researchAssistant(person,context,data)+renderSearchResults(data);output.querySelectorAll('[data-check]').forEach(el=>{el.addEventListener('change',async()=>{try{const saved=readResearch(person.id);saved[el.dataset.check]=el.value;localStorage.setItem('research-checklist:'+person.id,JSON.stringify(saved));if(syncUser){const {error}=await db.from('research_progress').upsert({user_id:syncUser,person_id:String(person.id),record_key:el.dataset.check,status:el.value,updated_at:new Date().toISOString()},{onConflict:'user_id,person_id,record_key'});if(error)status.textContent='Saved on this device, but cloud sync failed: '+error.message;}}catch{status.textContent='Could not save checklist in this browser.';}})});status.textContent=`Search finished: ${data.results.filter(r=>r.status==='strong').length} candidates. ${data.sources.filter(s=>s.errors.length).length} sources unavailable or partly checked.`;}catch(e){status.textContent=e.message;}finally{button.disabled=false;}};button.onclick=search;await search();
}run().catch(console.error);

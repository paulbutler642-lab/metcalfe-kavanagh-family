const cfg=window.__APP_CONFIG__||{};
const client=cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY?window.__SUPABASE_CLIENT__:null;
const query=()=>new URLSearchParams(location.search);
const viewName=()=>query().get('view')||'home';
const personId=()=>viewName()==='profile'?query().get('id'):null;
const currentPath=()=>`${location.pathname}${location.search}`.slice(0,500);

export async function trackVisit(){
  if(!client||viewName()==='admin'||location.pathname.startsWith('/admin'))return;
  const home=viewName()==='home',visitorId=getId(localStorage,'family_archive_visitor'),sessionId=getId(sessionStorage,'family_archive_session'),path=currentPath();
  let referrer='Direct visit';
  try{if(document.referrer){const u=new URL(document.referrer);referrer=u.origin===location.origin?'Another page on this site':u.hostname}}catch{}
  if(!sessionStorage.getItem('family_archive_visit_recorded')){
    let geo={};try{const r=await fetch('/api/visitor-location',{cache:'no-store'});if(r.ok)geo=await r.json()}catch{}
    const {error}=await client.from('site_visits').insert({visitor_id:visitorId,session_id:sessionId,path,referrer,user_agent:navigator.userAgent.slice(0,500),country:geo.country||null,region:geo.region||null,city:geo.city||null});
    if(!error)sessionStorage.setItem('family_archive_visit_recorded','yes');
  }
  const base={visitor_id:visitorId,session_id:sessionId,path,view_name:viewName().slice(0,80),person_id:personId()};
  const events=[];
  if(!sessionStorage.getItem('family_archive_activity_started')){events.push({...base,event_type:'session_start'});sessionStorage.setItem('family_archive_activity_started','yes')}
  events.push({...base,event_type:'page_view'});
  await client.from('site_activity').insert(events);
  startEngagement(base);trackSourceOpens(base);if(home)await showCounter();
}

function startEngagement(base){
  let activeSince=document.visibilityState==='visible'?Date.now():null,unreported=0;
  const collect=()=>{if(activeSince){unreported+=Math.max(0,Math.round((Date.now()-activeSince)/1000));activeSince=Date.now()}};
  const flush=async()=>{collect();const seconds=Math.min(300,unreported);if(seconds<3)return;unreported=0;await client.from('site_activity').insert({...base,event_type:'engagement',active_seconds:seconds})};
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){flush();activeSince=null}else activeSince=Date.now()});
  window.addEventListener('pagehide',()=>{flush()});
  window.setInterval(()=>{if(document.visibilityState==='visible')flush()},30000);
}

function trackSourceOpens(base){document.addEventListener('click',e=>{const link=e.target.closest('a[href]');if(!link)return;const href=link.href||'';if(!/irishgenealogy|nationalarchives|newspapers\.com|irishnewsarchive|family-archive|record_id=|census-record/i.test(href))return;client.from('site_activity').insert({...base,event_type:'source_open'}).then(()=>{})},{capture:true})}
async function showCounter(){const {data}=await client.from('site_stats').select('stat_value').eq('stat_key','visits').maybeSingle(),hero=document.querySelector('.hero');if(!hero||!data)return;const badge=document.createElement('div');badge.className='visit-ticker';badge.setAttribute('aria-label',`${data.stat_value} site visits`);badge.innerHTML=`<span>Site visits</span><strong>${Number(data.stat_value).toLocaleString('en-IE')}</strong>`;hero.append(badge)}

export async function mountAdminAnalytics(container,{db,people=[]}){
  container.className='card visitor-analytics';container.innerHTML='<p class="muted">Loading visitor insights…</p>';
  const [{data:visits,error},{data:stat},{data:activity,error:activityError}]=await Promise.all([db.from('site_visits').select('*').order('visited_at',{ascending:false}).limit(1000),db.from('site_stats').select('stat_value').eq('stat_key','visits').maybeSingle(),db.from('site_activity').select('*').order('created_at',{ascending:false}).limit(5000)]);
  if(error||activityError){container.innerHTML=`<div class="status error">${esc((error||activityError).message)}</div>`;return}
  const rows=visits||[],events=activity||[],unique=new Set(rows.map(x=>x.visitor_id)).size,peopleById=new Map(people.map(p=>[p.id,p.name])),sessions=new Map();
  for(const event of [...events].reverse()){
    if(!sessions.has(event.session_id))sessions.set(event.session_id,{pages:[],seconds:0,sources:0});
    const session=sessions.get(event.session_id);
    if(event.event_type==='page_view')session.pages.push(event);
    if(event.event_type==='engagement')session.seconds+=Number(event.active_seconds)||0;
    if(event.event_type==='source_open')session.sources++;
  }
  const measured=[...sessions.values()],withTime=measured.filter(s=>s.seconds>0),avgTime=withTime.length?Math.round(withTime.reduce((n,s)=>n+s.seconds,0)/withTime.length):0,avgPages=measured.length?measured.reduce((n,s)=>n+s.pages.length,0)/measured.length:0,profileMap=new Map(),sectionMap=new Map();
  for(const event of events.filter(x=>x.event_type==='page_view')){sectionMap.set(event.view_name,(sectionMap.get(event.view_name)||0)+1);if(event.person_id){const item=profileMap.get(event.person_id)||{views:0,seconds:0,sources:0};item.views++;profileMap.set(event.person_id,item)}}
  for(const event of events.filter(x=>x.person_id&&x.event_type!=='page_view')){const item=profileMap.get(event.person_id)||{views:0,seconds:0,sources:0};if(event.event_type==='engagement')item.seconds+=Number(event.active_seconds)||0;if(event.event_type==='source_open')item.sources++;profileMap.set(event.person_id,item)}
  const profiles=[...profileMap.entries()].map(([id,v])=>({id,name:peopleById.get(id)||id,...v})).sort((a,b)=>b.views-a.views),sections=[...sectionMap.entries()].sort((a,b)=>b[1]-a[1]),sourceTotal=events.filter(x=>x.event_type==='source_open').length;
  const locationCounts=new Map();for(const v of rows.filter(v=>v.country||v.region||v.city)){const key=locationLabel(v);locationCounts.set(key,(locationCounts.get(key)||0)+1)}const topLocations=[...locationCounts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8),journeys=[...sessions.entries()].filter(([,s])=>s.pages.length>1).sort((a,b)=>String(b[1].pages.at(-1).created_at).localeCompare(String(a[1].pages.at(-1).created_at))).slice(0,8);
  container.innerHTML=`<div class="analytics-head"><div><span class="source-type">Private administrator statistics</span><h2>Visitor Insights</h2><p class="muted">Anonymous engagement data. No names, email addresses, full IP addresses or precise coordinates are collected.</p></div></div>
  <div class="analytics-summary"><div><strong>${Number(stat?.stat_value||0).toLocaleString('en-IE')}</strong><span>Total visits</span></div><div><strong>${unique.toLocaleString('en-IE')}</strong><span>Unique browsers*</span></div><div><strong>${formatDuration(avgTime)}</strong><span>Average active time†</span></div><div><strong>${avgPages.toFixed(1)}</strong><span>Pages per session†</span></div><div><strong>${sourceTotal}</strong><span>Original records opened†</span></div><div><strong>${measured.length}</strong><span>Measured sessions†</span></div></div>
  <div class="insights-grid"><section class="analytics-panel"><h3>Profile engagement</h3><p class="muted">Which relatives visitors explore and whether they open the evidence.</p>${profiles.length?`<div class="profile-insights"><div class="profile-insight profile-insight-head"><span>Profile</span><span>Views</span><span>Active</span><span>Records</span></div>${profiles.slice(0,12).map(p=>`<div class="profile-insight"><a href="/?view=profile&id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">${esc(p.name)}</a><span>${p.views}</span><span>${formatDuration(p.seconds)}</span><span>${p.sources}</span></div>`).join('')}</div>`:'<p class="analytics-empty">Profile engagement will appear as visitors use the updated site.</p>'}</section>
  <section class="analytics-panel"><h3>Sections visited</h3><p class="muted">Shows which parts of the archive receive attention.</p>${sections.length?`<div class="section-bars">${sections.slice(0,10).map(([name,count])=>`<div><span>${esc(sectionLabel(name))}</span><meter min="0" max="${sections[0][1]}" value="${count}"></meter><strong>${count}</strong></div>`).join('')}</div>`:'<p class="analytics-empty">Section activity will appear after deployment.</p>'}</section></div>
  <section class="analytics-panel journey-panel"><h3>Recent visitor journeys</h3><p class="muted">Anonymous paths through the archive; repeated pages are preserved.</p>${journeys.length?`<div class="journey-list">${journeys.map(([id,s])=>`<article><strong>Session ${esc(id.slice(0,8))}</strong><span>${s.pages.slice(0,7).map(p=>esc(p.person_id?peopleById.get(p.person_id)||'Profile':sectionLabel(p.view_name))).join(' → ')}</span><small>${s.pages.length} pages • ${formatDuration(s.seconds)} active • ${s.sources} records opened</small></article>`).join('')}</div>`:'<p class="analytics-empty">Multi-page journeys will appear as new visits are recorded.</p>'}</section>
  ${topLocations.length?`<div class="analytics-locations"><h3>Visitors by location</h3><p class="muted">Approximate location based on the visitor’s internet connection.</p><div class="location-chips">${topLocations.map(([name,count])=>`<span><strong>${esc(name)}</strong> ${count}</span>`).join('')}</div></div>`:''}
  <details class="recent-visit-details"><summary>Recent visit entries</summary><div class="analytics-list">${rows.slice(0,20).map(v=>`<article><div><strong>Visitor ${esc(v.visitor_id.slice(0,8))}</strong><small>${esc(device(v.user_agent))} • ${esc(displayReferrer(v.referrer))}</small>${(v.country||v.region||v.city)?`<small>Approx. location: ${esc(locationLabel(v))}</small>`:''}</div><div><strong>${new Date(v.visited_at).toLocaleString('en-IE',{dateStyle:'medium',timeStyle:'short'})}</strong><small>Entered on ${esc(v.path)}</small></div></article>`).join('')||'<p class="muted">No visits have been recorded yet.</p>'}</div></details>
  <small class="muted">*A person may be counted again on another device or after clearing browser storage. †Detailed engagement measurement begins with this update. Active time is approximate and counts only while a page is visible.</small>`;
}

function formatDuration(seconds){seconds=Math.max(0,Math.round(Number(seconds)||0));if(seconds<60)return`${seconds}s`;const minutes=Math.floor(seconds/60),rest=seconds%60;return rest?`${minutes}m ${rest}s`:`${minutes}m`}
function sectionLabel(name){return({home:'Home',profile:'Family profiles',tree:'Family Tree',people:'People',sources:'Research & Sources',gallery:'Photos & Documents',archive:'Archive',records:'Records',timeline:'Timeline',places:'Places',stories:'Stories',about:'About & Contact',ask:'Ask the Family Historian',visitors:'Visitors’ Book'})[name]||String(name||'Other').replace(/^./,c=>c.toUpperCase())}
function locationLabel(v){const countryName=country(v.country),parts=[];if(v.city)parts.push(v.city);if(v.region&&!parts.includes(v.region))parts.push(v.region);if(countryName)parts.push(countryName);return parts.join(', ')||'Unknown'}
function country(c){return({IE:'Ireland',GB:'United Kingdom',US:'United States',CA:'Canada',AU:'Australia',NZ:'New Zealand',BR:'Brazil',DE:'Germany',FR:'France',ES:'Spain',IT:'Italy',PT:'Portugal'})[c]||c||''}
function displayReferrer(v){return v==='Another family page'?'Another page on this site':(v||'Direct visit')}
function getId(storage,key){let id=storage.getItem(key);if(!id){id=crypto.randomUUID();storage.setItem(key,id)}return id}
function device(ua=''){if(/Android/i.test(ua))return'Android phone/tablet';if(/iPhone|iPad/i.test(ua))return'iPhone/iPad';if(/Windows/i.test(ua))return'Windows computer';if(/Macintosh/i.test(ua))return'Mac';return'Web browser'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

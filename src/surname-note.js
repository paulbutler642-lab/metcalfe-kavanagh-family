import { familyHistoryFor } from '/family-history-archive.js?v=20260913-census-records-1';

const params=new URLSearchParams(location.search);
const currentView=params.get('view')||'home';
const app=document.getElementById('app');
const noteHtml=`<div class="card surname-note"><strong>Surname note</strong><p>Medcalf, Metcalf and Metcalfe are historical spelling variants of the same family surname in these records.</p></div>`;

function insertNote(){
  if(!app) return false;
  if(app.querySelector('.surname-note')) return true;

  if(currentView==='tree'){
    const wrap=app.querySelector('.tree-scroll')?.parentElement;
    if(wrap){
      wrap.insertAdjacentHTML('afterbegin',noteHtml);
      return true;
    }
  }

  if(currentView==='profile'){
    const heading=app.querySelector('.profile-v1-copy h1, .profile-hero h1');
    if(heading && /\b(Medcalf|Metcalf|Metcalfe)\b/i.test(heading.textContent||'')){
      const overview=app.querySelector('.profile-overview');
      const hero=app.querySelector('.profile-v1-hero, .profile-hero');
      (overview||hero)?.insertAdjacentHTML('afterend',noteHtml);
      return true;
    }
  }
  return false;
}

const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs=(text)=>escapeHtml(String(text||'').replace(/\\n/g,'\n').trim()).split(/\n\s*\n|\n+/).filter(Boolean).map((p)=>`<p>${p}</p>`).join('');

async function enhanceProfileStory(){
  if(currentView!=='profile'||!app||app.dataset.storyEnhanced==='1') return false;
  const heroIntro=app.querySelector('.profile-v1-copy .profile-intro');
  const storySection=app.querySelector('#story');
  const overview=app.querySelector('.profile-overview p');
  if(!heroIntro||!storySection) return false;

  const id=params.get('id');
  const cfg=window.__APP_CONFIG__||{};
  let person=null;
  if(id&&cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY&&window.supabase){
    const client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
    const {data}=await client.from('people').select('*').eq('id',id).maybeSingle();
    person=data||null;
  }

  const biography=String(person?.biography||'').replace(/\\n/g,'\n').trim();
  const history=person?familyHistoryFor(person):null;
  const historyStory=history?[history.summary,...(history.chapters||[]).map((c)=>c.text)].filter(Boolean).join('\n\n'):'';
  // A substantial researched biography is the primary story. When the database
  // biography is only a short teaser (as with William), use the richer verified
  // family-history chapters instead so existing research is never hidden.
  let fullStory=biography.length>=500?biography:(historyStory||biography);
  if(!fullStory) fullStory=String(overview?.textContent||heroIntro.textContent||'').trim();
  if(!fullStory) return false;

  const limit=1050;
  const long=fullStory.length>limit;
  let preview=fullStory;
  if(long){
    preview=fullStory.slice(0,limit).replace(/\s+\S*$/,'').trim()+'…';
  }
  heroIntro.innerHTML=paragraphs(preview)+(long?'<a class="chapter-record-link" href="#story">Continue reading ↓</a>':'');
  heroIntro.classList.add('prominent-life-story');

  const storyBody=storySection.querySelector('p');
  if(storyBody) storyBody.innerHTML=paragraphs(fullStory);
  else storySection.insertAdjacentHTML('beforeend',`<div class="life-story-full">${paragraphs(fullStory)}</div>`);

  app.dataset.storyEnhanced='1';
  return true;
}

async function applyEnhancements(){
  insertNote();
  await enhanceProfileStory();
  return app?.dataset.storyEnhanced==='1'||!!app?.querySelector('.surname-note');
}

applyEnhancements();
const observer=new MutationObserver(()=>{applyEnhancements();});
if(app) observer.observe(app,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),10000);

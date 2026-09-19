const SITE='https://metcalfe-kavanagh-family-site.vercel.app/';
const view=location.pathname.startsWith('/admin')?'admin':(new URLSearchParams(location.search).get('view')||'home');
const menu=document.getElementById('menuButton'),mobile=document.getElementById('mobileMenu');

if(!document.querySelector('.skip-link')){
  const skip=document.createElement('a');skip.className='skip-link';skip.href='#app';skip.textContent='Skip to main content';document.body.prepend(skip);
}
document.getElementById('app')?.setAttribute('tabindex','-1');
document.querySelector('.nav')?.setAttribute('aria-label','Main navigation');
mobile?.setAttribute('aria-label','Mobile navigation');
if(menu&&mobile){
  menu.setAttribute('aria-controls','mobileMenu');
  const sync=()=>{const open=mobile.classList.contains('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')};
  menu.addEventListener('click',()=>queueMicrotask(sync));
  document.getElementById('bottomMenu')?.addEventListener('click',()=>queueMicrotask(sync));sync();
}

const routeKey=a=>{try{return new URL(a.href).searchParams.get('view')||'home'}catch{return''}};
document.querySelectorAll('.nav a,.mobilemenu a,.bottom a').forEach(a=>{if(routeKey(a)===view)a.setAttribute('aria-current','page')});

const descriptions={
  home:'Family history, photographs, stories and verified records from the Metcalfe and Kavanagh families.',
  about:'About the Metcalfe and Kavanagh family archive and how to contribute information or corrections.',
  tree:'Explore the Metcalfe and Kavanagh family tree across generations.',
  people:'Browse people recorded in the Metcalfe and Kavanagh family archive.',
  sources:'Search verified civil, census, parish, military and newspaper sources.',
  visitors:'Leave a family connection, greeting or memory in the visitors’ book.',
  gallery:'Explore family photographs, documents and historical newspaper material.',
  places:'Explore places connected with the Metcalfe and Kavanagh families.',
  timeline:'Follow the Metcalfe and Kavanagh family story in chronological order.',
  stories:'Read evidence-based stories from the Metcalfe and Kavanagh family archive.',
  evidence:'Learn how records, newspapers, family archives and oral histories are assessed and labelled.',
  admin:'Secure administration for the Metcalfe and Kavanagh family archive.',
  ask:'Ask evidence-based questions about people, relationships, places and events in the family archive.'
};
const titles={home:'The Metcalfe & Kavanagh Family',about:'About & Contact',ask:'Ask the Family Historian',tree:'Family Tree',people:'People',sources:'Research & Sources',visitors:'Visitors’ Book',gallery:'Photos & Documents',places:'Family Places',timeline:'Family Timeline',stories:'Family Stories',evidence:'How We Verify Evidence',admin:'Administration'};
function meta(name,property){let el=document.head.querySelector(property?`meta[property="${name}"]`:`meta[name="${name}"]`);if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',name);document.head.append(el)}return el}
function applyMeta(title,description,url=location.href){document.title=title;meta('description').content=description;meta('og:title',true).content=title;meta('og:description',true).content=description;meta('og:url',true).content=url;meta('twitter:title').content=title;meta('twitter:description').content=description;let c=document.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.append(c)}c.href=url}
if(view==='profile'){
  let tries=0;const timer=setInterval(()=>{const h=document.querySelector('.profile-v1-copy h1');if(!h&&tries++<40)return;clearInterval(timer);if(!h)return;const life=document.querySelector('.profile-lifespan')?.textContent?.trim(),intro=document.querySelector('.profile-intro')?.textContent?.trim();applyMeta(`${h.textContent.trim()}${life?` (${life})`:''} | Metcalfe & Kavanagh Family`,intro||`Family-history profile for ${h.textContent.trim()}.`,`${SITE}?view=profile&id=${encodeURIComponent(new URLSearchParams(location.search).get('id')||'')}`)},100);
}else applyMeta(`${titles[view]||'Family Archive'}${view==='home'?'':' | Metcalfe & Kavanagh Family'}`,descriptions[view]||descriptions.home,view==='home'?SITE:`${SITE}?view=${encodeURIComponent(view)}`);

document.querySelectorAll('[role="tablist"]').forEach(list=>{const tabs=[...list.querySelectorAll('[role="tab"]')];const sync=()=>tabs.forEach(t=>t.setAttribute('aria-selected',String(t.classList.contains('active')||t.classList.contains('selected'))));tabs.forEach(t=>t.addEventListener('click',()=>queueMicrotask(sync)));sync()});

const cfg=window.__APP_CONFIG__||{};
const params=new URLSearchParams(location.search);
if((params.get('view')||'home')==='profile'){
  const personId=params.get('id');
  if(personId&&cfg.SUPABASE_URL&&cfg.SUPABASE_PUBLISHABLE_KEY){
    const db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    const addBirthName=async()=>{
      const heading=document.querySelector('.profile-v1-copy h1');
      if(!heading||document.querySelector('.profile-birth-name'))return false;
      const {data,error}=await db.from('people').select('name,birth_name').eq('id',personId).maybeSingle();
      if(error||!data?.birth_name||data.birth_name.trim().toLowerCase()===String(data.name||'').trim().toLowerCase())return true;
      const line=document.createElement('p');
      line.className='profile-birth-name';
      line.innerHTML=`<span>Born</span> ${esc(data.birth_name)}`;
      heading.insertAdjacentElement('afterend',line);
      return true;
    };
    const style=document.createElement('style');
    style.textContent='.profile-birth-name{margin:.2rem 0 .35rem;color:#5d6b64;font-size:1rem;font-weight:500}.profile-birth-name span{font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#7b877f;margin-right:.3rem}@media(max-width:640px){.profile-birth-name{font-size:.95rem}}';
    document.head.appendChild(style);
    if(!(await addBirthName())){
      const observer=new MutationObserver(async()=>{if(await addBirthName())observer.disconnect()});
      observer.observe(document.getElementById('app'),{childList:true,subtree:true});
    }
  }
}

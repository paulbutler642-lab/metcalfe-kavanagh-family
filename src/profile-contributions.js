// Invite relatives to contribute memories and archive material when a profile has little personal content.
const params=new URLSearchParams(location.search)
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])
const meaningfulStory=(text)=>{
  const t=String(text||'').trim()
  return t.length>=220 && !/^no personal life story/i.test(t)
}

if(params.get('view')==='profile'){
 const install=async()=>{
  const host=document.querySelector('.profile-v1-content')
  if(!host||host.querySelector('.profile-contribution-invite')) return false
  const id=params.get('id'),cfg=window.__APP_CONFIG__||{}
  if(!id||!cfg.SUPABASE_URL||!cfg.SUPABASE_PUBLISHABLE_KEY||!window.supabase) return false
  const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY)
  const [{data:person},{data:directMedia},{data:linkedMedia},{data:stories}]=await Promise.all([
   db.from('people').select('*').eq('id',id).maybeSingle(),
   db.from('media').select('id,media_type').eq('person_id',id),
   db.from('media_people').select('media_id').eq('person_id',id),
   db.from('stories').select('id').eq('person_id',id)
  ])
  if(!person) return false
  const mediaIds=new Set([...(directMedia||[]).map(x=>x.id),...(linkedMedia||[]).map(x=>x.media_id)])
  const personalArchiveCount=mediaIds.size+(stories||[]).length
  // Sparse means there is no substantial personal narrative and only a very small family archive.
  // Historical sources/relationships do not suppress this invitation: the aim is to collect memories, photos and documents.
  if(meaningfulStory(person.biography)||personalArchiveCount>=4) return false
  const first=String(person.name||'this family member').trim().split(/\s+/)[0]
  const section=document.createElement('section')
  section.className='card profile-panel profile-contribution-invite'
  section.innerHTML=`<span class="section-kicker">Family memories</span><h2>Help us tell ${esc(first)}'s story</h2><p>We have only a small amount of personal information about ${esc(first)} at the moment. If you knew ${esc(first)}, your memories can help preserve their story for the family.</p><p class="contribution-note">You don't need to know official dates or records. A photograph, document, short memory or family story can be something future generations would otherwise never know.</p><div class="contribution-prompts"><span>What was ${esc(first)} like?</span><span>What work did they do?</span><span>What did they enjoy?</span><span>What do you remember most?</span></div><div class="contribution-actions"><a class="btn" href="/?view=about#contact">Share a memory or story</a><a class="chapter-record-link" href="/?view=about#contact">Add photos or documents</a></div>`
  const overview=host.querySelector('.profile-overview')
  if(overview) overview.insertAdjacentElement('afterend',section); else host.prepend(section)
  return true
 }
 install().catch(console.error)
 const observer=new MutationObserver(()=>install().catch(console.error))
 observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true})
 setTimeout(()=>observer.disconnect(),10000)
}

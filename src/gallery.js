const cfg=window.__APP_CONFIG__||{};
const app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
const publicUrl=m=>`${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name||'family-media'}/${m.storage_path}`;

async function load(){
  const [{data:people,error:pe},{data:media,error:me},{data:tags,error:te}]=await Promise.all([
    db.from('people').select('id,name').order('name'),
    db.from('media').select('*').eq('media_type','photo').order('created_at',{ascending:false}),
    db.from('media_people').select('media_id,person_id')
  ]);
  if(pe||me||te) throw pe||me||te;
  const ps=people||[], photos=media||[], tagRows=tags||[];
  const byId=Object.fromEntries(ps.map(p=>[p.id,p]));
  const namesFor=mid=>tagRows.filter(t=>t.media_id===mid).map(t=>byId[t.person_id]?.name).filter(Boolean);

  app.innerHTML=`<section class="heritage"><div class="wrap"><h1>Gallery</h1><p>Family photographs and shared memories.</p></div></section>
  <section class="section gallery-contribute"><div class="wrap">
    <div class="card upload-card">
      <div class="upload-heading"><div><h2>Add family photos</h2><p class="muted">Anyone in the family can contribute. Choose one or more photos, then tag the people shown.</p></div><div class="upload-icon">📷</div></div>
      <form id="galleryUploadForm">
        <label class="file-drop" for="galleryFiles"><span class="file-drop-icon">＋</span><strong>Choose photos</strong><span>JPG, PNG, WebP, HEIC • up to 10 MB each</span><input id="galleryFiles" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple required></label>
        <div id="fileSummary" class="file-summary muted">No photos selected yet.</div>
        <div class="field"><label for="photoTitle"><strong>Photo title</strong> <span class="muted">(optional)</span></label><input id="photoTitle" maxlength="120" placeholder="e.g. Family gathering in Blackrock"></div>
        <div class="field"><label for="photoCaption"><strong>Caption or memory</strong> <span class="muted">(optional)</span></label><textarea id="photoCaption" maxlength="1000" placeholder="Add names, place, occasion or anything you remember..."></textarea></div>
        <div class="people-picker">
          <div class="picker-head"><strong>Who is in the photo?</strong><span class="muted">Choose from the list or start typing to narrow it down. Add as many people as needed.</span></div>
          <div id="selectedPeople" class="selected-people" aria-live="polite"></div>
          <div class="autocomplete-wrap">
            <input id="personSearch" class="person-search" type="search" placeholder="Search family members" autocomplete="off" aria-autocomplete="list" aria-controls="peopleSuggestions">
            <div id="peopleSuggestions" class="people-suggestions" role="listbox"></div>
          </div>
        </div>
        <div id="uploadStatus" class="status" hidden></div>
        <button class="btn upload-btn" type="submit">Upload to Family Gallery</button>
      </form>
    </div>
  </div></section>
  <section class="section"><div class="wrap"><h2>Family Photos</h2><div id="galleryGrid" class="media-grid gallery-grid">${photos.map(m=>{const tagged=namesFor(m.id);return `<a class="card gallery-photo" target="_blank" href="${publicUrl(m)}"><img src="${publicUrl(m)}" alt="${esc(m.title||'Family photograph')}"><h3>${esc(m.title||'Family photograph')}</h3>${m.description?`<p>${esc(m.description)}</p>`:''}${tagged.length?`<p class="tagged-people"><strong>People:</strong> ${tagged.map(esc).join(', ')}</p>`:''}</a>`}).join('')||'<div class="card">No photographs have been added yet.</div>'}</div></div></section>`;

  const files=document.getElementById('galleryFiles');
  const summary=document.getElementById('fileSummary');
  const search=document.getElementById('personSearch');
  const suggestions=document.getElementById('peopleSuggestions');
  const selectedBox=document.getElementById('selectedPeople');
  const status=document.getElementById('uploadStatus');
  const form=document.getElementById('galleryUploadForm');
  const selected=new Set();

  const renderSelected=()=>{
    selectedBox.innerHTML=[...selected].map(id=>`<button type="button" class="person-chip" data-remove="${esc(id)}"><span>${esc(byId[id]?.name||'Family member')}</span><b aria-hidden="true">×</b></button>`).join('');
    selectedBox.hidden=selected.size===0;
  };

  const showMatches=()=>{
    const q=search.value.trim().toLowerCase();
    const matches=ps.filter(p=>!selected.has(p.id)&&(!q||p.name.toLowerCase().includes(q)));
    suggestions.innerHTML=matches.length?matches.map(p=>`<button type="button" class="person-suggestion" data-person-id="${esc(p.id)}" role="option"><span class="suggestion-avatar">${esc((p.name||'?').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase())}</span><span>${esc(p.name)}</span></button>`).join(''):`<div class="no-suggestions">No matching family member</div>`;
    suggestions.hidden=false;
  };

  files.addEventListener('change',()=>{const fs=[...files.files];summary.textContent=fs.length?`${fs.length} photo${fs.length===1?'':'s'} selected: ${fs.map(f=>f.name).join(', ')}`:'No photos selected yet.'});
  search.addEventListener('input',showMatches);
  search.addEventListener('focus',showMatches);
  suggestions.addEventListener('click',e=>{
    const btn=e.target.closest('[data-person-id]');
    if(!btn)return;
    selected.add(btn.dataset.personId);
    search.value='';
    renderSelected();
    showMatches();
    search.focus();
  });
  selectedBox.addEventListener('click',e=>{
    const btn=e.target.closest('[data-remove]');
    if(!btn)return;
    selected.delete(btn.dataset.remove);
    renderSelected();
    showMatches();
    search.focus();
  });
  renderSelected();
  showMatches();

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const chosen=[...selected], fs=[...files.files];
    if(!fs.length){status.hidden=false;status.className='status error';status.textContent='Please choose at least one photo.';return}
    if(!chosen.length){status.hidden=false;status.className='status error';status.textContent='Please select at least one family member.';return}
    for(const f of fs){if(f.size>10*1024*1024){status.hidden=false;status.className='status error';status.textContent=`${f.name} is larger than 10 MB.`;return}}
    const btn=form.querySelector('button[type="submit"]');btn.disabled=true;status.hidden=false;status.className='status';status.textContent='Uploading photos…';
    try{
      for(const f of fs){
        const ext=(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
        const path=`public-contributions/${crypto.randomUUID()}.${ext}`;
        const {error:ue}=await db.storage.from('family-contributions').upload(path,f,{contentType:f.type||'image/jpeg',upsert:false});if(ue)throw ue;
        const {data:m,error:ie}=await db.from('media').insert({person_id:chosen[0],media_type:'photo',title:document.getElementById('photoTitle').value.trim()||null,description:document.getElementById('photoCaption').value.trim()||null,storage_path:path,bucket_name:'family-contributions',mime_type:f.type||null,is_profile_photo:false}).select('id').single();if(ie)throw ie;
        const {error:te2}=await db.from('media_people').insert(chosen.map(person_id=>({media_id:m.id,person_id})));if(te2)throw te2;
      }
      status.className='status';status.textContent='Photos added successfully. Refreshing the gallery…';setTimeout(()=>location.reload(),800);
    }catch(err){console.error(err);status.className='status error';status.textContent=`Upload failed: ${err.message||err}`;btn.disabled=false}
  });
}

const mobileMenu=document.getElementById('mobileMenu');document.getElementById('menuButton').onclick=()=>mobileMenu.classList.toggle('open');document.getElementById('bottomMenu').onclick=e=>{e.preventDefault();mobileMenu.classList.toggle('open');scrollTo({top:0,behavior:'smooth'})};
load().catch(e=>{console.error(e);app.innerHTML=`<section class="heritage"><div class="wrap"><h1>Gallery</h1><p>Family photographs and shared memories.</p></div></section><section class="section"><div class="wrap"><div class="status error">${esc(e.message||e)}</div></div></section>`});

import {year} from './genealogy-match.js?v=20261003-refined-2';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const recordKey=row=>`${row.provider}:${row.year||''}:${row.id}`;
function identity(value){try{const u=new URL(value),q=new URLSearchParams(u.hash.slice(1));return {host:u.hostname.replace(/^www\./,''),id:u.searchParams.get('record_id')||q.get('a_id')||q.get('id')||'',year:Number(q.get('c20_year'))||0,collection:u.searchParams.has('record_id')?'vital':q.has('a_id')?'c26':u.pathname.includes('c19')?'c19':'c20'};}catch{return {host:'',id:''};}}
export function alreadyVerified(row,person,sources=[],archive=[]){
 const linked=sources.filter(s=>(s.evidence_status==='verified'||(s.evidence_type==='verified_primary'&&s.evidence_status==='published'))&&(s.research_source_people||[]).some(l=>l.person_id===person.id));
 return [...linked,...archive].some(s=>{
  const url=s.external_url||s.url,known=identity(url),candidate=identity(row.url);if(!known.id||(known.host!==candidate.host||known.collection!==candidate.collection))return false;
  if(row.provider==='vital')return known.id===String(row.id);
  const sourceYear=known.year||year(s.event_date_text)||year(s.title);if(sourceYear&&sourceYear!==row.year)return false;
  return [row,...(row.members||[])].some(member=>String(member.id)===known.id);
 });
}
export function sourceDraft(row,person){return {title:row.title||`${row.year||''} Census — ${row.name}`,record_type:row.event,event_date_text:row.date||String(row.year||''),place_text:row.place||'',collection_title:row.provider==='census'?`Census of Ireland ${row.year}`:'Irish Genealogy — civil and church records',repository:row.provider==='census'?'National Archives of Ireland':'Irish Genealogy',archive_reference:`${row.provider}:${row.year||''}:${row.id}`,external_url:row.url,citation:`${row.provider==='census'?'National Archives of Ireland':'Irish Genealogy'}, ${row.date||row.year||''}, record ${row.id}; ${row.url}`,summary:[row.name,row.age!=null?`Age: ${row.age}`:'',row.place,row.occupation,...Object.entries(row.fields||{}).map(([k,v])=>`${k}: ${v}`)].filter(Boolean).join(' • '),evidence_type:'verified_primary',evidence_status:'published'};}
export function attachRecordReview(host,{data,person,db,researchSources,onSaved=()=>{}}){
 host.addEventListener('click',async event=>{
  const button=event.target.closest('[data-review-record]');if(!button)return;
  const row=data.results.find(r=>recordKey(r)===button.dataset.reviewRecord);if(!row)return;
  const card=button.closest('article');if(card.querySelector('.candidate-review'))return;
  const draft=sourceDraft(row,person),form=document.createElement('form');form.className='candidate-review';form.innerHTML=`<h4>Review record for ${esc(person.name)}</h4><p><a href="${esc(row.url)}" target="_blank" rel="noopener">Check the original record</a></p><label>Record title<input name="title" required value="${esc(draft.title)}"></label><label>Record date<input name="date" value="${esc(draft.event_date_text)}"></label><label>Place / address<input name="place" value="${esc(draft.place_text)}"></label><label>Summary / transcription<textarea name="summary" rows="4">${esc(draft.summary)}</textarea></label><label><input name="confirmed" type="checkbox" required> I checked the original and confirm this record belongs to ${esc(person.name)}.</label><p>This saves a verified source linked to this person and makes it visible on their profile.</p><button type="submit" class="btn">Verify &amp; add to site</button> <button type="button" class="admin-secondary candidate-cancel">Cancel</button><p role="status"></p>`;
  card.append(form);form.querySelector('.candidate-cancel').onclick=()=>form.remove();form.querySelector('input').focus();
  form.onsubmit=async e=>{
   e.preventDefault();if(!form.reportValidity())return;const save=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]');save.disabled=true;status.textContent='Saving verified source…';
   try{
    const fd=new FormData(form),payload={...draft,title:String(fd.get('title')).trim(),event_date_text:String(fd.get('date')).trim()||null,place_text:String(fd.get('place')).trim()||null,summary:String(fd.get('summary')).trim()||null};
    const outcome=await saveReviewedSource(db,row,person,payload);
    if(outcome.existing){status.textContent='This record is already saved in Research & Sources. No duplicate was added.';return;}
    const created=outcome.source;researchSources.unshift(created);button.disabled=true;button.textContent='Verified and added';form.replaceWith(Object.assign(document.createElement('p'),{textContent:'Verified record saved and linked to this person’s profile.'}));onSaved(created,row);
   }catch(error){status.textContent=error.message||'Could not save this source. Please try again.';}finally{save.disabled=false;}
  };
 });
}

export async function saveReviewedSource(db,row,person,payload){
 const {data:latest,error:readError}=await db.from('research_sources').select('*, research_source_people(*)');if(readError)throw readError;
 const candidate=identity(row.url),existing=(latest||[]).find(s=>{const known=identity(s.external_url);return candidate.id&&known.id===candidate.id&&known.host===candidate.host&&known.collection===candidate.collection;});
 if(existing)return {existing:true,source:existing};
 const {data:created,error}=await db.from('research_sources').insert(payload).select().single();if(error)throw error;
 const link={source_id:created.id,person_id:person.id,recorded_name:row.name||person.name,recorded_age:row.age==null?null:String(row.age),occupation:row.occupation||null,residence:row.place||null};
 const {error:linkError}=await db.from('research_source_people').insert([link]);
 if(linkError){const {error:cleanupError}=await db.from('research_sources').delete().eq('id',created.id);if(cleanupError)throw Error('The source was saved, but its profile link could not be added. Check Research & Sources before retrying.');throw linkError;}
 return {existing:false,source:{...created,research_source_people:[link]}};
}

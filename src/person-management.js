export function attachPersonManagement(container,{db,people,person}){
  const panel=document.createElement('section');
  panel.className='person-management';
  panel.innerHTML=`<div><span class="source-type">Duplicate and removal tools</span><h3>Manage this person</h3><p>Merge another entry into <strong>${escapeHtml(person.name)}</strong>, or remove this entry if it should not be in the family archive.</p></div><div class="person-merge-row"><label><strong>Duplicate entry to merge</strong><select id="mergePerson"><option value="">Choose another person</option>${people.filter(p=>p.id!==person.id).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}${p.birth_date_text?` — ${escapeHtml(p.birth_date_text)}`:''}</option>`).join('')}</select></label><button id="mergePersonButton" class="admin-secondary" type="button">Merge into this person</button></div><p class="person-management-note">The current profile is kept. Missing details and all connected records from the duplicate are transferred to it.</p><div id="personManagementStatus" class="status" hidden></div><div class="person-delete-row"><div><strong>Delete this person</strong><small>Relationship links will be removed. Uploaded files are preserved in the archive.</small></div><button id="deletePersonButton" class="admin-danger" type="button">Delete person</button></div>`;
  container.append(panel);
  const select=panel.querySelector('#mergePerson'),mergeButton=panel.querySelector('#mergePersonButton'),deleteButton=panel.querySelector('#deletePersonButton'),status=panel.querySelector('#personManagementStatus');

  mergeButton.onclick=async()=>{
    const duplicate=people.find(p=>p.id===select.value);
    if(!duplicate){showError('Choose the duplicate entry first.');return}
    if(!confirm(`Merge “${duplicate.name}” into “${person.name}”?\n\n“${person.name}” will be kept. Relationships, research links, photos, documents and missing details will be transferred from the duplicate.`))return;
    setBusy('Merging both entries…');
    const {error}=await db.rpc('merge_people',{p_keep_id:person.id,p_remove_id:duplicate.id});
    if(error){showError(error.message);return}
    status.textContent='Entries merged successfully. Reloading…';
    setTimeout(()=>location.reload(),800);
  };

  deleteButton.onclick=async()=>{
    const typed=prompt(`Delete “${person.name}”?\n\nThis removes the person and their family-tree links. Uploaded files are preserved.\n\nType DELETE to confirm.`);
    if(typed!=='DELETE')return;
    setBusy('Deleting this entry…');
    const {error}=await db.rpc('delete_person_entry',{p_person_id:person.id});
    if(error){showError(error.message);return}
    status.textContent='Person deleted successfully. Reloading…';
    setTimeout(()=>location.reload(),800);
  };

  function setBusy(message){status.hidden=false;status.className='status';status.textContent=message;mergeButton.disabled=true;deleteButton.disabled=true;select.disabled=true}
  function showError(message){status.hidden=false;status.className='status error';status.textContent=message;mergeButton.disabled=false;deleteButton.disabled=false;select.disabled=false}
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

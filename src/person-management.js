export function attachPersonManagement(container,{db,people,person}){
  const panel=document.createElement('section');
  panel.className='person-management';
  panel.innerHTML=`<div><span class="source-type">Removal tools</span><h3>Manage this person</h3><p>Remove <strong>${escapeHtml(person.name)}</strong> if this entry should not be in the family archive.</p></div><div class="status">Person merging is temporarily unavailable while automatic undo protection is added.</div><div id="personManagementStatus" class="status" hidden></div><div class="person-delete-row"><div><strong>Delete this person</strong><small>Relationship links will be removed. Uploaded files are preserved in the archive.</small></div><button id="deletePersonButton" class="admin-danger" type="button">Delete person</button></div>`;
  container.append(panel);
  const deleteButton=panel.querySelector('#deletePersonButton'),status=panel.querySelector('#personManagementStatus');

  deleteButton.onclick=async()=>{
    const typed=prompt(`Delete “${person.name}”?\n\nThis removes the person and their family-tree links. Uploaded files are preserved.\n\nType DELETE to confirm.`);
    if(typed!=='DELETE')return;
    setBusy('Deleting this entry…');
    const {error}=await db.rpc('delete_person_entry',{p_person_id:person.id});
    if(error){showError(error.message);return}
    status.textContent='Person deleted successfully. Reloading…';
    setTimeout(()=>location.reload(),800);
  };

  function setBusy(message){status.hidden=false;status.className='status';status.textContent=message;deleteButton.disabled=true}
  function showError(message){status.hidden=false;status.className='status error';status.textContent=message;deleteButton.disabled=false}
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

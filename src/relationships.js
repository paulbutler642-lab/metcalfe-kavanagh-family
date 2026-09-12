const choices=[
  ['parent','Parent','child'],['mother','Mother','child'],['father','Father','child'],
  ['son','Son','parent'],['daughter','Daughter','parent'],['child','Child','parent'],
  ['brother','Brother','sibling'],['sister','Sister','sibling'],['sibling','Sibling','sibling'],
  ['husband','Husband','spouse'],['wife','Wife','spouse'],['spouse','Spouse','spouse'],['partner','Partner','partner'],
  ['uncle','Uncle','niece or nephew'],['aunt','Aunt','niece or nephew'],
  ['nephew','Nephew','aunt or uncle'],['niece','Niece','aunt or uncle'],
  ['grandfather','Grandfather','grandchild'],['grandmother','Grandmother','grandchild'],['grandchild','Grandchild','grandparent'],
  ['cousin','Cousin','cousin']
];
const byType=Object.fromEntries(choices.map(x=>[x[0],x]));

export function attachRelationships(container,{db,people,person,relationships,session}){
  const panel=document.createElement('section');
  panel.className='relationship-manager';
  const removalTools=container.querySelector('.person-management');
  if(removalTools)removalTools.before(panel);else container.append(panel);
  const render=()=>{
    const rows=relationships.filter(r=>r.person_id===person.id||r.related_person_id===person.id);
    panel.innerHTML=`<div class="relationship-head"><div><span class="source-type">Family connections</span><h3>Relationships</h3><p>Add another person as a relative of <strong>${escapeHtml(person.name)}</strong>. The reverse connection is created automatically.</p></div></div><div class="relationship-list">${rows.map(row=>{const forward=row.person_id===person.id,otherId=forward?row.related_person_id:row.person_id,label=forward?row.relationship_type:row.reciprocal_type,other=people.find(p=>p.id===otherId);return`<div class="relationship-row"><div><strong>${escapeHtml(other?.name||'Unknown person')}</strong><small>${escapeHtml(title(label))}</small></div><button class="relationship-remove admin-secondary" data-relationship-id="${escapeHtml(row.id)}" type="button">Remove</button></div>`}).join('')||'<p class="muted">No relationships have been added yet.</p>'}</div><form class="relationship-form"><label><span>Family member</span><select name="related_person_id" required><option value="">Choose a person…</option>${people.filter(p=>p.id!==person.id).map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join('')}</select></label><label><span>Relationship to ${escapeHtml(person.name)}</span><select name="relationship_type" required><option value="">Choose relationship…</option>${choices.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label><button class="btn" type="submit">Add relationship</button></form><div class="relationship-status status" hidden></div>`;
    panel.querySelector('.relationship-form').onsubmit=save;
    panel.querySelectorAll('.relationship-remove').forEach(button=>button.onclick=()=>remove(button.dataset.relationshipId));
  };
  async function save(event){
    event.preventDefault();const form=event.currentTarget,status=panel.querySelector('.relationship-status'),fd=new FormData(form),otherId=String(fd.get('related_person_id')||''),type=String(fd.get('relationship_type')||''),choice=byType[type],other=people.find(p=>p.id===otherId);
    if(!choice||!other)return;
    status.hidden=false;status.className='relationship-status status';status.textContent='Adding relationship…';
    const existing=relationships.find(r=>(r.person_id===person.id&&r.related_person_id===otherId)||(r.person_id===otherId&&r.related_person_id===person.id));
    if(existing){status.className='relationship-status status error';status.textContent='A relationship between these two people already exists. Remove it first if you need to change it.';return}
    const payload={person_id:person.id,related_person_id:otherId,relationship_type:type,reciprocal_type:choice[2],created_by:session.user.id};
    const {data,error}=await db.from('person_relationships').insert(payload).select().single();
    if(error){status.className='relationship-status status error';status.textContent=error.message;return}
    relationships.push(data);await logChange('added',other,choice[1]);render();
  }
  async function remove(id){
    const row=relationships.find(r=>r.id===id);if(!row||!confirm('Remove this relationship? Both profiles will be updated.'))return;
    const forward=row.person_id===person.id,other=people.find(p=>p.id===(forward?row.related_person_id:row.person_id)),label=forward?row.relationship_type:row.reciprocal_type;
    const {error}=await db.from('person_relationships').delete().eq('id',id);if(error){alert(error.message);return}
    relationships.splice(relationships.indexOf(row),1);await logChange('removed',other,title(label));render();
  }
  async function logChange(action,other,label){
    await db.from('profile_change_log').insert({person_id:person.id,person_name:person.name,action:'updated',actor_email:session.user.email||'Administrator',changed_fields:['relationships'],before_data:action==='removed'?{relationships:`${other?.name||'Unknown'} — ${label}`}:{},after_data:action==='added'?{relationships:`${other?.name||'Unknown'} — ${label}`}:{}});
  }
  render();
}
function title(v){return String(v||'').replace(/^./,c=>c.toUpperCase())}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

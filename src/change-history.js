const labels={name:'Name',given_names:'Given names',surname:'Surname',relation_label:'Relationship',family_line:'Family line',featured:'Featured person',birth_date_text:'Birth date',birth_place:'Birth place',death_date_text:'Death date',death_place:'Death place',biography:'Biography',notes:'Research notes',gedcom_xref:'GEDCOM reference',initials:'Initials'};

export function mountChangeHistory(container,{changes}){
  container.className='card change-history';
  container.innerHTML=`<div class="change-history-head"><div><span class="source-type">Administrator activity</span><h2>Profile Change History</h2><p class="muted">A permanent record of profile edits made from 12 September 2026 onwards.</p></div><span class="change-count">${changes.length} recent</span></div><div class="change-list">${changes.length?changes.map(renderChange).join(''):'<p class="muted">No profile changes have been recorded since logging was enabled.</p>'}</div>`;
}

function renderChange(change){
  const action=change.action||'updated',fields=(change.changed_fields||[]).filter(f=>f!=='id'),when=new Date(change.created_at).toLocaleString('en-IE',{dateStyle:'medium',timeStyle:'short'}),before=change.before_data||{},after=change.after_data||{};
  const fieldText=action==='updated'?fields.map(f=>labels[f]||title(f)).join(', '):action==='created'?'New profile added':'Profile removed';
  const details=fields.map(field=>`<div class="change-detail"><strong>${escapeHtml(labels[field]||title(field))}</strong><span><small>Before</small>${formatValue(before[field])}</span><span><small>After</small>${formatValue(after[field])}</span></div>`).join('');
  return `<article class="change-entry"><div class="change-summary"><span class="change-action ${escapeHtml(action)}">${escapeHtml(action)}</span><div><strong>${escapeHtml(change.person_name||change.person_id)}</strong><small>${escapeHtml(fieldText||'Profile updated')}</small></div><div class="change-who"><strong>${escapeHtml(change.actor_email||'Unknown administrator')}</strong><small>${escapeHtml(when)}</small></div></div>${details?`<details><summary>View before and after</summary><div class="change-details">${details}</div></details>`:''}</article>`;
}

function formatValue(value){
  if(value===null||value===undefined||value==='')return '<em>Not recorded</em>';
  const text=typeof value==='boolean'?(value?'Yes':'No'):String(value);
  return `<span>${escapeHtml(text.length>500?text.slice(0,500)+'…':text)}</span>`;
}
function title(value){return String(value||'').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase())}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

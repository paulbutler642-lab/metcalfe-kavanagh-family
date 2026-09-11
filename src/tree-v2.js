const params=new URLSearchParams(location.search);
if((params.get('view')||'home')==='tree'){
  const cfg=window.__APP_CONFIG__||{};
  const root=document.getElementById('app');
  const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials=p=>(p.name||'?').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
  const year=s=>{const m=String(s||'').match(/(18|19|20)\d{2}/);return m?m[0]:''};
  const years=p=>{const a=year(p.birth_date_text),b=year(p.death_date_text);return a||b?`${a||'?'} – ${b||''}`:''};
  const db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
  const card=(p,cls='')=>p?`<a class="t2-card ${cls}" href="/?view=profile&id=${p.id}"><div class="avatar">${escapeHtml(initials(p))}</div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(years(p)||'Dates not recorded')}</small></a>`:'';
  const unique=list=>{const seen=new Set();return list.filter(p=>p&&!seen.has(p.id)&&seen.add(p.id));};
  async function render(){
    const [{data:people,error:pe},{data:links,error:le}]=await Promise.all([db.from('people').select('*'),db.from('parent_child').select('*')]);
    if(pe||le) throw pe||le;
    const ps=people||[], rel=links||[];
    const byId=Object.fromEntries(ps.map(p=>[p.id,p]));
    const byName=Object.fromEntries(ps.map(p=>[p.name,p]));
    const parentsOf=id=>unique(rel.filter(r=>r.child_id===id).map(r=>byId[r.parent_id]));
    const childrenOf=id=>unique(rel.filter(r=>r.parent_id===id).map(r=>byId[r.child_id]));
    const william=byName['William Metcalfe'];
    const mary=byName['Mary Kavanagh'];
    if(!william||!mary) throw new Error('William Metcalfe or Mary Kavanagh is missing from the family database.');
    function generationsAbove(person,maxDepth=5){const rows=[];let current=parentsOf(person.id);for(let depth=0;depth<maxDepth&&current.length;depth++){rows.push(current);current=unique(current.flatMap(p=>parentsOf(p.id)));}return rows.reverse();}
    const williamRows=generationsAbove(william),maryRows=generationsAbove(mary);
    const children=unique([...childrenOf(william.id),...childrenOf(mary.id)]).sort((a,b)=>(year(a.birth_date_text)||'9999').localeCompare(year(b.birth_date_text)||'9999'));
    const branch=(title,rows)=>`<section class="t2-branch"><h2 class="t2-branch-title">${escapeHtml(title)}</h2>${rows.map((row,i)=>`<div class="t2-generation">${row.map(p=>card(p)).join('')}</div>${i<rows.length-1?'<div class="t2-vline"></div>':''}`).join('')}</section>`;
    root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore the generations that came before us.</p></div></section><section class="section"><div class="wrap"><div class="t2-scroll"><div class="t2-canvas"><div class="t2-branches">${branch('William’s ancestry',williamRows)}${branch('Mary’s ancestry',maryRows)}</div><div class="t2-join"></div><div class="t2-couple">${card(william,'t2-primary')}${card(mary,'t2-primary')}</div><div class="t2-down"></div><div class="t2-child-rail"></div><div class="t2-children">${children.map(p=>`<div class="t2-child-wrap">${card(p,p.name==='Catherine Metcalfe'?'t2-highlight':'')}</div>`).join('')}</div></div></div><div class="card surname-note"><strong>Surname note:</strong> Medcalf, Metcalf and Metcalfe are historical spelling variants of the same family surname in these records.</div><p class="muted t2-note">The tree is generated from the recorded parent-child relationships in the family database.</p></div></section>`;
  }
  render().catch(e=>{console.error(e);root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore the generations that came before us.</p></div></section><section class="section"><div class="wrap"><div class="status error">${escapeHtml(e.message||e)}</div></div></section>`});
}

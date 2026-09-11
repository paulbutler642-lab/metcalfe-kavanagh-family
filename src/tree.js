const params=new URLSearchParams(location.search);
if((params.get('view')||'home')==='tree'){
  const cfg=window.__APP_CONFIG__||{};
  const root=document.getElementById('app');
  const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials=p=>(p.name||'?').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
  const year=s=>{const m=String(s||'').match(/(18|19|20)\d{2}/);return m?m[0]:''};
  const years=p=>{const a=year(p.birth_date_text),b=year(p.death_date_text);return a||b?`${a||'?'} – ${b||''}`:''};
  const db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);

  const personNode=(p,cls='')=>`<a class="node ${cls}" href="/?view=profile&id=${p.id}"><div class="avatar" style="margin:auto">${escapeHtml(initials(p))}</div><strong>${escapeHtml(p.name)}</strong><small class="muted">${escapeHtml(years(p))}</small></a>`;

  function uniquePeople(list){const seen=new Set();return list.filter(p=>p&&!seen.has(p.id)&&seen.add(p.id));}

  async function render(){
    const [{data:people,error:pe},{data:links,error:le},{data:couples,error:ce}]=await Promise.all([
      db.from('people').select('*'),db.from('parent_child').select('*'),db.from('couples').select('*')
    ]);
    if(pe||le||ce) throw pe||le||ce;
    const ps=people||[], rel=links||[], cps=couples||[];
    const byId=Object.fromEntries(ps.map(p=>[p.id,p]));
    const byName=Object.fromEntries(ps.map(p=>[p.name,p]));
    const parentsOf=id=>uniquePeople(rel.filter(r=>r.child_id===id).map(r=>byId[r.parent_id]));
    const childrenOf=id=>uniquePeople(rel.filter(r=>r.parent_id===id).map(r=>byId[r.child_id]));
    const spouseOf=id=>uniquePeople(cps.filter(c=>c.person1_id===id||c.person2_id===id).map(c=>byId[c.person1_id===id?c.person2_id:c.person1_id]));

    const william=byName['William Metcalfe'];
    const mary=byName['Mary Kavanagh'];
    if(!william||!mary) throw new Error('William Metcalfe or Mary Kavanagh is missing from the family database.');

    const maxDepth=5;
    let current=uniquePeople([...parentsOf(william.id),...parentsOf(mary.id)]);
    const ancestorRows=[];
    for(let depth=0;depth<maxDepth && current.length;depth++){
      ancestorRows.push(current);
      current=uniquePeople(current.flatMap(p=>parentsOf(p.id)));
    }
    ancestorRows.reverse();

    const children=uniquePeople([...childrenOf(william.id),...childrenOf(mary.id)]);
    const generationHtml=ancestorRows.map((row,i)=>{
      const label=`Generation ${ancestorRows.length-i+1}`;
      return `<div class="tree-generation"><div class="tree-generation-label">${label}</div><div class="ancestor-row">${row.map(p=>personNode(p)).join('')}</div><div class="connector"></div></div>`;
    }).join('');

    root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore the generations that came before us.</p></div></section><section class="section"><div class="wrap"><div class="tree-scroll"><div class="tree-stage relationship-tree">${generationHtml}<div class="tree-generation"><div class="tree-generation-label">William & Mary</div><div class="parents-row">${personNode(william,'parent')}${personNode(mary,'parent')}</div><div class="connector"></div><div class="rail"></div></div><div class="tree-generation"><div class="tree-generation-label">Their children</div><div class="children-row">${children.map(p=>`<div class="childwrap">${personNode(p,p.name==='Catherine Metcalfe'?'central':'')}</div>`).join('')}</div></div></div></div><p class="muted" style="margin-top:12px">The tree is generated from the recorded parent-child relationships in the family database.</p></div></section>`;
  }
  render().catch(e=>{console.error(e);root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore the generations that came before us.</p></div></section><section class="section"><div class="wrap"><div class="status error">${escapeHtml(e.message||e)}</div></div></section>`});
}

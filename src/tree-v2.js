const params=new URLSearchParams(location.search);
if((params.get('view')||'home')==='tree'){
  const cfg=window.__APP_CONFIG__||{};
  const root=document.getElementById('app');
  const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initials=p=>(p.name||'?').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
  const year=s=>{const m=String(s||'').match(/(17|18|19|20)\d{2}/);return m?m[0]:''};
  const years=p=>{const a=year(p.birth_date_text),b=year(p.death_date_text);return a||b?`${a||'?'} – ${b||''}`:''};
  const db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);
  const unique=list=>{const seen=new Set();return list.filter(p=>p&&!seen.has(p.id)&&seen.add(p.id));};
  const mediaUrl=m=>m?`${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name||'family-media'}/${m.storage_path}`:'';

  function relativeBox(el,ancestor){
    let left=0,top=0,node=el;
    while(node&&node!==ancestor){left+=node.offsetLeft;top+=node.offsetTop;node=node.offsetParent;}
    return {left,top,width:el.offsetWidth,height:el.offsetHeight,x:left+el.offsetWidth/2,bottom:top+el.offsetHeight};
  }

  function drawConnectors(canvas,rel,peopleById,william,mary,children){
    canvas.querySelector('.t2-lines')?.remove();
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','t2-lines');
    svg.setAttribute('width',canvas.offsetWidth);
    svg.setAttribute('height',canvas.offsetHeight);
    svg.setAttribute('viewBox',`0 0 ${canvas.offsetWidth} ${canvas.offsetHeight}`);
    const cardBox=id=>{const el=canvas.querySelector(`[data-person-id="${id}"]`);return el?relativeBox(el,canvas):null};
    const path=(x1,y1,x2,y2,cls='t2-path')=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');const mid=(y1+y2)/2;p.setAttribute('d',`M ${x1} ${y1} V ${mid} H ${x2} V ${y2}`);p.setAttribute('class',cls);svg.appendChild(p);};
    const childIds=new Set(children.map(c=>c.id));
    rel.forEach(link=>{
      if(childIds.has(link.child_id)&&(link.parent_id===william.id||link.parent_id===mary.id))return;
      const a=cardBox(link.parent_id),b=cardBox(link.child_id);
      if(!a||!b||a.bottom>=b.top)return;
      path(a.x,a.bottom,b.x,b.top);
    });
    const couple=canvas.querySelector('.t2-couple-card');
    if(couple){
      const a=relativeBox(couple,canvas);
      children.forEach(child=>{const b=cardBox(child.id);if(b)path(a.x,a.bottom,b.x,b.top,'t2-path t2-child-path')});
    }
    canvas.prepend(svg);
  }

  function setupZoom(viewport,canvas){
    let scale=1,x=0,y=0,moved=false;
    const pointers=new Map();
    let dragStart=null,pinchStart=null;
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    const apply=()=>{canvas.style.transform=`translate(${x}px,${y}px) scale(${scale})`;const zl=document.getElementById('zoomLevel');if(zl)zl.textContent=`${Math.round(scale*100)}%`;};
    const fit=()=>{
      const pad=28;
      const sx=(viewport.clientWidth-pad)/canvas.offsetWidth;
      const sy=(viewport.clientHeight-pad)/canvas.offsetHeight;
      scale=clamp(Math.min(sx,sy,1),.32,1);
      x=(viewport.clientWidth-canvas.offsetWidth*scale)/2;
      y=Math.max(12,(viewport.clientHeight-canvas.offsetHeight*scale)/2);
      apply();
    };
    const zoomAt=(next,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2)=>{
      next=clamp(next,.3,2.4);
      const contentX=(cx-x)/scale,contentY=(cy-y)/scale;
      x=cx-contentX*next;y=cy-contentY*next;scale=next;apply();
    };
    document.getElementById('zoomIn').onclick=()=>zoomAt(scale+.15);
    document.getElementById('zoomOut').onclick=()=>zoomAt(scale-.15);
    document.getElementById('zoomFit').onclick=fit;
    viewport.addEventListener('wheel',e=>{e.preventDefault();const r=viewport.getBoundingClientRect();zoomAt(scale*(e.deltaY<0?1.12:.89),e.clientX-r.left,e.clientY-r.top)},{passive:false});
    viewport.addEventListener('pointerdown',e=>{
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});viewport.setPointerCapture(e.pointerId);moved=false;
      if(pointers.size===1)dragStart={px:e.clientX,py:e.clientY,x,y};
      if(pointers.size===2){const pts=[...pointers.values()],dx=pts[0].x-pts[1].x,dy=pts[0].y-pts[1].y;const r=viewport.getBoundingClientRect();const mx=(pts[0].x+pts[1].x)/2-r.left,my=(pts[0].y+pts[1].y)/2-r.top;pinchStart={dist:Math.hypot(dx,dy),scale,cx:(mx-x)/scale,cy:(my-y)/scale};dragStart=null;}
    });
    viewport.addEventListener('pointermove',e=>{
      if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pointers.size===1&&dragStart){const dx=e.clientX-dragStart.px,dy=e.clientY-dragStart.py;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;x=dragStart.x+dx;y=dragStart.y+dy;apply();}
      else if(pointers.size===2&&pinchStart){moved=true;const pts=[...pointers.values()],dx=pts[0].x-pts[1].x,dy=pts[0].y-pts[1].y;const r=viewport.getBoundingClientRect();const mx=(pts[0].x+pts[1].x)/2-r.left,my=(pts[0].y+pts[1].y)/2-r.top;scale=clamp(pinchStart.scale*Math.hypot(dx,dy)/pinchStart.dist,.3,2.4);x=mx-pinchStart.cx*scale;y=my-pinchStart.cy*scale;apply();}
    });
    const endPointer=e=>{pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];dragStart={px:p.x,py:p.y,x,y};pinchStart=null}else if(!pointers.size){dragStart=null;pinchStart=null}};
    viewport.addEventListener('pointerup',endPointer);viewport.addEventListener('pointercancel',endPointer);
    viewport.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    window.addEventListener('resize',fit,{passive:true});
    requestAnimationFrame(fit);
    return {fit};
  }

  async function render(){
    const [{data:people,error:pe},{data:links,error:le},{data:media,error:me},{data:couples,error:ce}]=await Promise.all([
      db.from('people').select('*'),
      db.from('parent_child').select('*'),
      db.from('media').select('*').eq('media_type','photo').order('created_at',{ascending:false}),
      db.from('couples').select('*')
    ]);
    if(pe||le||me||ce)throw pe||le||me||ce;
    const ps=people||[],rel=links||[],photos=media||[],pairRows=couples||[];
    const byId=Object.fromEntries(ps.map(p=>[p.id,p]));
    const byName=Object.fromEntries(ps.map(p=>[p.name,p]));
    const profileFor=id=>photos.find(m=>m.person_id===id&&m.is_profile_photo);
    const parentsOf=id=>unique(rel.filter(r=>r.child_id===id).map(r=>byId[r.parent_id]));
    const childrenOf=id=>unique(rel.filter(r=>r.parent_id===id).map(r=>byId[r.child_id]));
    const william=byName['William Metcalfe'],mary=byName['Mary Kavanagh'];
    if(!william||!mary)throw new Error('William Metcalfe or Mary Kavanagh is missing from the family database.');
    const couple=pairRows.find(c=>(c.person1_id===william.id&&c.person2_id===mary.id)||(c.person1_id===mary.id&&c.person2_id===william.id));
    function generationsAbove(person,maxDepth=7){const rows=[];let current=parentsOf(person.id);for(let depth=0;depth<maxDepth&&current.length;depth++){rows.push(current);current=unique(current.flatMap(p=>parentsOf(p.id)));}return rows.reverse();}
    const trees={metcalfe:{label:'Metcalfe / Medcalf',subtitle:'William’s ancestry',rows:generationsAbove(william)},kavanagh:{label:'Kavanagh',subtitle:'Mary’s ancestry',rows:generationsAbove(mary)}};
    const children=unique([...childrenOf(william.id),...childrenOf(mary.id)]).sort((a,b)=>(year(a.birth_date_text)||'9999').localeCompare(year(b.birth_date_text)||'9999'));

    const portrait=p=>{const m=profileFor(p.id);return m?`<img class="t2-photo" src="${mediaUrl(m)}" alt="${escapeHtml(p.name)}">`:`<div class="t2-photo t2-photo-placeholder"><span>${escapeHtml(initials(p))}</span></div>`};
    const card=(p,cls='')=>p?`<a class="t2-person-card ${cls}" data-person-id="${p.id}" href="/?view=profile&id=${encodeURIComponent(p.id)}">${portrait(p)}<strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(years(p)||'Dates not recorded')}</small><span class="t2-view-profile">View Profile</span></a>`:'';
    const ancestry=t=>`<section class="t2-branch t2-single-branch"><div class="t2-side-label">${escapeHtml(t.subtitle)}</div>${t.rows.map(row=>`<div class="t2-generation">${row.map(p=>card(p)).join('')}</div>`).join('')||'<div class="t2-empty-ancestry">No earlier ancestors recorded yet.</div>'}</section>`;
    const marriageBits=[couple?.marriage_date_text,couple?.marriage_place].filter(Boolean);
    const marriage=`<div class="t2-marriage"><div class="t2-rings">◯◯</div><strong>Married</strong>${marriageBits.length?`<small>${marriageBits.map(escapeHtml).join('<br>')}</small>`:`<small>Family</small>`}</div>`;
    const central=`<div class="t2-couple-card"><div class="t2-central-person">${card(william,'t2-primary')}</div>${marriage}<div class="t2-central-person">${card(mary,'t2-primary')}</div></div>`;

    root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore each family line separately, with William and Mary at the centre.</p></div></section>
    <section class="section t2-section"><div class="wrap">
      <div class="t2-family-tabs" role="tablist" aria-label="Choose family line">
        <button type="button" class="t2-family-tab active" data-tree="metcalfe" role="tab" aria-selected="true"><strong>Metcalfe / Medcalf</strong><span>William’s family</span></button>
        <button type="button" class="t2-family-tab" data-tree="kavanagh" role="tab" aria-selected="false"><strong>Kavanagh</strong><span>Mary’s family</span></button>
      </div>
      <div class="t2-toolbar" aria-label="Family tree zoom controls"><button id="zoomOut" type="button" aria-label="Zoom out">−</button><span id="zoomLevel">100%</span><button id="zoomIn" type="button" aria-label="Zoom in">+</button><button id="zoomFit" type="button" class="t2-fit">Fit tree</button><span class="t2-zoom-help">Drag to move • pinch to zoom</span></div>
      <div id="treeViewport" class="t2-viewport">
        <div id="treeCanvas" class="t2-canvas t2-one-line">
          <div class="t2-chart-title" id="treeTitle">Metcalfe / Medcalf Family</div>
          <div id="ancestryBranch" class="t2-branches t2-one-branch">${ancestry(trees.metcalfe)}</div>
          ${central}
          <div class="t2-children-label"><span>Their Children</span></div>
          <div class="t2-children">${children.map(p=>`<div class="t2-child-wrap">${card(p,p.name==='Catherine Metcalfe'?'t2-highlight':'')}</div>`).join('')}</div>
          <div class="t2-tree-footer">Rooted in family history <span>•</span> William Metcalfe &amp; Mary Kavanagh <span>•</span> Connected for generations</div>
        </div>
      </div>
      <div class="card surname-note"><strong>Surname note:</strong> Medcalf, Metcalf and Metcalfe are historical spelling variants of the same family surname in these records.</div>
      <p class="muted t2-note">Switch between the two family lines above. William and Mary remain together at the centre of both trees.</p>
    </div></section>`;

    const canvas=document.getElementById('treeCanvas'),viewport=document.getElementById('treeViewport'),branchHost=document.getElementById('ancestryBranch'),title=document.getElementById('treeTitle');
    const zoom=setupZoom(viewport,canvas);
    const redraw=()=>drawConnectors(canvas,rel,byId,william,mary,children);
    const refresh=()=>requestAnimationFrame(()=>{redraw();setTimeout(()=>{redraw();zoom.fit();},80)});
    document.querySelectorAll('.t2-family-tab').forEach(btn=>btn.addEventListener('click',()=>{
      const key=btn.dataset.tree,t=trees[key];
      document.querySelectorAll('.t2-family-tab').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});
      title.textContent=`${t.label} Family`;
      branchHost.innerHTML=ancestry(t);
      refresh();
    }));
    refresh();
  }

  render().catch(e=>{console.error(e);root.innerHTML=`<section class="heritage"><div class="wrap"><h1>Family Tree</h1><p>Explore the generations that came before us.</p></div></section><section class="section"><div class="wrap"><div class="status error">${escapeHtml(e.message||e)}</div></div></section>`});
}

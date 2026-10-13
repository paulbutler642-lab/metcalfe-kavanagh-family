import {alreadyVerified,recordKey} from '/genealogy-review.js?v=20261003-review-1';
import {nameParts,nameQueries,searchPlan,assessRecord,year} from '/genealogy-match.js?v=20261013-targeted-1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function runGenealogySearch(person,context,onProgress=()=>{}){
 const queries=nameQueries(person),plan=searchPlan(person),results=[],sources=[];
 for(const task of plan){const status={...task,count:0,errors:[],incomplete:false,checkedAt:''};onProgress(`Searching ${task.label}…`);
  for(const {first,surname} of queries){
   onProgress(`Searching ${task.label}: ${first} ${surname}…`);
   const params=new URLSearchParams({source:task.source,first,surname});const born=year(person.birth_date||person.birth_date_text);if(task.source==='census'&&born)params.set('born',born);for(const key of ['year','start','end','event'])if(task[key])params.set(key,task[key]);
   try{const r=await fetch(`/api/genealogy-search?${params}`,{signal:AbortSignal.timeout(58000)}),data=await r.json();if(!r.ok)throw Error(data.error||'Source unavailable');status.count+=data.results.length;status.incomplete ||=data.incomplete;status.checkedAt=data.checkedAt;results.push(...data.results.map(row=>assessRecord(row,person,context)));}
   catch(e){status.errors.push(e.name==='TimeoutError'?'Search timed out.':e.message);if(task.source==='vital')break;}
  }sources.push(status);
 }
 const unique=[...new Map(results.map(r=>[recordKey(r),r])).values()];const saved=unique.filter(r=>alreadyVerified(r,person,context.researchSources||[],context.archive||[]));return {results:unique.filter(r=>!saved.includes(r)),sources,excludedVerified:saved.length};
}
export function renderSearchResults(data){
 const rows=data.results,rank={strong:0,possible:1,conflict:2};rows.sort((a,b)=>rank[a.status]-rank[b.status]);
 const card=r=>`<article class="auto-record-card"><strong>${esc(r.title||r.name)}</strong><p>${esc([r.date,r.place,r.occupation].filter(Boolean).join(' · '))}</p><p><b>${r.status==='strong'?'Strong candidate — review original':'Possible match — further evidence needed'}</b></p><ul>${r.reasons.map(reason=>`<li>${esc(reason)}</li>`).join('')}</ul>${!r.reasons.length?'<p>Not enough indexed evidence to assess this record.</p>':''}<a href="${esc(r.url)}" target="_blank" rel="noopener">Open original record</a>${r.image?` · <a href="${esc(r.image)}" target="_blank" rel="noopener">Open register image</a>`:''}${Object.keys(r.fields||{}).length?`<details><summary>Indexed record details</summary><dl>${Object.entries(r.fields).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details>`:''}<p><button type="button" class="admin-secondary" data-review-record="${esc(recordKey(r))}">Review &amp; add to site</button></p></article>`;
 const cards=rows.filter(r=>r.status==='strong').map(card).join('');
 const weak=rows.filter(r=>r.status==='possible');
 const conflicts=rows.filter(r=>r.status==='conflict');
 return `<p>${data.excludedVerified||0} already-verified records excluded.</p><p>Showing candidates supported by dates and family evidence. Name-only and uncorroborated matches are hidden below. Check the original before adding evidence to the tree.</p><details open><summary>Sources searched</summary><ul>${data.sources.map(s=>`<li><strong>${esc(s.label)}</strong>: ${s.errors.length?`unavailable or partly checked — ${esc([...new Set(s.errors)].join(' '))}`:`${s.count} result${s.count===1?'':'s'} retrieved`}${s.incomplete?' · Search limited; further pages or record details remain unchecked.':''}${s.checkedAt?` · Checked ${esc(new Date(s.checkedAt).toLocaleDateString())}`:''}</li>`).join('')}</ul></details>${cards||'<p>No sufficiently corroborated candidates were found. You can expand weaker matches below for further research.</p>'}${weak.length?`<details><summary>Weaker matches — insufficient family or date evidence (${weak.length})</summary>${weak.map(card).join('')}</details>`:''}${conflicts.length?`<details><summary>Records with conflicting evidence (${conflicts.length})</summary>${conflicts.map(r=>`<article class="auto-record-card"><strong>${esc(r.title||r.name)}</strong><p>${esc(r.conflicts.join('; '))}</p><a href="${esc(r.url)}" target="_blank" rel="noopener">Inspect conflicting record</a></article>`).join('')}</details>`:''}`;
}
export function providerLinks(person){
 const p=nameParts(person),q=encodeURIComponent,first=p.first.split(/\\s+/)[0],born=year(person.birth_date||person.birth_date_text),died=year(person.death_date||person.death_date_text);
 const vital=(event,start,end)=>{const u=new URL('https://www.irishgenealogy.ie/search/');u.searchParams.set('church-or-civil','all');u.searchParams.set('firstname',first);u.searchParams.set('lastname',p.surname);u.searchParams.set('event-'+event,'1');if(start)u.searchParams.set('yearStart',start);if(end)u.searchParams.set('yearEnd',end);return u.href;};
 const link=(href,label)=>`<a target="_blank" rel="noopener noreferrer" href="${esc(href)}">${esc(label)}</a>`;
 const census='https://nationalarchives.ie/collections/search-the-census/';
 const census1926='https://nationalarchives.ie/collections/search-the-1926-census/';
 return `<section class="auto-record-card"><h3>Search original archives manually</h3><p>IrishGenealogy currently refuses automated searches from this site. These links open its own search with the name, record type and known dates entered. On IrishGenealogy, select <strong>Rathdown</strong> as the registration district when appropriate; if nothing is found, remove that filter and widen the years.</p><ul>
 ${born?`<li>${link(vital('birth',born,born),`Birth — ${born} (exact year)`)}</li><li>${link(vital('birth',born-2,born+2),`Birth — ${born-2} to ${born+2}`)}</li>`:`<li>${link(vital('birth',0,0),'Birth records')}</li>`}
 <li>${link(vital('marriage',born?born+15:0,died||0),'Marriage records')}</li>
 <li>${link(vital('death',died?died-2:0,died?died+2:0),'Death records')}</li>
 <li>${link(vital('baptism',born?born-2:0,born?born+5:0),'Baptism records')}</li>
 </ul><p><strong>Irish census:</strong> ${esc(first)} ${esc(p.surname)}${born?` · born ${born} · approximately ${1901-born} in 1901 and ${1911-born} in 1911`:''}. Start with County Dublin and the Stillorgan/Blackrock area where relevant, then broaden. Rathdown is a civil registration district, not a census county or electoral division.</p><ul>
 <li>${link(census,'1901 census — National Archives search')}</li>
 <li>${link(census,'1911 census — National Archives search')}</li>
 <li>${link(census1926,'1926 census — National Archives search')}</li>
 </ul><p>The National Archives uses a newer census search interface, so these links open its official search rather than claiming the fields are prefilled. Check surname variants, household members and original images.</p><details><summary>Other archives</summary><ul>
 <li>${link('https://www.ancestry.co.uk/search/?name='+q(first+'_'+p.surname),'Ancestry')}</li>
 <li>${link('https://www.familysearch.org/en/search/record/results?q.givenName='+q(first)+'&q.surname='+q(p.surname),'FamilySearch')}</li>
 <li>${link('https://www.findmypast.ie/search/results?firstname='+q(first)+'&lastname='+q(p.surname),'Findmypast')}</li>
 </ul></details></section>`;
}
export async function familyContext(db,person){
 const [pc,cp,pr,people]=await Promise.all([db.from('parent_child').select('*'),db.from('couples').select('*'),db.from('person_relationships').select('*'),db.from('people').select('*')]);
 for(const result of [pc,cp,pr,people])if(result.error)throw Error('Family relationships could not be read. Search paused to avoid assessing matches without family context.');
 const parents=new Set(),spouses=new Set(),relatives=new Set(),id=person.id;
 for(const r of pc.data||[]){if(r.child_id===id){parents.add(r.parent_id);relatives.add(r.parent_id);}if(r.parent_id===id)relatives.add(r.child_id);}
 for(const r of cp.data||[]){const a=r.person1_id||r.person_a_id||r.partner1_id,b=r.person2_id||r.person_b_id||r.partner2_id;if(a===id){spouses.add(b);relatives.add(b);}if(b===id){spouses.add(a);relatives.add(a);}}
 for(const r of pr.data||[]){if(r.person_id===id)relatives.add(r.related_person_id);if(r.related_person_id===id)relatives.add(r.person_id);}
 for(const r of pc.data||[])if(parents.has(r.parent_id)&&r.child_id!==id)relatives.add(r.child_id);
 return {parents:(people.data||[]).filter(p=>parents.has(p.id)),spouses:(people.data||[]).filter(p=>spouses.has(p.id)),relatives:(people.data||[]).filter(p=>relatives.has(p.id))};
}

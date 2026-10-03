import { verifiedRecordsFor } from '/family-history-archive.js?v=20260920-anthony-sarah-marriage-1'

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const year = (value) => String(value || '').match(/\b(1\d{3}|20\d{2})\b/)?.[0] || ''
const parts = (person) => {
  const names = String(person.name || '').trim().split(/\s+/)
  return { first: person.given_names || names.slice(0, -1).join(' '), last: person.surname || names.at(-1) || '' }
}
const recordKinds = (person, sources) => {
  const kinds = new Set(sources.filter((source) => source.evidence_status === 'verified' && (source.research_source_people || []).some((link) => link.person_id === person.id)).map((source) => String(source.record_type || '').toLowerCase()))
  for (const record of verifiedRecordsFor(person)) {
    const text = `${record.title || ''} ${record.detail || ''}`.toLowerCase()
    for (const kind of ['birth', 'baptism', 'marriage', 'death', 'burial', 'census', 'military', 'newspaper']) if (text.includes(kind)) kinds.add(kind)
  }
  return kinds
}
const gapsFor = (person, sources) => {
  const kinds = recordKinds(person, sources), gaps = []
  if (person.birth_date_text && !kinds.has('birth') && !kinds.has('baptism')) gaps.push('birth or baptism')
  if (person.death_date_text && !kinds.has('death') && !kinds.has('burial')) gaps.push('death or burial')
  const born = Number(year(person.birth_date_text))
  if (born && born <= 1901 && !kinds.has('census')) gaps.push('1901/1911 census')
  return gaps
}
const searchLinks = (person) => {
  const { first, last } = parts(person), born = Number(year(person.birth_date_text)), died = Number(year(person.death_date_text))
  const q = encodeURIComponent, civilYear = born || died || 1900
  return [
    ['1901 Census', `https://nationalarchives.ie/collections/search-the-census/search-results/?census_year=1901&firstname__icontains=${q(first)}&surname__icontains=${q(last)}`, 'direct'],
    ['1911 Census', `https://nationalarchives.ie/collections/search-the-census/search-results/?census_year=1911&firstname__icontains=${q(first)}&surname__icontains=${q(last)}`, 'direct'],
    ['1926 Census', `/?view=profile&id=${q(person.id)}#automatic-record-search`, 'direct'],
    ['Irish civil records', `https://www.irishgenealogy.ie/search/?church-or-civil=civil&event-birth=1&event-marriage=1&event-death=1&firstname=${q(first)}&lastname=${q(last)}`, 'direct'],
    ['Irish church records', `https://www.irishgenealogy.ie/search/?church-or-civil=church&event-baptism=1&event-marriage=1&event-burial=1&firstname=${q(first)}&lastname=${q(last)}`, 'direct'],
    ['FamilySearch', `https://www.familysearch.org/search/record/results?q.givenName=${q(first)}&q.surname=${q(last)}`, 'account'],
    ['Ancestry', `https://www.ancestry.com/search/?name=${q(`${first}_${last}`)}`, 'subscription'],
    ['Findmypast', `https://www.findmypast.ie/search/results?firstname=${q(first)}&lastname=${q(last)}`, 'subscription'],
  ]
}

export function mountResearchDiscovery(host, { people, researchSources }) {
  host.className = 'card research-discovery'
  host.innerHTML = `<div class="research-discovery-head"><div><span class="source-type">Evidence-gap search</span><h2>Genealogy research</h2><p>Run an automatic search for a person or the whole family, then review candidate records against dates and relatives. The evidence-gap list below also provides direct archive searches.</p></div><span class="mode-key">Automatic searches retrieve records from accessible public sources. Account and subscription collections have separate search links. Source failures are reported; they are not treated as zero matches.</span></div><label class="research-discovery-filter"><strong>Filter people or missing records</strong><input type="search" placeholder="e.g. Denis or death"></label><p class="research-discovery-count muted"></p><div class="research-discovery-list"></div>`
  const input = host.querySelector('input'), count = host.querySelector('.research-discovery-count'), list = host.querySelector('.research-discovery-list')
  const render = () => {
    const query = input.value.trim().toLowerCase()
    const rows = people.map((person) => ({ person, gaps: gapsFor(person, researchSources) })).filter(({ person, gaps }) => gaps.length && (!query || `${person.name} ${gaps.join(' ')}`.toLowerCase().includes(query)))
    count.textContent = `${rows.length} profile${rows.length === 1 ? '' : 's'} with evidence still to verify`
    list.innerHTML = rows.map(({ person, gaps }) => `<details class="research-discovery-person" ${person.id === 'denis-metcalfe' ? 'open' : ''}><summary><span><strong>${esc(person.name)}</strong><small>${esc([person.birth_date_text, person.death_date_text].filter(Boolean).join(' – '))}</small></span><span class="gap-tags">${gaps.map((gap) => `<i>${esc(gap)}</i>`).join('')}</span></summary><div class="provider-links">${searchLinks(person).map(([label, url, mode]) => `<a href="${esc(url)}" target="_blank" rel="noopener"><strong>${esc(label)}</strong><small class="mode-${esc(mode)}">${esc(mode)}</small></a>`).join('')}</div></details>`).join('') || '<p>No matching evidence gaps.</p>'
  }
  input.addEventListener('input', render)
  render()
  mountAutomaticSearch(host,people,researchSources).catch(console.error)
}

async function mountAutomaticSearch(host,people,researchSources){
 const {familyContext,runGenealogySearch,renderSearchResults,providerLinks}=await import('/genealogy-search.js?v=20261003-review-3');
 const {attachRecordReview}=await import('/genealogy-review.js?v=20261003-review-1');
 const block=document.createElement('section');block.className='research-discovery-person';block.innerHTML=`<div style="padding:16px"><h3>Search historical records automatically</h3><p>Retrieve candidates from Irish censuses (1821, 1831, 1841, 1851, 1901, 1911 and 1926) and Irish Genealogy civil and church records. Earlier censuses contain surviving fragments. Only census years within the recorded lifetime are searched.</p><label>Family member <select class="automatic-person">${people.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select></label><p><button type="button" class="btn automatic-one">Search this person</button> <button type="button" class="btn automatic-all">Search all people</button> <button type="button" class="btn automatic-stop" hidden>Stop after current person</button></p><p class="automatic-status" role="status"></p><div class="automatic-output"></div></div>`;
 host.querySelector('.research-discovery-head').after(block);
 const select=block.querySelector('select'),one=block.querySelector('.automatic-one'),all=block.querySelector('.automatic-all'),stop=block.querySelector('.automatic-stop'),status=block.querySelector('[role=status]'),output=block.querySelector('.automatic-output');let cancelled=false;
 stop.onclick=()=>{cancelled=true;stop.disabled=true;status.textContent='Stopping after the current person finishes…';};
 async function run(queue){cancelled=false;one.disabled=all.disabled=true;stop.hidden=false;stop.disabled=false;output.innerHTML='';let completed=0;
  try{for(const person of queue){if(cancelled)break;const context={...await familyContext(window.__SUPABASE_CLIENT__,person),researchSources,archive:verifiedRecordsFor(person)};const data=await runGenealogySearch(person,context,message=>{if(!cancelled)status.textContent=`${completed+1}/${queue.length} — ${person.name}: ${message}`;});const result=document.createElement('details');result.open=queue.length===1;result.innerHTML=`<summary><strong>${esc(person.name)}</strong> — ${data.results.filter(r=>r.status==='strong').length} candidates</summary>${renderSearchResults(data)}${providerLinks(person)}`;output.append(result);attachRecordReview(result,{data,person,db:window.__SUPABASE_CLIENT__,researchSources,onSaved:()=>document.dispatchEvent(new Event('research-source-saved'))});completed++;}status.textContent=`${cancelled?'Search stopped':'Search finished'}. ${completed} of ${queue.length} people checked. Candidate records need review before adding them to the tree.`;}
  catch(e){status.textContent=e.message;}finally{one.disabled=all.disabled=false;stop.hidden=true;}}
 one.onclick=()=>run(people.filter(p=>String(p.id)===select.value));all.onclick=()=>run(people);
}

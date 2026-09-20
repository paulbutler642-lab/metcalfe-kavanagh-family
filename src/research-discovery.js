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
    ['1901 Census', `https://nationalarchives.ie/collections/search-the-census/search-results/?census_year=1901&firstname__icontains=${q(first)}&surname__icontains=${q(last)}`, 'automatic'],
    ['1911 Census', `https://nationalarchives.ie/collections/search-the-census/search-results/?census_year=1911&firstname__icontains=${q(first)}&surname__icontains=${q(last)}`, 'automatic'],
    ['1926 Census', `/?view=profile&id=${q(person.id)}#automatic-records`, 'automatic'],
    ['Irish civil records', `https://www.irishgenealogy.ie/en/civil-records?firstname=${q(first)}&lastname=${q(last)}&yearStart=${civilYear - 2}&yearEnd=${civilYear + 2}`, 'declaration'],
    ['Irish church records', `https://www.irishgenealogy.ie/en/church-records?firstname=${q(first)}&lastname=${q(last)}`, 'assisted'],
    ['FamilySearch', `https://www.familysearch.org/search/record/results?q.givenName=${q(first)}&q.surname=${q(last)}`, 'account'],
    ['Ancestry', `https://www.ancestry.com/search/?name=${q(`${first}_${last}`)}`, 'subscription'],
    ['Findmypast', `https://www.findmypast.ie/search/results?firstname=${q(first)}&lastname=${q(last)}`, 'subscription'],
  ]
}

export function mountResearchDiscovery(host, { people, researchSources }) {
  host.className = 'card research-discovery'
  host.innerHTML = `<div class="research-discovery-head"><div><span class="source-type">Evidence-gap search</span><h2>Automatic research coverage</h2><p>Profiles are checked against saved and archive-backed evidence. Searches use name variants, a ±2 year window, place, age and relatives; a candidate must agree strongly before it can be marked verified. Existing facts are never silently overwritten.</p></div><span class="mode-key"><b>Automatic</b> opens a pre-filled public search. Declaration, account and subscription sources require you to complete their access step.</span></div><label class="research-discovery-filter"><strong>Filter people or missing records</strong><input type="search" placeholder="e.g. Denis or death"></label><p class="research-discovery-count muted"></p><div class="research-discovery-list"></div>`
  const input = host.querySelector('input'), count = host.querySelector('.research-discovery-count'), list = host.querySelector('.research-discovery-list')
  const render = () => {
    const query = input.value.trim().toLowerCase()
    const rows = people.map((person) => ({ person, gaps: gapsFor(person, researchSources) })).filter(({ person, gaps }) => gaps.length && (!query || `${person.name} ${gaps.join(' ')}`.toLowerCase().includes(query)))
    count.textContent = `${rows.length} profile${rows.length === 1 ? '' : 's'} with evidence still to verify`
    list.innerHTML = rows.map(({ person, gaps }) => `<details class="research-discovery-person" ${person.id === 'denis-metcalfe' ? 'open' : ''}><summary><span><strong>${esc(person.name)}</strong><small>${esc([person.birth_date_text, person.death_date_text].filter(Boolean).join(' – '))}</small></span><span class="gap-tags">${gaps.map((gap) => `<i>${esc(gap)}</i>`).join('')}</span></summary><div class="provider-links">${searchLinks(person).map(([label, url, mode]) => `<a href="${esc(url)}" target="_blank" rel="noopener"><strong>${esc(label)}</strong><small class="mode-${esc(mode)}">${esc(mode)}</small></a>`).join('')}</div></details>`).join('') || '<p>No matching evidence gaps.</p>'
  }
  input.addEventListener('input', render)
  render()
}

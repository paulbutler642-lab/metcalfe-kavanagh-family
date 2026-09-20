import { evidenceLabels, familyHistoryFor, verifiedRecordsFor } from '/family-history-archive.js?v=20260920-anthony-sarah-marriage-1'
import { avatarMarkup } from '/avatar.js?v=20260913-gender-avatars-1'
import { displayName } from '/display-name.js?v=20260920-1'
const cfg = window.__APP_CONFIG__ || {}
const app = document.getElementById('app')
const qs = new URLSearchParams(location.search)
const view = qs.get('view') || 'home'
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const initials = (p) =>
  (p.name || '?')
    .split(/\s+/)
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
const year = (s) => {
  const m = String(s || '').match(/\b(1\d{3}|20\d{2})\b/)
  return m ? m[0] : ''
}
const years = (p) => {
  const a = year(p.birth_date_text),
    b = year(p.death_date_text)
  return a || b ? `${a || '?'} – ${b || ''}` : ''
}
const header = (t, s) => `<section class="heritage"><div class="wrap"><h1>${esc(t)}</h1><p>${esc(s)}</p></div></section>`
if (!cfg.SUPABASE_URL || !cfg.SUPABASE_PUBLISHABLE_KEY) {
  app.innerHTML = header('Site configuration needed', 'The family archive is ready, but the Supabase connection has not yet been configured in Vercel.') + '<section class="section"><div class="wrap"><div class="status error">Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY.</div></div></section>'
  throw new Error('Missing Supabase config')
}
const db = window.__SUPABASE_CLIENT__
async function people() {
  const { data, error } = await db.from('people').select('*').order('name')
  if (error) throw error
  return data || []
}
async function media() {
  const { data } = await db.from('media').select('*').order('created_at', { ascending: false })
  return data || []
}
async function sources() {
  const { data, error } = await db.from('research_sources').select('*, research_source_people(*)').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
async function rels() {
  const [{ data: r }, { data: c }] = await Promise.all([db.from('parent_child').select('*'), db.from('couples').select('*')])
  return { r: r || [], c: c || [] }
}
async function profileRelationships() {
  const { data, error } = await db.from('person_relationships').select('*').order('created_at')
  if (error) throw error
  return data || []
}
function personCard(p) {
  return `<a class="card person" href="/?view=profile&id=${p.id}">${avatarMarkup(p)}<div><strong>${esc(displayName(p))}</strong><div class="muted">${esc(years(p) || p.relation_label || 'Family member')}</div>${p.birth_place ? `<small>${esc(p.birth_place)}</small>` : ''}</div></a>`
}
const nameKey = (value) => String(value || '').toLowerCase().replace(/metcalfe|medcalf|metcalf/g, 'metcalf').replace(/[^a-z]/g, '')
const featuredDetails = [
  { names: ['William Metcalfe', 'William Medcalf'], role: 'Soldier, Army boxer and grandfather at the heart of this archive' },
  { names: ['Mary Kavanagh', 'Mary Metcalfe'], role: 'Grandmother connecting the Kavanagh and Metcalfe family stories' },
  { names: ['Enoch Medcalf', 'Enock Medcalf', 'Enoch Metcalfe'], role: 'Born at Altidore; later the subject of a documented 1939 inquest' },
  { names: ['Anthony Medcalf', 'Anthony Metcalf', 'Anthony Metcalfe'], role: 'Gardener associated with Altidore Estate and Enoch’s father' },
]
function featuredAncestorCard(person, role) {
  return `<a class="card person featured-ancestor" href="/?view=profile&id=${encodeURIComponent(person.id)}">${avatarMarkup(person)}<div><strong>${esc(displayName(person))}</strong><div class="muted">${esc(years(person) || person.relation_label || 'Family ancestor')}</div><small>${esc(role)}</small></div></a>`
}
const recentDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
function recentCard(item) {
  const type = item.kind === 'record' ? 'Research record' : item.media_type === 'document' ? 'Document' : 'Photograph'
  const href = item.kind === 'record' ? '/?view=sources' : '/?view=gallery'
  const title = item.title || item.description || `New ${type.toLowerCase()}`
  return `<a class="card recent-item" href="${href}"><span class="recent-type">${esc(type)}</span><strong>${esc(title)}</strong>${item.summary || item.description ? `<p>${esc(item.summary || item.description)}</p>` : ''}<small>${esc(recentDate(item.created_at) || 'Recently added')}</small></a>`
}
async function home() {
  const [ps, ss, med] = await Promise.all([people(), sources().catch(() => []), media().catch(() => [])])
  const featured = featuredDetails.map((entry) => ({ entry, person: ps.find((p) => entry.names.some((name) => nameKey(p.name) === nameKey(name))) })).filter((item) => item.person)
  const recent = [
    ...ss.map((item) => ({ ...item, kind: 'record' })),
    ...med.map((item) => ({ ...item, kind: 'media' })),
  ].filter((item) => item.created_at).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)
  app.innerHTML = `<section class="hero"><div class="wrap"><h1>The Metcalfe & Kavanagh Family</h1><p>Our Family History • Our Stories • Our Heritage</p><a class="btn" href="/?view=tree">Explore Our Family Tree</a></div></section><section class="section"><div class="wrap"><a class="feature historian-home" href="/?view=ask"><span class="ico">🔎</span><span><strong>Ask the Family Historian</strong><small>Ask a question and receive an answer grounded in the family records</small></span><b>Ask a question →</b></a><div class="homegrid"><a class="feature" href="/?view=tree"><span class="ico">🌳</span><strong>Family Tree</strong><small>Explore generations and relationships</small></a><a class="feature" href="/?view=people"><span class="ico">👥</span><strong>People</strong><small>Browse family profiles</small></a><a class="feature" href="/?view=visitors"><span class="ico">✒️</span><strong>Visitors’ Book</strong><small>Sign your name or share a family connection</small></a><a class="feature" href="/?view=gallery"><span class="ico">🗂️</span><strong>Photos &amp; Documents</strong><small>Explore the family archive</small></a></div><div class="subgrid"><a class="feature" href="/?view=sources"><span class="ico">📜</span><strong>Research &amp; Sources</strong><small>Explore census returns and historical records</small></a><a class="feature" href="/?view=places"><span class="ico">📍</span><strong>Places</strong><small>Locations connected to the family</small></a><a class="feature" href="/?view=timeline"><span class="ico">🕰️</span><strong>Timeline</strong><small>The family story in date order</small></a><a class="feature" href="/?view=stories"><span class="ico">✦</span><strong>Stories</strong><small>Lives, memories and family history</small></a></div></div></section><section class="section featured-ancestors-section"><div class="wrap"><div class="home-section-head"><div><span>Central family stories</span><h2>Featured Ancestors</h2></div><a href="/?view=people">View everybody →</a></div><div class="person-grid">${featured.map(({ person, entry }) => featuredAncestorCard(person, entry.role)).join('')}</div></div></section>${recent.length ? `<section class="section recent-section"><div class="wrap"><div class="home-section-head"><div><span>Growing family archive</span><h2>Recently added</h2></div><a href="/?view=gallery">Explore the archive →</a></div><div class="recent-grid">${recent.map(recentCard).join('')}</div></div></section>` : ''}`
}
async function peopleView() {
  const ps = await people()
  app.innerHTML = header('People', 'Meet the people whose lives form our family history.') + `<section class="section"><div class="wrap"><div class="person-grid">${ps.map(personCard).join('')}</div></div></section>`
}
async function placesView() {
  const ps = await people(),
    map = {}
  ps.forEach((p) =>
    [
      ['Birth', p.birth_place],
      ['Death', p.death_place],
    ].forEach(([type, place]) => {
      if (place) (map[place] ??= []).push({ p, type })
    }),
  )
  app.innerHTML =
    header('Places', 'Explore the towns and places connected with the family.') +
    `<section class="section"><div class="wrap places">${
      Object.entries(map)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([pl, items]) => `<div class="card place"><div style="font-size:28px">📍</div><h2>${esc(pl)}</h2><p class="muted">${items.length} recorded family connection${items.length === 1 ? '' : 's'}</p>${items.map((x) => `<p><a href="/?view=profile&id=${x.p.id}"><strong>${esc(x.p.name)}</strong></a> — ${x.type}</p>`).join('')}</div>`)
        .join('') || '<div class="card">No places have been recorded yet.</div>'
    }</div></section>`
}
async function timelineView() {
  const ps = await people(),
    rr = await rels(),
    by = Object.fromEntries(ps.map((p) => [p.id, p])),
    events = [],
    familyOf = (p) => {
      const surname = String(p?.surname || p?.name?.split(/\s+/).at(-1) || '')
        .toLowerCase()
        .replace(/[’']/g, '')
      return surname === 'kavanagh' ? 'kavanagh' : surname === 'metcalfe' || surname === 'medcalf' ? 'metcalfe' : ''
    }
  ps.forEach((p) => {
    const family = familyOf(p)
    if (p.birth_date_text)
      events.push({
        y: +year(p.birth_date_text) || 9999,
        d: p.birth_date_text,
        t: `Birth of ${p.name}`,
        p: p.birth_place,
        families: [family].filter(Boolean),
      })
    if (p.death_date_text)
      events.push({
        y: +year(p.death_date_text) || 9999,
        d: p.death_date_text,
        t: `Death of ${p.name}`,
        p: p.death_place,
        families: [family].filter(Boolean),
      })
  })
  rr.c.forEach((c) => {
    if (c.marriage_date_text) {
      const families = [...new Set([familyOf(by[c.person1_id]), familyOf(by[c.person2_id])].filter(Boolean))]
      events.push({
        y: +year(c.marriage_date_text) || 9999,
        d: c.marriage_date_text,
        t: `Marriage of ${by[c.person1_id]?.name || 'Unknown'} and ${by[c.person2_id]?.name || 'Unknown'}`,
        p: c.marriage_place,
        families,
      })
    }
  })
  events.sort((a, b) => a.y - b.y)
  const counts = {
    all: events.length,
    metcalfe: events.filter((e) => e.families.includes('metcalfe')).length,
    kavanagh: events.filter((e) => e.families.includes('kavanagh')).length,
  }
  app.innerHTML =
    header('Timeline', 'Follow each family story through births, marriages and deaths.') +
    `<section class="section"><div class="wrap"><div class="timeline-family-tabs" role="tablist" aria-label="Choose a family timeline">${[
      ['all', 'All families'],
      ['metcalfe', 'Metcalfe family'],
      ['kavanagh', 'Kavanagh family'],
    ]
      .map(([id, label], i) => `<button class="timeline-family-tab ${i === 0 ? 'active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-family="${id}"><strong>${label}</strong><span>${counts[id]} event${counts[id] === 1 ? '' : 's'}</span></button>`)
      .join('')}</div><p id="timelineCount" class="timeline-count muted"></p><div id="familyTimeline" class="timeline"></div></div></section>`
  const host = document.getElementById('familyTimeline'),
    count = document.getElementById('timelineCount'),
    tabs = [...document.querySelectorAll('.timeline-family-tab')]
  const render = (family) => {
    const shown = family === 'all' ? events : events.filter((e) => e.families.includes(family))
    count.textContent = `${shown.length} event${shown.length === 1 ? '' : 's'} shown in date order`
    host.innerHTML = shown.map((e) => `<div class="card event"><div class="year">${esc(e.d)}</div><h3>${esc(e.t)}</h3>${e.p ? `<p class="muted">📍 ${esc(e.p)}</p>` : ''}</div>`).join('') || '<div class="card">No dated events have been recorded for this family yet.</div>'
  }
  tabs.forEach(
    (tab) =>
      (tab.onclick = () => {
        tabs.forEach((x) => {
          const active = x === tab
          x.classList.toggle('active', active)
          x.setAttribute('aria-selected', String(active))
        })
        render(tab.dataset.family)
      }),
  )
  render('all')
}
async function storiesView() {
  const { data, error } = await db.from('stories').select('*').order('created_at', { ascending: false })
  if (error) throw error
  app.innerHTML = header('Stories', 'Family memories, recollections and historical stories.') + `<section class="section"><div class="wrap"><div class="person-grid">${(data || []).map((s) => `<article class="card story"><div style="font-size:28px">✦</div><h2>${esc(s.title || 'Family story')}</h2><p>${esc(s.summary || s.body || '')}</p></article>`).join('') || '<div class="card story">No stories have been added yet.</div>'}</div></div></section>`
}
const sourceIcon = (t) =>
  ({
    census: '🏠',
    birth: '👶',
    baptism: '⛪',
    marriage: '💍',
    death: '✝',
    burial: '🪦',
    parish: '⛪',
    military: '🎖️',
    newspaper: '📰',
    directory: '📖',
    will: '📜',
    immigration: '⛵',
  })[t] || '📜'
const sourceCard = (s, by = {}) => {
  const original = /^https?:\/\//i.test(s.external_url || '') ? s.external_url : ''
  return `<article class="card source-card"><div class="source-card-top"><span class="source-icon" aria-hidden="true">${sourceIcon(s.record_type)}</span><div><span class="source-type">${esc((s.record_type || 'record').replace(/^./, (x) => x.toUpperCase()))}</span><h2>${esc(s.title)}</h2>${s.evidence_type ? `<span class="evidence-badge evidence-${esc(s.evidence_type)}">${esc(evidenceLabels[s.evidence_type] || 'Historical evidence')}</span>` : ''}</div></div><p class="source-meta">${esc([s.event_date_text, s.place_text, s.repository].filter(Boolean).join(' • '))}</p>${s.summary ? `<p>${esc(s.summary)}</p>` : ''}${s.research_source_people?.length ? `<div class="source-people"><strong>People in this record</strong>${s.research_source_people.map((link) => `<a href="/?view=profile&id=${encodeURIComponent(link.person_id)}">${esc(link.recorded_name || by[link.person_id]?.name || 'Family member')}${link.role_in_record ? ` <small>— ${esc(link.role_in_record)}</small>` : ''}</a>`).join('')}</div>` : ''}<div class="source-actions">${original ? `<a href="${esc(original)}" target="_blank" rel="noopener">View original source ↗</a>` : ''}${s.citation ? `<details><summary>Citation</summary><p>${esc(s.citation)}</p></details>` : ''}${s.transcription ? `<details><summary>Transcription</summary><p>${esc(s.transcription).replace(/\n/g, '<br>')}</p></details>` : ''}</div></article>`
}
async function sourcesView() {
  const [ss, ps] = await Promise.all([sources(), people()]),
    by = Object.fromEntries(ps.map((p) => [p.id, p]))
  app.innerHTML =
    header('Research & Sources', 'Census returns, certificates, parish records and other evidence behind the family story.') +
    `<section class="section research-section"><div class="wrap"><div id="researchFinder"></div><div class="source-library-head"><div><span class="source-type">Family archive</span><h2>Saved research records</h2></div></div><div class="source-toolbar"><label for="sourceSearch"><strong>Search the saved records</strong></label><input id="sourceSearch" type="search" placeholder="Name, place, record or year"><select id="sourceType"><option value="">All record types</option>${[...new Set(ss.map((s) => s.record_type))]
      .sort()
      .map((t) => `<option value="${esc(t)}">${esc(t.replace(/^./, (x) => x.toUpperCase()))}</option>`)
      .join('')}</select></div><p id="sourceCount" class="muted"></p><div id="sourceList" class="source-list"></div></div></section>`
  const { renderResearchFinder } = await import('/research-tools.js?v=20260912-1')
  renderResearchFinder(document.getElementById('researchFinder'), ps)
  const search = document.getElementById('sourceSearch'),
    type = document.getElementById('sourceType'),
    list = document.getElementById('sourceList'),
    count = document.getElementById('sourceCount')
  const render = () => {
    const q = search.value.trim().toLowerCase(),
      filtered = ss.filter((s) => (!type.value || s.record_type === type.value) && (!q || [s.title, s.event_date_text, s.place_text, s.repository, s.collection_title, s.summary, ...(s.research_source_people || []).map((x) => x.recorded_name || by[x.person_id]?.name)].join(' ').toLowerCase().includes(q)))
    count.textContent = `${filtered.length} saved record${filtered.length === 1 ? '' : 's'}`
    list.innerHTML = filtered.map((s) => sourceCard(s, by)).join('') || '<div class="card">No matching research records have been saved yet.</div>'
  }
  search.oninput = render
  type.onchange = render
  render()
}
async function recordsView() {
  const med = (await media()).filter((m) => m.media_type === 'document')
  app.innerHTML =
    header('Records', 'Historical documents and official records connected to the family.') +
    `<section class="section"><div class="wrap records">${
      med
        .map((m) => {
          const u = `${cfg.SUPABASE_URL}/storage/v1/object/public/family-media/${m.storage_path}`
          return `<a class="card record" target="_blank" rel="noopener" href="${u}"><div style="font-size:42px">📜</div><h2>${esc(m.title || 'Family record')}</h2><p>${esc(m.description || 'Open document')}</p></a>`
        })
        .join('') || '<div class="card record">No records have been added yet.</div>'
    }</div></section>`
}
async function galleryView() {
  const med = (await media()).filter((m) => m.media_type === 'photo')
  app.innerHTML =
    header('Gallery', 'Family photographs preserved across the generations.') +
    `<section class="section"><div class="wrap media-grid">${
      med
        .map((m) => {
          const base = `${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name || 'family-media'}/`,
            u = base + m.storage_path,
            thumb = base + (m.thumbnail_path || m.storage_path)
          return `<a class="card" target="_blank" rel="noopener" href="${u}"><img src="${thumb}" alt="${esc(m.title || 'Family photograph')}" loading="lazy"><h3>${esc(m.title || 'Family photograph')}</h3><p class="muted">${esc(m.description || '')}</p></a>`
        })
        .join('') || '<div class="card">No photographs have been added yet.</div>'
    }</div></section>`
}
async function profile() {
  const id = qs.get('id'),
    ps = await people(),
    p = ps.find((x) => x.id === id)
  if (!p) {
    app.innerHTML = header('Person not found', 'The requested family profile could not be found.')
    return
  }
  const history = familyHistoryFor(p)
  const staticVerifiedRecords = verifiedRecordsFor(p)
  const [rr, relationshipRows] = await Promise.all([rels(), profileRelationships()]),
    by = Object.fromEntries(ps.map((x) => [x.id, x]))
  const related = relationshipRows
    .filter((r) => r.person_id === p.id || r.related_person_id === p.id)
    .map((r) => {
      const forward = r.person_id === p.id
      return {
        person: by[forward ? r.related_person_id : r.person_id],
        label: String(forward ? r.relationship_type : r.reciprocal_type).toLowerCase(),
      }
    })
    .filter((x) => x.person)
  const unique = (list) => [...new Map(list.filter(Boolean).map((x) => [x.id, x])).values()]
  const labelled = (...labels) => related.filter((x) => labels.includes(x.label)).map((x) => x.person)
  const parents = unique([...rr.r.filter((x) => x.child_id === p.id).map((x) => by[x.parent_id]), ...labelled('mother', 'father', 'parent')])
  const children = unique([...rr.r.filter((x) => x.parent_id === p.id).map((x) => by[x.child_id]), ...labelled('son', 'daughter', 'child')])
  const spouses = unique([...rr.c.filter((x) => x.person1_id === p.id || x.person2_id === p.id).map((x) => by[x.person1_id === p.id ? x.person2_id : x.person1_id]), ...labelled('husband', 'wife', 'spouse', 'partner')])
  const parentIds = new Set(parents.map((x) => x.id)),
    siblings = unique([...rr.r.filter((x) => parentIds.has(x.parent_id) && x.child_id !== p.id).map((x) => by[x.child_id]), ...labelled('brother', 'sister', 'sibling')])
  const grandparents = unique(parents.flatMap((parent) => rr.r.filter((x) => x.child_id === parent.id).map((x) => by[x.parent_id])))
  const otherRelationships = related.filter((x) => ![...parents, ...children, ...spouses, ...siblings].some((y) => y.id === x.person.id))
  const bits = []
  if (p.birth_date_text || p.birth_place) bits.push(`${p.name} was born${p.birth_date_text ? ' on ' + p.birth_date_text : ''}${p.birth_place ? ' in ' + p.birth_place : ''}.`)
  if (parents.length) bits.push(`${parents.length > 1 ? 'Their recorded parents are' : 'Their recorded parent is'} ${parents.map((x) => displayName(x)).join(' and ')}.`)
  if (spouses.length) bits.push(`${p.name} is recorded as the spouse of ${spouses.map((x) => displayName(x)).join(' and ')}.`)
  if (children.length) bits.push(`Recorded children include ${children.map((x) => displayName(x)).join(', ')}.`)
  if (p.death_date_text || p.death_place) bits.push(`${p.name} died${p.death_date_text ? ' on ' + p.death_date_text : ''}${p.death_place ? ' in ' + p.death_place : ''}.`)
  const [{ data: allMedia }, { data: linked }, { data: sourceLinks }] = await Promise.all([db.from('media').select('*').order('created_at', { ascending: false }), db.from('media_people').select('media_id').eq('person_id', p.id), db.from('research_source_people').select('*, research_sources(*)').eq('person_id', p.id)]),
    linkedIds = new Set((linked || []).map((x) => x.media_id)),
    med = (allMedia || []).filter((m) => m.person_id === p.id || linkedIds.has(m.id)),
    prof = med.find((m) => m.is_profile_photo && m.media_type === 'photo'),
    mediaUrl = (m) => `${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name || 'family-media'}/${m.storage_path}`,
    thumbUrl = (m) => `${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name || 'family-media'}/${m.thumbnail_path || m.storage_path}`,
    img = prof ? mediaUrl(prof) : null,
    photos = med.filter((m) => m.media_type === 'photo' && !m.is_profile_photo),
    documents = med.filter((m) => m.media_type === 'document'),
    personSources = (sourceLinks || []).map((x) => ({ ...x.research_sources, research_source_people: [x] })).filter((x) => x.id),
    profileImages = new Map((allMedia || []).filter((m) => m.is_profile_photo && m.media_type === 'photo' && m.person_id).map((m) => [m.person_id, thumbUrl(m)]))
  const databaseVerifiedRecords = personSources
    .filter((source) => source.evidence_status === 'verified' && /^https?:\/\//i.test(source.external_url || ''))
    .map((source) => ({
      title: source.title,
      detail: source.summary || [source.event_date_text, source.place_text, source.repository].filter(Boolean).join(' • '),
      url: source.external_url,
      linkLabel: `View record — ${source.repository || 'original source'}`,
    }))
  const verifiedRecords = [...new Map([...staticVerifiedRecords, ...databaseVerifiedRecords].map((record) => [record.url || record.title, record])).values()]
  const cards = (list) => list.map((m) => `<a class="profile-media-card" target="_blank" rel="noopener" href="${mediaUrl(m)}">${m.media_type === 'photo' ? `<img src="${m.thumbnail_path ? `${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name || 'family-media'}/${m.thumbnail_path}` : mediaUrl(m)}" alt="${esc(m.title || 'Family photograph')}" loading="lazy">` : '<span class="profile-doc-icon">📜</span>'}<div><strong>${esc(m.title || m.original_filename || (m.media_type === 'photo' ? 'Family photograph' : 'Family document'))}</strong><small>${esc([m.category, m.event_date_text].filter(Boolean).join(' • '))}</small></div></a>`).join('')
  const personTile = (person, label = '') => `<a class="kin-card" href="/?view=profile&id=${encodeURIComponent(person.id)}">${profileImages.has(person.id) ? `<img src="${profileImages.get(person.id)}" alt="">` : avatarMarkup(person)}<span><strong>${esc(displayName(person))}</strong><small>${esc(label || years(person) || 'Family member')}</small></span></a>`
  const treeNode = (person, kind = '') => (person ? `<a class="focus-node ${kind}" href="/?view=profile&id=${encodeURIComponent(person.id)}">${profileImages.has(person.id) ? `<img src="${profileImages.get(person.id)}" alt="">` : avatarMarkup(person)}<strong>${esc(displayName(person))}</strong><small>${esc(years(person))}</small></a>` : '')
  const historyBadge = (type) => `<span class="evidence-badge evidence-${esc(type)}">${esc(evidenceLabels[type] || 'Historical evidence')}</span>`
  const verifiedRecordsSection = verifiedRecords.length ? `<section id="verified-records" class="card profile-panel verified-records"><div class="profile-section-head"><div><span class="section-kicker">Official historical sources</span><h2>Verified Records</h2></div></div><div class="verified-record-grid">${verifiedRecords.map((record) => `<article>${historyBadge('verified_primary')}<h3>${esc(record.title)}</h3><p>${esc(record.detail)}</p><a class="chapter-record-link" href="${esc(record.url)}" target="_blank" rel="noopener">${esc(record.linkLabel || 'View record — Irish Genealogy')} ↗</a></article>`).join('')}</div></section>` : ''
  const historySection = history ? `<section id="verified-history" class="card profile-panel verified-history"><div class="profile-section-head"><div><span class="section-kicker">Verified family archive</span><h2>${esc(history.heading)}</h2></div></div><p class="history-summary">${esc(history.summary)}</p><div class="history-chapters">${history.chapters.map((chapter) => `<article>${historyBadge(chapter.evidence)}<h3>${esc(chapter.title)}</h3><p>${esc(chapter.text)}</p>${chapter.recordUrl ? `<a class="chapter-record-link" href="${esc(chapter.recordUrl)}" target="_blank" rel="noopener">${esc(chapter.recordLabel || 'View verified record')} ↗</a>` : ''}</article>`).join('')}</div>${history.notes?.length ? `<details class="research-notes"><summary>Research notes and unresolved questions</summary><ul>${history.notes.map((note) => `<li>${esc(note)}</li>`).join('')}</ul></details>` : ''}</section>` : ''
  const archiveSection = history?.documents?.length ? `<section id="historical-documents" class="card profile-panel historical-documents"><div class="profile-section-head"><div><span class="section-kicker">Original material</span><h2>Historical Documents</h2></div></div>${history.documents.map((item) => `<article class="historical-document"><a class="historical-document-preview" href="${esc(item.original)}" target="_blank" rel="noopener" aria-label="View original ${esc(item.title)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"><span>Tap to enlarge and view the original</span></a><div class="historical-document-copy">${historyBadge(item.evidence)}<h3>${esc(item.title)}</h3><p class="source-meta">${esc([item.date, item.publication].filter(Boolean).join(' • '))}</p><p>${esc(item.caption)}</p><h4>Historical context</h4><p>${esc(item.context)}</p><h4>Provenance ${historyBadge(item.provenanceEvidence)}</h4><p>${esc(item.provenance)}</p><div class="document-actions"><a href="${esc(item.original)}" target="_blank" rel="noopener">View original image ↗</a></div></div></article>`).join('')}</section>` : ''
  const nav = [
    ['overview', 'Overview', true],
    ['verified-records', 'Verified Records', verifiedRecords.length],
    ['verified-history', 'Verified History', !!history],
    ['historical-documents', 'Archive', history?.documents?.length],
    ['story', 'Life Story', !!p.biography],
    ['family', 'Family', parents.length + siblings.length + spouses.length + children.length],
    ['photos', 'Photos', photos.length],
    ['sources', 'Research', personSources.length],
    ['places', 'Places', p.birth_place || p.death_place],
    ['timeline', 'Timeline', p.birth_date_text || p.death_date_text],
  ].filter((x) => x[2])
  const intro = (p.biography || bits.join(' ') || `This profile currently contains limited recorded information for ${p.name}.`).split(/\n+/)[0]
  app.innerHTML = `<section class="profile-banner"><div class="wrap"><a href="/?view=people">← All people</a><span>Family profile</span></div></section><section id="overview" class="profile-v1-hero"><div class="wrap profile-v1-hero-grid">${img ? `<img class="profile-v1-photo" src="${img}" alt="${esc(displayName(p))}">` : `<div class="profile-v1-photo profile-v1-placeholder">${esc(initials(p))}</div>`}<div class="profile-v1-copy"><p class="profile-eyebrow">Family profile</p><h1>${esc(displayName(p))}</h1>${years(p) ? `<p class="profile-lifespan">${esc(years(p))}</p>` : ''}<p class="profile-intro">${esc(intro)}</p><div id="places" class="profile-v1-facts">${p.birth_date_text || p.birth_place ? `<div><strong>Born</strong><span>${esc([p.birth_date_text, p.birth_place].filter(Boolean).join(' · '))}</span></div>` : ''}${p.death_date_text || p.death_place ? `<div><strong>Died</strong><span>${esc([p.death_date_text, p.death_place].filter(Boolean).join(' · '))}</span></div>` : ''}</div></div></div></section><nav class="profile-tabs" aria-label="Profile sections"><div class="wrap">${nav.map((x) => `<a href="#${x[0]}">${x[1]}</a>`).join('')}</div></nav><section class="profile-v1-body"><div class="wrap profile-v1-layout"><aside class="profile-side"><strong>In this profile</strong>${nav.map((x) => `<a href="#${x[0]}">${x[1]}</a>`).join('')}<a href="/?view=tree&amp;focus=${encodeURIComponent(p.id)}">Full family tree ↗</a></aside><div class="profile-v1-content"><section class="card profile-overview"><span class="section-kicker">Overview</span><h2>At a glance</h2><p>${esc(bits.join(' ') || intro)}</p></section><section id="family" class="profile-family-grid">${parents.length ? `<div class="card profile-panel"><span class="section-kicker">Family</span><h2>Parents</h2><div class="kin-grid">${parents.map((x) => personTile(x)).join('')}</div></div>` : ''}${siblings.length ? `<div class="card profile-panel"><span class="section-kicker">Same generation</span><h2>Siblings</h2><div class="kin-grid">${siblings.map((x) => personTile(x)).join('')}</div></div>` : ''}${spouses.length || children.length ? `<div class="card profile-panel"><span class="section-kicker">Immediate family</span><h2>Partner &amp; children</h2><div class="kin-grid">${spouses.map((x) => personTile(x, 'Spouse or partner')).join('')}${children.map((x) => personTile(x, 'Child')).join('')}</div></div>` : ''}</section>${parents.length + siblings.length + spouses.length + children.length + grandparents.length ? `<section class="card profile-panel focused-tree"><div class="profile-section-head"><div><span class="section-kicker">Family context</span><h2>Focused family tree</h2></div><a href="/?view=tree&amp;focus=${encodeURIComponent(p.id)}">Open full tree</a></div>${grandparents.length ? `<div class="focus-generation"><span>Grandparents</span><div>${grandparents.map((x) => treeNode(x)).join('')}</div></div>` : ''}${parents.length ? `<div class="focus-generation"><span>Parents</span><div>${parents.map((x) => treeNode(x)).join('')}</div></div>` : ''}<div class="focus-generation current"><span>Current person</span><div>${treeNode(p, 'active')}${spouses.map((x) => treeNode(x)).join('')}</div></div>${siblings.length ? `<div class="focus-generation"><span>Siblings</span><div>${siblings.map((x) => treeNode(x)).join('')}</div></div>` : ''}${children.length ? `<div class="focus-generation"><span>Children</span><div>${children.map((x) => treeNode(x)).join('')}</div></div>` : ''}</section>` : ''}${
    otherRelationships.length
      ? `<section class="card profile-panel"><h2>Other relationships</h2><div class="kin-grid">${otherRelationships
          .map((x) =>
            personTile(
              x.person,
              x.label.replace(/^./, (c) => c.toUpperCase()),
            ),
          )
          .join('')}</div></section>`
      : ''
  }<section id="story" class="card profile-panel"><span class="section-kicker">Their story</span><h2>Life Story</h2><p>${esc(p.biography || 'No personal life story has been added yet.').replace(/\n/g, '<br>')}</p></section>${personSources.length ? `<section id="sources" class="card profile-panel"><div class="profile-section-head"><h2>Research &amp; Sources <span>${personSources.length}</span></h2><a href="/?view=sources">Search all records</a></div><div class="profile-source-list">${personSources.map((s) => sourceCard(s, by)).join('')}</div></section>` : ''}${photos.length ? `<section id="photos" class="card profile-panel"><div class="profile-section-head"><h2>Photos <span>${photos.length}</span></h2><a href="/?view=gallery&person=${encodeURIComponent(p.id)}&type=photo">View all</a></div><div class="profile-media-grid">${cards(photos)}</div></section>` : ''}${documents.length ? `<section class="card profile-panel"><div class="profile-section-head"><h2>Documents <span>${documents.length}</span></h2></div><div class="profile-media-grid">${cards(documents)}</div></section>` : ''}<section class="profile-shortcuts"><a class="card" href="#story"><span>✦</span><strong>Read Life Story</strong><small>Memories and information about ${esc(displayName(p))}</small></a>${photos.length ? `<a class="card" href="#photos"><span>▧</span><strong>Browse Photos</strong><small>Photographs linked to this profile</small></a>` : ''}<a class="card" href="/?view=tree&amp;focus=${encodeURIComponent(p.id)}"><span>♧</span><strong>Explore Family Tree</strong><small>See the wider family across generations</small></a><a id="timeline" class="card" href="/?view=timeline"><span>◷</span><strong>View Timeline</strong><small>Explore the family story in date order</small></a></section></div></div></section>`
  const overviewPanel = document.querySelector('.profile-overview')
  if (overviewPanel && (verifiedRecordsSection || historySection || archiveSection)) {
    overviewPanel.insertAdjacentHTML('afterend', verifiedRecordsSection + historySection + archiveSection)
  }
}
async function treeView() {
  const ps = await people(),
    rr = await rels(),
    by = Object.fromEntries(ps.map((p) => [p.name, p]))
  const node = (p, cl = '') => (p ? `<a class="node ${cl}" href="/?view=profile&id=${p.id}">${avatarMarkup(p, 'avatar centered-avatar')}<strong>${esc(displayName(p))}</strong><small class="muted">${esc(years(p))}</small></a>` : '')
  const wm = by['William Metcalfe'],
    mk = by['Mary Kavanagh'],
    children = wm
      ? rr.r
          .filter((x) => x.parent_id === wm.id)
          .map((x) => ps.find((p) => p.id === x.child_id))
          .filter(Boolean)
      : [],
    anc = ['Anthony Metcalf', 'Sarah Jane Metcalf', 'Enoch Medcalf', 'Mary King', 'Thomas Kavanagh', 'Anne Carroll', 'Owen Kavanagh', 'Elizabeth Kavanagh'].map((n) => by[n]).filter(Boolean)
  app.innerHTML =
    header('Family Tree', 'Explore the generations that came before us.') +
    `<section class="section"><div class="wrap"><div class="tree-scroll"><div class="tree-stage"><div class="ancestor-row">${anc
      .slice(0, 4)
      .map((p) => node(p))
      .join('')}</div><div class="connector"></div><div class="parents-row">${node(wm, 'parent')}${node(mk, 'parent')}</div><div class="connector"></div><div class="rail"></div><div class="children-row">${children.map((p) => `<div class="childwrap">${node(p, p.name === 'Catherine Metcalfe' ? 'central' : '')}</div>`).join('')}</div></div></div></div></section>`
}
const mobileMenu = document.getElementById('mobileMenu')
document.getElementById('menuButton').onclick = () => mobileMenu.classList.toggle('open')
document.getElementById('bottomMenu').onclick = (e) => {
  e.preventDefault()
  mobileMenu.classList.toggle('open')
  scrollTo({ top: 0, behavior: 'smooth' })
}
;(async () => {
  try {
    if (view === 'home' && (qs.get('code') || location.hash.includes('access_token='))) {
      if (qs.get('code')) {
        const { error } = await db.auth.exchangeCodeForSession(qs.get('code'))
        if (error) throw error
      }
      const { data } = await db.auth.getSession()
      if (data.session) {
        location.replace('/?view=admin')
        return
      }
    }
    if (view === 'tree') await treeView()
    else if (view === 'people') await peopleView()
    else if (view === 'places') await placesView()
    else if (view === 'timeline') await timelineView()
    else if (view === 'stories') await storiesView()
    else if (view === 'sources' || view === 'research') await sourcesView()
    else if (view === 'records') await recordsView()
    else if (view === 'gallery') await galleryView()
    else if (view === 'profile') await profile()
    else await home()
  } catch (e) {
    console.error(e)
    app.innerHTML = header('Something went wrong', 'The family archive could not load this section.') + `<section class="section"><div class="wrap"><div class="status error">${esc(e.message || e)}</div></div></section>`
  }
})()

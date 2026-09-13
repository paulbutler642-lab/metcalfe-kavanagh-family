import { searchTermsFor } from '/family-history-archive.js?v=20260913-1'
const cfg = window.__APP_CONFIG__ || {}
const app = document.getElementById('app')
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const initials = (p) =>
  (p.name || '?')
    .split(/\s+/)
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
const year = (s) => {
  const m = String(s || '').match(/(17|18|19|20)\d{2}/)
  return m ? m[0] : ''
}
const years = (p) => {
  const a = year(p.birth_date_text),
    b = year(p.death_date_text)
  return a || b ? `${a || '?'} – ${b || ''}` : ''
}
const db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY)
const header = (t, s) => `<section class="heritage"><div class="wrap"><h1>${esc(t)}</h1><p>${esc(s)}</p></div></section>`

const mobileMenu = document.getElementById('mobileMenu')
document.getElementById('menuButton').onclick = () => mobileMenu.classList.toggle('open')
document.getElementById('bottomMenu').onclick = (e) => {
  e.preventDefault()
  mobileMenu.classList.toggle('open')
  scrollTo({ top: 0, behavior: 'smooth' })
}

async function render() {
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_PUBLISHABLE_KEY) throw new Error('Supabase configuration is missing.')
  const [{ data: people, error: pe }, { data: media, error: me }] = await Promise.all([db.from('people').select('*').order('name'), db.from('media').select('*').eq('media_type', 'photo').order('created_at', { ascending: false })])
  if (pe || me) throw pe || me
  const ps = people || [],
    photos = media || []
  const profileFor = (id) => photos.find((m) => m.person_id === id && m.is_profile_photo)
  const mediaUrl = (m) => (m ? `${cfg.SUPABASE_URL}/storage/v1/object/public/${m.bucket_name || 'family-media'}/${m.thumbnail_path || m.storage_path}` : '')
  const isMetcalfe = (p) => /metcalfe/i.test(p.family_line || '') || /children/i.test(p.family_line || '')
  const isKavanagh = (p) => /^kavanagh$/i.test((p.family_line || '').trim())
  const groups = {
    metcalfe: ps.filter(isMetcalfe),
    kavanagh: ps.filter(isKavanagh),
  }
  let active = 'metcalfe'

  const card = (p) => {
    const m = profileFor(p.id)
    return `<a class="card person people-card" href="/?view=profile&id=${encodeURIComponent(p.id)}">${m ? `<img class="people-avatar-img" src="${mediaUrl(m)}" alt="${esc(p.name)}">` : `<div class="avatar">${esc(initials(p))}</div>`}<div class="people-card-copy"><strong>${esc(p.name)}</strong><div class="muted">${esc(years(p) || p.relation_label || 'Family member')}</div>${p.birth_place ? `<small>${esc(p.birth_place)}</small>` : ''}${p.biography ? `<p class="people-snippet">${esc(p.biography)}</p>` : ''}</div></a>`
  }

  app.innerHTML =
    header('People', 'Browse the Metcalfe / Medcalf and Kavanagh sides of the family separately.') +
    `<section class="section people-section"><div class="wrap">
    <style>
      .people-tabs{display:flex;gap:8px;margin:0 0 20px;padding:5px;background:#e7eee9;border:1px solid #cfdbd3;border-radius:14px;width:max-content;max-width:100%}
      .people-tab{border:0;background:transparent;color:var(--forest);padding:11px 18px;border-radius:10px;font-weight:700;cursor:pointer;white-space:nowrap}
      .people-tab.active{background:var(--forest);color:#fff;box-shadow:0 4px 12px rgba(23,59,50,.16)}
      .people-heading{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:14px}
      .people-search{width:100%;max-width:520px;margin:0 0 18px;padding:12px 14px;border:1px solid #bdccc1;border-radius:10px;background:#fff;font:inherit}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      .people-heading h2{margin:0}.people-count{color:var(--muted);font-size:13px}
      .people-card{align-items:flex-start}.people-avatar-img{width:66px;height:66px;border-radius:50%;object-fit:cover;border:2px solid #c8d8cd;flex:0 0 66px}
      .people-card-copy{min-width:0}.people-snippet{font-size:12px;line-height:1.35;color:var(--muted);margin:7px 0 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      @media(max-width:560px){.people-tabs{width:100%;display:grid;grid-template-columns:1fr 1fr}.people-tab{padding:10px 8px;font-size:13px}.people-heading{align-items:center}.people-section{padding-top:22px}.people-card{padding:15px}}
    </style>
    <div class="people-tabs" role="tablist" aria-label="Family line">
      <button class="people-tab active" type="button" data-line="metcalfe" role="tab" aria-selected="true">Metcalfe / Medcalf</button>
      <button class="people-tab" type="button" data-line="kavanagh" role="tab" aria-selected="false">Kavanagh</button>
    </div>
    <label for="peopleSearch" class="sr-only">Search people and surname variants</label><input id="peopleSearch" class="people-search" type="search" placeholder="Search names, including Medcalf, Metcalf or Metcalfe" autocomplete="off">
    <div class="people-heading"><h2 id="peopleLineTitle">Metcalfe / Medcalf Family</h2><span id="peopleCount" class="people-count"></span></div>
    <div id="peopleGrid" class="person-grid"></div>
  </div></section>`

  const grid = document.getElementById('peopleGrid'),
    title = document.getElementById('peopleLineTitle'),
    count = document.getElementById('peopleCount'),
    search = document.getElementById('peopleSearch')
  const paint = () => {
    const query = search.value.trim().toLowerCase()
    const list = groups[active].filter((person) => !query || searchTermsFor(person).includes(query))
    title.textContent = active === 'metcalfe' ? 'Metcalfe / Medcalf Family' : 'Kavanagh Family'
    count.textContent = `${list.length} ${list.length === 1 ? 'person' : 'people'}`
    grid.innerHTML = list.map(card).join('') || '<div class="card">No people have been added to this family line yet.</div>'
  }
  document.querySelectorAll('.people-tab').forEach((btn) =>
    btn.addEventListener('click', () => {
      active = btn.dataset.line
      document.querySelectorAll('.people-tab').forEach((b) => {
        const on = b === btn
        b.classList.toggle('active', on)
        b.setAttribute('aria-selected', String(on))
      })
      paint()
    }),
  )
  search.addEventListener('input', paint)
  paint()
}

render().catch((e) => {
  console.error(e)
  app.innerHTML = header('People', 'The people section could not load.') + `<section class="section"><div class="wrap"><div class="status error">${esc(e.message || e)}</div></div></section>`
})

// Makes the richest evidence-backed Life Story the prominent introduction on every family profile.
import { familyHistoryFor } from '/family-history-archive.js?v=20260914-william-boxing-1'

const params = new URLSearchParams(location.search)
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c])
const normalise = (text) => String(text || '').replace(/\\n/g, '\n').trim()
const storyHtml = (text) => normalise(text).split(/\n\s*\n|\n+/).filter(Boolean).map((p) => `<p>${esc(p.trim())}</p>`).join('')

if (params.get('view') === 'profile') {
  const enhance = async () => {
    const app = document.getElementById('app')
    const hero = document.querySelector('.profile-v1-copy')
    const existingIntro = hero?.querySelector('.profile-intro, .prominent-life-story')
    const storyPanel = document.querySelector('#story')
    if (!app || !hero || !existingIntro || !storyPanel || hero.dataset.richStoryEnhanced === '1') return false

    const id = params.get('id')
    const cfg = window.__APP_CONFIG__ || {}
    let person = null
    if (id && cfg.SUPABASE_URL && cfg.SUPABASE_PUBLISHABLE_KEY && window.supabase) {
      const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY)
      const { data } = await db.from('people').select('*').eq('id', id).maybeSingle()
      person = data || null
    }

    const biography = normalise(person?.biography)
    const history = person ? familyHistoryFor(person) : null
    const researchedStory = history
      ? [history.summary, ...(history.chapters || []).map((chapter) => chapter.text)].filter(Boolean).join('\n\n')
      : ''

    // Prefer a substantial bespoke biography. If it is only a short teaser,
    // use the richer verified archive narrative (important for William).
    let fullStory = biography.length >= 500 ? biography : (researchedStory || biography)
    if (!fullStory) {
      fullStory = normalise(document.querySelector('.profile-overview p')?.textContent)
    }
    if (!fullStory || fullStory === 'No personal life story has been added yet.') return false

    const limit = 1050
    const isLong = fullStory.length > limit
    let preview = fullStory
    if (isLong) preview = fullStory.slice(0, limit).replace(/\s+\S*$/, '').trim() + '…'

    const block = document.createElement('div')
    block.className = 'profile-intro prominent-life-story'
    block.innerHTML = storyHtml(preview)
    if (isLong) {
      const more = document.createElement('a')
      more.className = 'prominent-story-more chapter-record-link'
      more.href = '#story'
      more.textContent = 'Continue reading ↓'
      block.appendChild(more)
    }
    existingIntro.replaceWith(block)

    // Keep the lower Life Story section in sync with the complete narrative.
    const storyText = storyPanel.querySelector('p')
    if (storyText) storyText.innerHTML = storyHtml(fullStory)
    else storyPanel.insertAdjacentHTML('beforeend', `<div class="life-story-full">${storyHtml(fullStory)}</div>`)

    hero.dataset.richStoryEnhanced = '1'
    return true
  }

  enhance()
  const observer = new MutationObserver(() => { enhance() })
  observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true })
  setTimeout(() => observer.disconnect(), 10000)
}

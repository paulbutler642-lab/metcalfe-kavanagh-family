// Makes the evidence-backed Life Story the prominent introduction on every family profile.
const params = new URLSearchParams(location.search)
if (params.get('view') === 'profile') {
  const enhance = () => {
    const hero = document.querySelector('.profile-v1-copy')
    const existingIntro = hero?.querySelector('.profile-intro')
    const storyPanel = document.querySelector('#story')
    const storyTextNode = storyPanel?.querySelector('p')
    if (!hero || !existingIntro || !storyTextNode || hero.dataset.storyEnhanced === '1') return false

    const raw = (storyTextNode.innerText || storyTextNode.textContent || '').replace(/\\n/g, '\n').trim()
    if (!raw || raw === 'No personal life story has been added yet.') return false

    const limit = 1050
    const isLong = raw.length > limit
    let preview = raw
    if (isLong) {
      preview = raw.slice(0, limit)
      preview = preview.replace(/\s+\S*$/, '').trim() + '…'
    }

    const block = document.createElement('div')
    block.className = 'profile-intro prominent-life-story'
    preview.split(/\n+/).filter(Boolean).forEach((paragraph) => {
      const p = document.createElement('p')
      p.textContent = paragraph.trim()
      block.appendChild(p)
    })
    if (isLong) {
      const more = document.createElement('a')
      more.className = 'prominent-story-more'
      more.href = '#story'
      more.textContent = 'Continue reading ↓'
      block.appendChild(more)
    }

    existingIntro.replaceWith(block)
    hero.dataset.storyEnhanced = '1'
    return true
  }

  if (!enhance()) {
    const observer = new MutationObserver(() => {
      if (enhance()) observer.disconnect()
    })
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true })
    setTimeout(() => observer.disconnect(), 10000)
  }
}

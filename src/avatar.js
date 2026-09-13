const femaleNames = new Set(['alice','ann','anne','annie','bridget','catherine','christina','elizabeth','ellen','hannah','jane','julia','kathleen','margaret','mary','maura','nora','norah','patricia','sara','sarah','teresa','theresa'])
const maleNames = new Set(['anthony','billy','christopher','daniel','denis','edward','enoch','francis','george','henry','james','john','joseph','michael','patrick','paul','peter','robert','thomas','william'])

export function genderFor(person = {}) {
  const explicit = String(person.gender || person.sex || '').trim().toLowerCase()
  if (/^(f|female|woman)$/.test(explicit)) return 'female'
  if (/^(m|male|man)$/.test(explicit)) return 'male'
  const relationship = String(person.relation_label || '').toLowerCase()
  if (/\b(mother|daughter|sister|wife|aunt|grandmother|niece)\b/.test(relationship)) return 'female'
  if (/\b(father|son|brother|husband|uncle|grandfather|nephew)\b/.test(relationship)) return 'male'
  const firstName = String(person.name || '').trim().split(/\s+/)[0].toLowerCase()
  if (femaleNames.has(firstName)) return 'female'
  if (maleNames.has(firstName)) return 'male'
  return 'neutral'
}

export function avatarMarkup(person, className = 'avatar') {
  const gender = genderFor(person)
  const label = gender === 'neutral' ? 'Profile image not available' : `${gender === 'female' ? 'Female' : 'Male'} profile image not available`
  return `<span class="${className} avatar-silhouette avatar-${gender}" role="img" aria-label="${label}"><span class="avatar-head"></span><span class="avatar-body"></span></span>`
}

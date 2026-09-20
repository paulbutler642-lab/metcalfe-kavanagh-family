const surnameFrom = (value) => String(value || '').trim().split(/\s+/).at(-1)?.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ’'-]/g, '') || ''

export function displayName(person) {
  const current = String(person?.name || '').trim()
  const birth = String(person?.birth_name || '').trim()
  if (!current || !birth) return current
  const currentSurname = surnameFrom(current).toLowerCase()
  const birthSurname = surnameFrom(birth)
  if (!birthSurname || birthSurname.toLowerCase() === currentSurname) return current
  return `${current} (née ${birthSurname})`
}

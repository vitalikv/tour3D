export function toArray(i) {
  if (Array.isArray(i)) return i
  if (typeof i === 'undefined') return []
  return [i]
}

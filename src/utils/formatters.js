export function formatTemp(temp, unit = 'C') {
  if (temp == null) return 'N/A'
  const val = Math.round(temp)
  if (unit === 'F') return `${Math.round(val * 9 / 5 + 32)}°F`
  return `${val}°C`
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

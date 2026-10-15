export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value ?? 0)
}

export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function googleMapEmbedUrl(query, zoom = 15) {
  const q =
    query && typeof query === 'object' && query.lat != null
      ? `${query.lat},${query.lng}`
      : encodeURIComponent(query)
  return `https://www.google.com/maps?q=${q}&z=${zoom}&hl=en&output=embed`
}

export function googleDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

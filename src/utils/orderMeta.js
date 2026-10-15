export const ORDER_STATUSES = [
  { key: 'pending', label: 'Pending', tone: 'gray', dot: 'bg-stone-400' },
  { key: 'confirmed', label: 'Confirmed', tone: 'blue', dot: 'bg-sky-500' },
  { key: 'preparing', label: 'Preparing', tone: 'yellow', dot: 'bg-amber-500' },
  { key: 'ready', label: 'Ready', tone: 'violet', dot: 'bg-violet-500' },
  { key: 'out_for_delivery', label: 'Out for delivery', tone: 'blue', dot: 'bg-blue-500' },
  { key: 'completed', label: 'Completed', tone: 'green', dot: 'bg-emerald-500' },
  { key: 'cancelled', label: 'Cancelled', tone: 'red', dot: 'bg-rose-500' },
]

export const ORDER_TYPES = [
  { key: 'dine_in', label: 'Dine-in', icon: 'userCircle' },
  { key: 'takeaway', label: 'Takeaway', icon: 'shoppingBag' },
  { key: 'delivery', label: 'Delivery', icon: 'deliveries' },
]

export const DELIVERY_STATUSES = [
  { key: 'pending', label: 'Pending', tone: 'gray', dot: 'bg-stone-400' },
  { key: 'assigned', label: 'Assigned', tone: 'blue', dot: 'bg-sky-500' },
  { key: 'picked_up', label: 'Picked up', tone: 'yellow', dot: 'bg-amber-500' },
  { key: 'out_for_delivery', label: 'Out for delivery', tone: 'violet', dot: 'bg-violet-500' },
  { key: 'delivered', label: 'Delivered', tone: 'green', dot: 'bg-emerald-500' },
  { key: 'failed', label: 'Failed', tone: 'red', dot: 'bg-rose-500' },
]

export const PAYMENT_METHODS = [
  { key: 'cash', label: 'Cash' },
  { key: 'aba_khqr', label: 'ABA KHQR' },
  { key: 'aba_card', label: 'ABA Card' },
]

export const ORDER_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed']
export const DELIVERY_FLOW = ['pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered']

export function orderStatus(key) {
  const status = (key || 'pending').toLowerCase()
  return ORDER_STATUSES.find((s) => s.key === status) || ORDER_STATUSES[0]
}

export function deliveryStatus(key) {
  const status = (key || 'pending').toLowerCase()
  return DELIVERY_STATUSES.find((s) => s.key === status) || DELIVERY_STATUSES[0]
}

export function orderType(key) {
  const type = (key || '').toLowerCase()
  return ORDER_TYPES.find((t) => t.key === type) || { key: type, label: type, icon: 'orders' }
}

export function paymentMethod(key) {
  const method = (key || '').toLowerCase()
  return PAYMENT_METHODS.find((m) => m.key === method) || { key: method, label: key }
}

export function nextInFlow(flow, current) {
  if (!current) return null
  const idx = flow.indexOf((current || '').toLowerCase())
  if (idx < 0 || idx >= flow.length - 1) return null
  return flow[idx + 1]
}

export function nextOrderStatus(current) {
  return nextInFlow(ORDER_FLOW, current)
}

export function nextDeliveryStatus(current) {
  return nextInFlow(DELIVERY_FLOW, current)
}

export function isOrderActive(status) {
  const s = (status || '').toLowerCase()
  return s !== 'completed' && s !== 'cancelled'
}

export function isDeliveryActive(status) {
  const s = (status || '').toLowerCase()
  return s !== 'delivered' && s !== 'failed'
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return 'just now'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export function shortTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
import * as paymentApi from '../../api/payment'
import * as orderApi from '../../api/order'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import { PAYMENT_METHODS } from '../../utils/orderMeta'

const STATUS_OPTS = ['pending', 'paid', 'failed', 'refunded'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))
const toneFor = (s) => ({ paid: 'green', pending: 'yellow', failed: 'red', refunded: 'gray' }[(s || '').toLowerCase()] || 'gray')

export default function PaymentsPage() {
  const orders = useApi(orderApi.listOrders, [])

  const fields = [
    { name: 'order_id', label: 'Order', type: 'select', required: true, placeholder: 'Choose an order', options: (orders.data || []).map((o) => ({ value: o.id, label: `#${o.order_number || o.id}` })) },
    { name: 'payment_method', label: 'Method', type: 'select', required: true, options: PAYMENT_METHODS.map((m) => ({ value: m.key, label: m.label })) },
    { name: 'amount', label: 'Amount ($)', type: 'number', numeric: true, required: true },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTS, default: 'pending' },
    { name: 'transaction_reference', label: 'Transaction reference', placeholder: 'KHQR-123456' },
  ]

  return (
    <SimpleCrudPage
      breadcrumb="Finance"
      title="Payments"
      singular="payment"
      addLabel="Add payment"
      description="Record and reconcile payments against orders."
      services={{ list: paymentApi.listPayments, create: paymentApi.createPayment, update: paymentApi.updatePayment, remove: paymentApi.deletePayment }}
      columns={[
        { key: 'order', label: 'Order', render: (r) => <span className="font-semibold text-ink">{r.order?.order_number ? `#${r.order.order_number}` : `Order #${r.order_id}`}</span> },
        { key: 'payment_method', label: 'Method', render: (r) => <span className="capitalize text-muted">{r.payment_method}</span> },
        { key: 'amount', label: 'Amount', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{formatCurrency(Number(r.amount) || 0)}</span> },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={toneFor(r.status)} dot>{r.status}</Badge> },
        { key: 'created_at', label: 'Date', render: (r) => <span className="text-muted">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</span>, hideBelow: 'hidden lg:table-cell' },
      ]}
      fields={fields}
      getSearchText={(r) => `${r.order?.order_number || r.order_id} ${r.payment_method}`}
    />
  )
}

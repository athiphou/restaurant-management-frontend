import * as orderApi from '../../api/order'
import * as staffApi from '../../api/staff'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'
import { deliveryStatus } from '../../utils/orderMeta'
import { formatCurrency } from '../../utils/formatters'

const STATUS_OPTS = ['pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed'].map((k) => ({ value: k, label: deliveryStatus(k).label }))

export default function DeliveriesPage() {
  const drivers = useApi(staffApi.listDrivers, [])

  const fields = [
    { name: 'order_id', label: 'Order ID', type: 'number', numeric: true, required: true },
    { name: 'delivery_driver_id', label: 'Driver', type: 'select', placeholder: 'Unassigned', options: (drivers.data || []).map((d) => ({ value: d.id, label: d.user?.name || `Driver #${d.id}` })) },
    { name: 'customer_address_id', label: 'Address ID', type: 'number', numeric: true },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTS, default: 'pending' },
    { name: 'delivery_fee', label: 'Delivery fee ($)', type: 'number', numeric: true, default: 0 },
    { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Leave at the gate…' },
  ]

  return (
    <SimpleCrudPage
      breadcrumb="Delivery"
      title="Deliveries"
      singular="delivery"
      addLabel="Add delivery"
      description="Assign couriers and track delivery progress."
      services={{ list: orderApi.listDeliveries, create: orderApi.createDelivery, update: orderApi.updateDelivery, remove: orderApi.deleteDelivery }}
      columns={[
        { key: 'order', label: 'Order', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="truck" className="h-4 w-4" /></span>{r.order?.order_number ? `#${r.order.order_number}` : `Order #${r.order_id}`}</span> },
        { key: 'driver', label: 'Driver', render: (r) => <span className="text-muted">{r.driver?.user?.name || r.delivery_driver?.user?.name || r.delivery_driver?.name || 'Unassigned'}</span> },
        { key: 'delivery_fee', label: 'Fee', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{formatCurrency(Number(r.delivery_fee) || 0)}</span>, hideBelow: 'hidden sm:table-cell' },
        { key: 'status', label: 'Status', render: (r) => { const s = deliveryStatus(r.status); return <Badge tone={s.tone} dot>{s.label}</Badge> } },
      ]}
      fields={fields}
      getSearchText={(r) => `${r.order?.order_number || r.order_id} ${r.driver?.user?.name || ''}`}
    />
  )
}

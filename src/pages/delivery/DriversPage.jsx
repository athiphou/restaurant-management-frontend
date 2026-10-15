import * as staffApi from '../../api/staff'
import * as restaurantApi from '../../api/restaurant'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'

const DRIVER_STATUS = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
]
const toneFor = (s) => ({ available: 'green', busy: 'yellow', offline: 'gray' }[(s || '').toLowerCase()] || 'gray')

export default function DriversPage() {
  const branches = useApi(restaurantApi.listRestaurantBranches, [])

  const fields = [
    { name: 'user_id', label: 'User account ID', type: 'number', numeric: true, required: true, hint: 'ID of the linked user account' },
    { name: 'branch_id', label: 'Branch', type: 'select', placeholder: 'Choose a branch', options: (branches.data || []).map((b) => ({ value: b.id, label: b.name })) },
    { name: 'phone', label: 'Phone', placeholder: '012 345 678' },
    { name: 'vehicle_type', label: 'Vehicle', placeholder: 'Motorbike / Car' },
    { name: 'license_plate', label: 'License plate', placeholder: 'PP 1K 8821' },
    { name: 'status', label: 'Status', type: 'select', options: DRIVER_STATUS, default: 'available' },
  ]

  return (
    <SimpleCrudPage
      breadcrumb="Delivery"
      title="Delivery Drivers"
      singular="driver"
      addLabel="Add driver"
      description="Couriers available for delivery orders."
      services={{ list: staffApi.listDrivers, create: staffApi.createDriver, update: staffApi.updateDriver, remove: staffApi.deleteDriver }}
      columns={[
        { key: 'user', label: 'Driver', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="bike" className="h-4 w-4" /></span>{r.user?.name || `User #${r.user_id}`}</span> },
        { key: 'phone', label: 'Phone', render: (r) => <span className="text-muted">{r.phone || '—'}</span> },
        { key: 'vehicle_type', label: 'Vehicle', render: (r) => <span className="text-muted">{r.vehicle_type || '—'}{r.license_plate ? ` · ${r.license_plate}` : ''}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'status', label: 'Status', render: (r) => <Badge tone={toneFor(r.status)} dot>{r.status || 'available'}</Badge> },
      ]}
      fields={fields}
      getSearchText={(r) => `${r.user?.name || ''} ${r.license_plate || ''}`}
    />
  )
}

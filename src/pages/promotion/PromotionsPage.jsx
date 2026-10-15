import * as promotionApi from '../../api/promotion'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'

const FIELDS = [
  { name: 'name', label: 'Promotion name', required: true, placeholder: 'Summer Sale' },
  { name: 'code', label: 'Coupon code', required: true, placeholder: 'SUMMER20' },
  { name: 'discount_type', label: 'Discount type', type: 'select', required: true, options: [{ value: 'percentage', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed amount ($)' }] },
  { name: 'discount_value', label: 'Discount value', type: 'number', numeric: true, required: true, placeholder: '20' },
  { name: 'min_order_amount', label: 'Minimum order ($)', type: 'number', numeric: true, default: 0 },
  { name: 'start_date', label: 'Starts', type: 'datetime', required: true },
  { name: 'end_date', label: 'Ends', type: 'datetime', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Terms or short blurb' },
  { name: 'is_active', label: 'Active', type: 'toggle', default: true },
]

const discountLabel = (p) => (p.discount_type === 'percentage' ? `${Math.round(Number(p.discount_value))}% off` : `${formatCurrency(Number(p.discount_value))} off`)
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

export default function PromotionsPage() {
  return (
    <SimpleCrudPage
      breadcrumb="Marketing"
      title="Promotions"
      singular="promotion"
      addLabel="Add promotion"
      description="Coupon codes and discounts customers can apply at checkout."
      services={{ list: promotionApi.listPromotions, create: promotionApi.createPromotion, update: promotionApi.updatePromotion, remove: promotionApi.deletePromotion }}
      mapRow={(r) => ({ ...r, start_date: (r.start_date || '').slice(0, 16), end_date: (r.end_date || '').slice(0, 16) })}
      columns={[
        { key: 'name', label: 'Promotion', render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
        { key: 'code', label: 'Code', render: (r) => <span className="rounded-md bg-gold-100 px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-brand-800">{r.code}</span> },
        { key: 'discount', label: 'Discount', render: (r) => <span className="font-semibold text-brand-700">{discountLabel(r)}</span> },
        { key: 'window', label: 'Valid', render: (r) => <span className="text-muted">{fmtDate(r.start_date)} → {fmtDate(r.end_date)}</span>, hideBelow: 'hidden lg:table-cell' },
        { key: 'is_active', label: 'Status', render: (r) => <Badge tone={r.is_active ? 'green' : 'gray'} dot>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
      fields={FIELDS}
      getSearchText={(r) => `${r.name} ${r.code}`}
    />
  )
}

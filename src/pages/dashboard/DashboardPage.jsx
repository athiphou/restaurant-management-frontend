import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import * as orderApi from '../../api/order'
import * as customerApi from '../../api/customer'
import * as menuApi from '../../api/menu'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import { BarChart, BarList, Donut } from '../../components/admin/Charts'
import {
  ORDER_STATUSES,
  ORDER_TYPES,
  orderStatus,
  orderType,
  isOrderActive,
  timeAgo,
} from '../../utils/orderMeta'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'

const DAY = 86400000
const money = (o) => Number(o?.grand_total) || 0
const ts = (o) => new Date(o.created_at).getTime()
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

const PERIODS = [
  { key: 7, label: '7d' },
  { key: 30, label: '30d' },
  { key: 90, label: '90d' },
]
const MODES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
]

export default function DashboardPage() {
  const orders = useApi(orderApi.listOrders, [])
  const customers = useApi(customerApi.listCustomers, [])
  const menu = useApi(menuApi.getMenuTree, [])
  const [period, setPeriod] = useState(30)
  const [mode, setMode] = useState('daily')

  const list = useMemo(() => orders.data || [], [orders.data])

  const kpis = useMemo(() => {
    const now = Date.now()
    const from = now - period * DAY
    const prevFrom = now - 2 * period * DAY
    const inCur = list.filter((o) => ts(o) >= from)
    const inPrev = list.filter((o) => ts(o) >= prevFrom && ts(o) < from)
    const revCur = inCur.reduce((s, o) => s + money(o), 0)
    const revPrev = inPrev.reduce((s, o) => s + money(o), 0)
    const today = startOfDay(now).getTime()
    return {
      revenue: revCur,
      revenueDelta: revPrev ? Math.round(((revCur - revPrev) / revPrev) * 100) : revCur > 0 ? 100 : 0,
      ordersCount: inCur.length,
      ordersDelta: inPrev.length ? Math.round(((inCur.length - inPrev.length) / inPrev.length) * 100) : inCur.length > 0 ? 100 : 0,
      pending: list.filter((o) => isOrderActive(o.status)).length,
      todayRevenue: list.filter((o) => ts(o) >= today).reduce((s, o) => s + money(o), 0),
      customers: customers.data?.length || 0,
    }
  }, [list, period, customers.data])

  const series = useMemo(() => buildSeries(list, mode), [list, mode])

  const statusItems = useMemo(
    () =>
      ORDER_STATUSES.map((s) => ({
        label: s.label,
        dot: s.dot,
        bar: s.dot,
        value: list.filter((o) => (o.status || '').toLowerCase() === s.key).length,
      })).filter((s) => s.value > 0),
    [list],
  )

  const typeSegments = useMemo(() => {
    const colors = { dine_in: '#02462e', takeaway: '#fec700', delivery: '#45936c' }
    return ORDER_TYPES.map((t) => ({
      label: t.label,
      color: colors[t.key],
      value: list.filter((o) => (o.order_type || '').toLowerCase() === t.key).length,
    }))
  }, [list])

  const recent = useMemo(
    () => [...list].sort((a, b) => ts(b) - ts(a)).slice(0, 6),
    [list],
  )

  const menuStats = useMemo(() => {
    const cats = menu.data || []
    const foods = cats.flatMap((c) => c.foods || [])
    return {
      categories: cats.length,
      dishes: foods.length,
      soldOut: foods.filter((f) => f.is_available === false).length,
    }
  }, [menu.data])

  const topDishes = useMemo(() => {
    const map = new Map()
    for (const o of list) {
      for (const it of o.items || o.order_items || []) {
        const name = it.name || it.food?.name || 'Item'
        const qty = Number(it.quantity || it.qty || 1)
        const rev = (Number(it.price) || 0) * qty
        const cur = map.get(name) || { qty: 0, rev: 0 }
        cur.qty += qty
        cur.rev += rev
        map.set(name, cur)
      }
    }
    return [...map.entries()]
      .map(([label, v]) => ({ label, value: v.qty, rev: v.rev }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [list])

  const loading = orders.loading || customers.loading
  const menuLoading = menu.loading

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="Restaurant OS"
        title="Dashboard"
        description="Live operations snapshot from the restaurant API."
        action={
          <Segmented
            options={PERIODS.map((p) => ({ value: p.key, label: p.label }))}
            value={period}
            onChange={setPeriod}
          />
        }
      />

      {orders.error && (
        <EmptyState
          icon="lock"
          message="Couldn’t load dashboard data"
          hint="Your session may have expired. Re-authenticate and try again."
          action={<Link to="/login"><button className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Sign in</button></Link>}
        />
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[116px] rounded-2xl" />)
        ) : (
          <>
            <StatCard label={`Revenue · ${period}d`} value={kpis.revenue} prefix="$" decimals={2} icon="wallet" tone="brand" delta={kpis.revenueDelta} deltaLabel={`vs prev ${period}d`} />
            <StatCard label={`Orders · ${period}d`} value={kpis.ordersCount} icon="receipt" tone="gold" delta={kpis.ordersDelta} deltaLabel="vs prev period" />
            <StatCard label="Pending orders" value={kpis.pending} icon="clock" tone="amber" hint="Active in the kitchen" />
            <StatCard label="Customers" value={kpis.customers} icon="users" tone="green" hint="Registered accounts" />
          </>
        )}
      </div>

      {/* Revenue + type */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle title="Revenue" caption={modeCaption(mode)} />
            <Segmented options={MODES} value={mode} onChange={setMode} small />
          </div>
          <div className="mt-6">
            {loading ? <Skeleton className="h-[210px]" /> : <BarChart data={series} format={(v) => formatCurrency(v)} />}
          </div>
        </Card>

        <Card className="p-5">
          <CardTitle title="Orders by type" caption="Distribution across all orders" />
          <div className="mt-6">
            {loading ? <Skeleton className="h-[168px] rounded-full" /> : <Donut segments={typeSegments} centerLabel="orders" />}
          </div>
        </Card>
      </div>

      {/* Status + recent */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle title="Order status" caption="Live pipeline" />
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-40" />
            ) : statusItems.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <BarList items={statusItems} />
            )}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <CardTitle
            title="Recent orders"
            action={
              <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                View all <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="pb-2 font-semibold">Order</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                  <th className="pb-2 pl-4 font-semibold">Status</th>
                  <th className="hidden pb-2 pl-4 text-right font-semibold sm:table-cell">Placed</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="py-2"><Skeleton className="h-8" /></td>
                    </tr>
                  ))}
                {!loading &&
                  recent.map((o) => {
                    const st = orderStatus(o.status)
                    const ty = orderType(o.order_type)
                    return (
                      <tr key={o.id} className="border-b border-line/70 last:border-0">
                        <td className="py-2.5 font-semibold text-ink">#{o.order_number || o.id}</td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1.5 text-muted">
                            <Icon name={ty.icon} className="h-4 w-4" /> {ty.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-semibold text-brand-700">{formatCurrency(money(o))}</td>
                        <td className="py-2.5 pl-4"><Badge tone={st.tone} dot>{st.label}</Badge></td>
                        <td className="hidden py-2.5 pl-4 text-right text-muted sm:table-cell">{timeAgo(o.created_at)}</td>
                      </tr>
                    )
                  })}
                {!loading && recent.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-muted">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Menu performance — real data from /menu/tree + order items */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle
            title="Menu"
            caption="Live from the menu tree"
            action={<Link to="/admin/menu" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">Manage<Icon name="arrowRight" className="h-4 w-4" /></Link>}
          />
          {menuLoading ? (
            <div className="mt-5 space-y-3">
              <Skeleton className="h-[58px]" />
              <Skeleton className="h-[58px]" />
              <Skeleton className="h-[58px]" />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <MiniStat icon="tag" label="Categories" value={menuStats.categories} tone="brand" />
              <MiniStat icon="utensils" label="Dishes" value={menuStats.dishes} tone="gold" />
              <MiniStat icon="alert" label="Sold out" value={menuStats.soldOut} tone={menuStats.soldOut > 0 ? 'red' : 'green'} />
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <CardTitle title="Top selling dishes" caption="Aggregated from real order items" />
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-44" />
            ) : topDishes.length === 0 ? (
              <p className="text-sm text-muted">No order data yet to rank dishes.</p>
            ) : (
              <BarList items={topDishes.map((d) => ({ ...d, bar: 'bg-brand-600' }))} format={(v) => `${v} sold`} />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

function buildSeries(orders, mode) {
  const out = []
  const now = Date.now()
  if (mode === 'daily') {
    for (let i = 13; i >= 0; i--) {
      const day = startOfDay(now - i * DAY)
      const next = day.getTime() + DAY
      out.push({
        label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: orders.filter((o) => ts(o) >= day.getTime() && ts(o) < next).reduce((s, o) => s + money(o), 0),
      })
    }
  } else if (mode === 'weekly') {
    for (let i = 7; i >= 0; i--) {
      const end = startOfDay(now - i * 7 * DAY)
      const start = end.getTime() - 7 * DAY
      out.push({
        label: end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: orders.filter((o) => ts(o) > start && ts(o) <= end.getTime()).reduce((s, o) => s + money(o), 0),
      })
    }
  } else {
    const d = new Date()
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
      const next = new Date(m.getFullYear(), m.getMonth() + 1, 1)
      out.push({
        label: m.toLocaleDateString(undefined, { month: 'short' }),
        value: orders.filter((o) => ts(o) >= m.getTime() && ts(o) < next.getTime()).reduce((s, o) => s + money(o), 0),
      })
    }
  }
  return out
}

function modeCaption(mode) {
  return { daily: 'Last 14 days', weekly: 'Last 8 weeks', monthly: 'Last 6 months' }[mode]
}

function Segmented({ options, value, onChange, small }) {
  return (
    <div className="inline-flex rounded-full border border-line bg-white p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={classNames(
            'rounded-full font-semibold transition',
            small ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
            String(value) === String(o.value) ? 'bg-brand-700 text-white' : 'text-muted hover:text-brand-700',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const MINI_TONES = {
  brand: 'bg-brand-50 text-brand-700',
  gold: 'bg-gold-100 text-gold-700',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-rose-50 text-rose-600',
}

function MiniStat({ icon, label, value, tone = 'brand' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
      <span className={classNames('grid h-10 w-10 place-items-center rounded-lg', MINI_TONES[tone] || MINI_TONES.brand)}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="font-display text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  )
}

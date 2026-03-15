/* ===================================================
   Overview — analytics dashboard page
=================================================== */
import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

// Colors that match the site's primary + accent palette
const PRIMARY   = '#2d2b6e'   // dark indigo approximation
const PRIMARY_L = '#6366f1'   // medium indigo
const ACCENT    = '#ea580c'   // orange accent
const ACCENT_L  = '#fb923c'   // lighter orange
const MUTED     = '#94a3b8'   // slate muted

function StatCard({ label, value, icon, delta, deltaDir = 'up', prefix = '', suffix = '' }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <div className="stat-card__icon">{icon}</div>
      </div>
      <div className="stat-card__value">{prefix}{value}{suffix}</div>
      {delta && (
        <div className={`stat-card__delta stat-card__delta--${deltaDir}`}>
          {deltaDir === 'up' ? '↑' : '↓'} {delta} vs last week
        </div>
      )}
    </div>
  )
}

export default function Overview() {
  const orders      = useMemo(() => JSON.parse(localStorage.getItem('hc_orders')      || '[]'), [])
  const subscribers = useMemo(() => JSON.parse(localStorage.getItem('hc_subscribers') || '[]'), [])

  // ── Computed stats ──
  const today   = new Date()
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7)

  const thisWeekOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo)
  const weekRevenue    = thisWeekOrders.reduce((s, o) => s + o.total, 0)
  const activeSubs     = subscribers.filter(s => s.status === 'Active').length
  const newCustomers   = new Set(thisWeekOrders.map(o => o.customer)).size

  // ── Line chart: orders per day over last 30 days ──
  const last30Labels = []
  const last30Data   = []
  const ordersByDate = {}
  orders.forEach(o => { ordersByDate[o.createdAt] = (ordersByDate[o.createdAt] || 0) + 1 })

  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    last30Labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
    last30Data.push(ordersByDate[ds] || 0)
  }

  const lineData = {
    labels: last30Labels,
    datasets: [{
      label: 'Orders',
      data: last30Data,
      borderColor: PRIMARY_L,
      backgroundColor: `${PRIMARY_L}18`,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: PRIMARY_L,
    }],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 11 }, color: '#94a3b8' },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 11 }, color: '#94a3b8' },
        grid: { color: '#e2e8f018' },
      },
    },
  }

  // ── Donut chart: revenue by type ──
  const revenueByType = { 'Meal Prep': 0, 'Catering Event': 0, 'À la carte': 0 }
  orders.forEach(o => { revenueByType[o.type] = (revenueByType[o.type] || 0) + o.total })

  const donutData = {
    labels: Object.keys(revenueByType),
    datasets: [{
      data: Object.values(revenueByType),
      backgroundColor: [PRIMARY, ACCENT, PRIMARY_L],
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 3,
    }],
  }

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 14, font: { size: 12 }, color: '#475569' },
      },
      tooltip: {
        callbacks: {
          label: ctx => ` $${ctx.parsed.toFixed(2)}`,
        },
      },
    },
  }

  // ── Recent orders (last 5) ──
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statusClass = s => s.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      <h1 className="dash-page-title">Overview</h1>

      {/* ── Stat Cards ── */}
      <div className="dash-stats">
        <StatCard
          label="Orders This Week"
          value={thisWeekOrders.length}
          delta="12%"
          deltaDir="up"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
          }
        />
        <StatCard
          label="Revenue This Week"
          value={weekRevenue.toFixed(2)}
          prefix="$"
          delta="8%"
          deltaDir="up"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
        <StatCard
          label="Active Subscribers"
          value={activeSubs}
          delta="3%"
          deltaDir="up"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          label="New Customers"
          value={newCustomers}
          delta="5%"
          deltaDir="up"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          }
        />
      </div>

      {/* ── Charts ── */}
      <div className="dash-charts">
        <div className="chart-card">
          <p className="chart-card__title">Orders — Last 30 Days</p>
          <div className="chart-card__canvas">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="chart-card">
          <p className="chart-card__title">Revenue by Category</p>
          <div className="chart-card__canvas">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="dash-section">
        <div className="dash-section__header">
          <p className="dash-section__title">Recent Orders</p>
          <a href="/dashboard/orders" className="btn btn-ghost btn-sm">View All</a>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order #</th><th>Customer</th><th>Type</th>
                <th>Items</th><th>Date</th><th>Status</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(o => (
                <tr key={o.id} style={{ cursor: 'default' }}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.type}</td>
                  <td>{o.mealCount} items</td>
                  <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{o.createdAt}</td>
                  <td>
                    <span className={`status-badge status-badge--${statusClass(o.status)}`}>{o.status}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

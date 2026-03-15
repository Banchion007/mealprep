/* ===================================================
   Subscribers — meal prep subscriber management
=================================================== */
import React, { useState, useMemo } from 'react'

const STATUS_OPTIONS = ['All', 'Active', 'Paused', 'Cancelled']
const PLAN_OPTIONS   = ['All', 'Basic', 'Standard', 'Premium']

function statusClass(s) { return s.toLowerCase() }

function CustomerCell({ name, email }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="dash-customer">
      <div className="dash-customer__avatar">{initials}</div>
      <div>
        <div className="dash-customer__name">{name}</div>
        <div className="dash-customer__email">{email}</div>
      </div>
    </div>
  )
}

function PlanBadge({ plan }) {
  const colors = {
    Basic:    { bg: 'var(--primary-alpha-9)', color: 'var(--color-primary)' },
    Standard: { bg: '#DCFCE7', color: '#15803D' },
    Premium:  { bg: '#EDE9FE', color: '#6D28D9' },
  }
  const c = colors[plan] || colors.Basic
  return (
    <span style={{
      padding: '0.18rem 0.65rem',
      borderRadius: 'var(--radius-full)',
      background: c.bg,
      color: c.color,
      fontSize: '0.72rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>{plan}</span>
  )
}

function ExpandedSubscriber({ sub, colSpan }) {
  return (
    <tr className="dash-table__expand-row">
      <td colSpan={colSpan}>
        <div className="dash-table__expand-content">
          <div>
            <p className="dash-expand-section__title">Meals This Week ({sub.mealsSelected} selected)</p>
            <ul className="dash-expand-section__list">
              {sub.meals.map((m, i) => <li key={i}>{m}</li>)}
              {sub.mealsSelected > sub.meals.length && (
                <li style={{ opacity: 0.55 }}>+{sub.mealsSelected - sub.meals.length} more meals</li>
              )}
            </ul>
          </div>
          <div>
            <p className="dash-expand-section__title">Subscription Details</p>
            <ul className="dash-expand-section__list">
              <li>Plan: {sub.plan} — {sub.mealsPerWeek} meals/week</li>
              <li>Weekly total: ${sub.pricePerWeek.toFixed(2)}</li>
              <li>Next delivery: {sub.nextDelivery}</li>
              <li>Joined: {sub.joinDate}</li>
              <li>Email: {sub.email}</li>
            </ul>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function Subscribers() {
  const allSubs = useMemo(() => JSON.parse(localStorage.getItem('hc_subscribers') || '[]'), [])

  const [status, setStatus] = useState('All')
  const [plan,   setPlan]   = useState('All')
  const [search, setSearch] = useState('')
  const [expandedId, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    return allSubs.filter(s => {
      if (status !== 'All' && s.status !== status) return false
      if (plan   !== 'All' && s.plan   !== plan)   return false
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      const order = { Active: 0, Paused: 1, Cancelled: 2 }
      return (order[a.status] ?? 3) - (order[b.status] ?? 3)
    })
  }, [allSubs, status, plan, search])

  const activeCount = allSubs.filter(s => s.status === 'Active').length
  const monthlyRevenue = allSubs
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + s.pricePerWeek * 4.33, 0)

  return (
    <div>
      <h1 className="dash-page-title">Subscribers</h1>

      {/* Quick stats row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Active', value: activeCount, color: '#15803D', bg: '#DCFCE7' },
          { label: 'Paused', value: allSubs.filter(s => s.status === 'Paused').length,    color: '#A16207', bg: '#FEF9C3' },
          { label: 'Cancelled', value: allSubs.filter(s => s.status === 'Cancelled').length, color: '#B91C1C', bg: '#FEE2E2' },
          { label: 'Est. Monthly Revenue', value: `$${monthlyRevenue.toFixed(0)}`, color: 'var(--color-primary)', bg: 'var(--primary-alpha-9)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{
            flex: '1', minWidth: '140px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color, background: bg, padding: '0.15rem 0.65rem', borderRadius: 'var(--radius-full)' }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="dash-section">
        {/* Filters */}
        <div className="dash-filters">
          <div className="dash-filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.5rem 0.85rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', outline: 'none', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit' }}
            />
          </div>
          <div className="dash-filter-group">
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="dash-filter-group">
            <label>Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)}>
              {PLAN_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> subscriber{filtered.length !== 1 ? 's' : ''}
        </p>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Plan</th>
                <th>Dietary Prefs</th>
                <th>Next Delivery</th>
                <th>Meals Selected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="dash-empty">
                      <span className="dash-empty__icon">👥</span>
                      <p>No subscribers match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(s => (
                <React.Fragment key={s.id}>
                  <tr
                    className={expandedId === s.id ? 'expanded' : ''}
                    onClick={() => setExpanded(expandedId === s.id ? null : s.id)}
                  >
                    <td><CustomerCell name={s.name} email={s.email} /></td>
                    <td><PlanBadge plan={s.plan} /></td>
                    <td>
                      <div className="sub-diet-chips">
                        {s.dietary.length > 0
                          ? s.dietary.map(d => <span key={d} className="sub-diet-chip">{d}</span>)
                          : <span style={{ color: 'var(--color-text-light)', fontSize: '0.78rem' }}>None</span>
                        }
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>{s.nextDelivery}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700 }}>{s.mealsSelected}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>/ {s.mealsPerWeek}</span>
                        <div style={{ flex: 1, maxWidth: '60px', height: '4px', background: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(s.mealsSelected / s.mealsPerWeek) * 100}%`, background: 'var(--color-primary)', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${statusClass(s.status)}`}>{s.status}</span>
                    </td>
                  </tr>
                  {expandedId === s.id && <ExpandedSubscriber sub={s} colSpan={6} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

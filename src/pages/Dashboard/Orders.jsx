/* ===================================================
   Orders — paginated orders table with filters
=================================================== */
import React, { useState, useMemo } from 'react'

const PER_PAGE = 10

const STATUS_OPTIONS = ['All', 'Pending', 'Confirmed', 'In Prep', 'Out for Delivery', 'Delivered', 'Cancelled']
const TYPE_OPTIONS   = ['All', 'Meal Prep', 'Catering Event', 'À la carte']

function statusClass(s) { return s.toLowerCase().replace(/\s+/g, '-') }

function CustomerCell({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="dash-customer">
      <div className="dash-customer__avatar">{initials}</div>
      <span className="dash-customer__name">{name}</span>
    </div>
  )
}

function ExpandedRow({ order, colSpan }) {
  return (
    <tr className="dash-table__expand-row">
      <td colSpan={colSpan}>
        <div className="dash-table__expand-content">
          <div>
            <p className="dash-expand-section__title">Meals / Items</p>
            <ul className="dash-expand-section__list">
              {order.meals.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
              {order.meals.length < order.mealCount && (
                <li style={{ opacity: 0.55 }}>+{order.mealCount - order.meals.length} more items</li>
              )}
            </ul>
          </div>
          <div>
            <p className="dash-expand-section__title">Order Details</p>
            <ul className="dash-expand-section__list">
              <li>Order placed: {order.createdAt}</li>
              <li>Delivery: {order.deliveryDate}</li>
              <li>Type: {order.type}</li>
              <li>Total: ${order.total.toFixed(2)}</li>
              {order.notes && <li>Notes: {order.notes}</li>}
            </ul>
          </div>
        </div>
      </td>
    </tr>
  )
}

function exportCSV(orders) {
  const headers = ['Order #', 'Customer', 'Type', 'Items', 'Delivery Date', 'Status', 'Total']
  const rows = orders.map(o => [
    o.id, `"${o.customer}"`, o.type, o.mealCount, o.deliveryDate, o.status, `$${o.total.toFixed(2)}`,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
  a.click(); URL.revokeObjectURL(url)
}

export default function Orders() {
  const allOrders = useMemo(() => JSON.parse(localStorage.getItem('hc_orders') || '[]'), [])

  const [status,    setStatus]    = useState('All')
  const [type,      setType]      = useState('All')
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')
  const [page,      setPage]      = useState(1)
  const [expandedId, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    return allOrders.filter(o => {
      if (status !== 'All' && o.status !== status) return false
      if (type   !== 'All' && o.type   !== type)   return false
      if (dateFrom && o.createdAt < dateFrom)       return false
      if (dateTo   && o.createdAt > dateTo)         return false
      return true
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [allOrders, status, type, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const pageItems  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const resetFilters = () => { setStatus('All'); setType('All'); setDateFrom(''); setDateTo(''); setPage(1) }

  // Summary totals
  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <h1 className="dash-page-title">Orders</h1>

      {/* Filters */}
      <div className="dash-section">
        <div className="dash-filters">
          <div className="dash-filter-group">
            <label>Status</label>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="dash-filter-group">
            <label>Order Type</label>
            <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
              {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="dash-filter-group">
            <label>From</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} />
          </div>
          <div className="dash-filter-group">
            <label>To</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} />
          </div>
          <div className="dash-filters__actions">
            {(status !== 'All' || type !== 'All' || dateFrom || dateTo) && (
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Clear</button>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => exportCSV(filtered)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 16V4M6 10l6 6 6-6"/><path d="M4 20h16"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          <span><strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> orders</span>
          <span>Total: <strong style={{ color: 'var(--color-primary)' }}>${totalRevenue.toFixed(2)}</strong></span>
        </div>

        {/* Table */}
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Items</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="dash-empty">
                      <span className="dash-empty__icon">📋</span>
                      <p>No orders match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : pageItems.map(o => (
                <React.Fragment key={o.id}>
                  <tr
                    className={expandedId === o.id ? 'expanded' : ''}
                    onClick={() => setExpanded(expandedId === o.id ? null : o.id)}
                  >
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.82rem' }}>{o.id}</td>
                    <td><CustomerCell name={o.customer} /></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{o.type}</td>
                    <td>{o.mealCount} items</td>
                    <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{o.deliveryDate}</td>
                    <td>
                      <span className={`status-badge status-badge--${statusClass(o.status)}`}>{o.status}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                      {expandedId === o.id ? '▲' : '▼'}
                    </td>
                  </tr>
                  {expandedId === o.id && <ExpandedRow order={o} colSpan={8} />}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="dash-pagination">
          <span className="dash-pagination__info">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="dash-pagination__btns">
            <button
              className="dash-pagination__btn"
              disabled={safePage === 1}
              onClick={() => setPage(p => p - 1)}
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - safePage) <= 2 || p === 1 || p === totalPages)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                acc.push(p); return acc
              }, [])
              .map((p, i) =>
                p === '…'
                  ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: 'var(--color-text-light)', fontSize: '0.8rem' }}>…</span>
                  : <button
                      key={p}
                      className={`dash-pagination__btn${safePage === p ? ' dash-pagination__btn--active' : ''}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
              )
            }
            <button
              className="dash-pagination__btn"
              disabled={safePage === totalPages}
              onClick={() => setPage(p => p + 1)}
            >›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

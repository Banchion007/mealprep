/* ===================================================
   Customers — CRM page
   Aggregates past order data into customer profiles.
   Features: order history, tags/notes, analytics,
   and n8n webhook workflow triggers.
=================================================== */
import React, { useState, useMemo, useCallback } from 'react'

/* ── Constants ── */
const STATUS_OPTS = ['All', 'Active', 'New', 'At Risk', 'Inactive']
const TAG_OPTS    = ['All', 'VIP', 'Regular', 'New Customer', 'At Risk', 'Bulk Buyer', 'Event Client', 'High Value', 'Referral']
const SORT_OPTS   = [
  { value: 'lastOrder',   label: 'Last Order' },
  { value: 'totalSpent',  label: 'Total Spent' },
  { value: 'totalOrders', label: 'Order Count' },
  { value: 'name',        label: 'Name A–Z' },
]

const N8N_WORKFLOWS = [
  { id: 'followup',     label: 'Follow-up Email',  desc: 'Send a personalized follow-up after their last order.' },
  { id: 'vip_offer',    label: 'VIP Offer',         desc: 'Send an exclusive discount to reward loyalty.' },
  { id: 'reengagement', label: 'Re-engage',         desc: 'Win-back campaign for customers who have not ordered recently.' },
  { id: 'review',       label: 'Request Review',    desc: 'Ask the customer to leave a Google or Yelp review.' },
  { id: 'welcome',      label: 'Welcome Message',   desc: 'Send a welcome email to a new customer.' },
]

const TAG_COLORS = {
  'VIP':          { bg: '#EDE9FE', color: '#6D28D9' },
  'Regular':      { bg: '#DCFCE7', color: '#15803D' },
  'New Customer': { bg: '#DBEAFE', color: '#1D4ED8' },
  'At Risk':      { bg: '#FEF3C7', color: '#92400E' },
  'Bulk Buyer':   { bg: '#CCFBF1', color: '#0F766E' },
  'Event Client': { bg: '#FCE7F3', color: '#9D174D' },
  'High Value':   { bg: '#FEF9C3', color: '#854D0E' },
  'Referral':     { bg: '#F0FDF4', color: '#166534' },
}

const STATUS_COLORS = {
  'Active':   { bg: '#DCFCE7', color: '#15803D' },
  'New':      { bg: '#DBEAFE', color: '#1D4ED8' },
  'At Risk':  { bg: '#FEF3C7', color: '#92400E' },
  'Inactive': { bg: '#F1F5F9', color: '#64748B' },
}

/* ── Helpers ── */
function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtMoney(n) { return `$${Number(n).toFixed(2)}` }
function daysAgo(dateStr) {
  if (!dateStr) return 9999
  return Math.floor((Date.now() - new Date(dateStr + 'T12:00:00')) / 86400000)
}

/* ── Avatar ── */
function Avatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff
  const bg = `oklch(0.45 0.14 ${h % 360})`
  return (
    <div className="crm-avatar" style={{ background: bg }}>{initials}</div>
  )
}

/* ── Tag chip ── */
function TagChip({ tag, onRemove }) {
  const c = TAG_COLORS[tag] || { bg: '#F1F5F9', color: '#475569' }
  return (
    <span className="crm-tag-chip" style={{ background: c.bg, color: c.color }}>
      {tag}
      {onRemove && (
        <button
          className="crm-tag-chip__remove"
          onClick={e => { e.stopPropagation(); onRemove(tag) }}
          aria-label={`Remove ${tag}`}
        >×</button>
      )}
    </span>
  )
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Inactive
  return (
    <span className="crm-status-badge" style={{ background: c.bg, color: c.color }}>{status}</span>
  )
}

/* ── Order history mini-table ── */
function OrderHistory({ orders }) {
  const recent = orders.slice(0, 6)
  return (
    <div className="crm-order-history">
      <p className="crm-section-title">
        Order History
        <span className="crm-section-title__count">{orders.length} total</span>
      </p>
      <div className="crm-mini-table-wrap">
        <table className="crm-mini-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Type</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(o => (
              <tr key={o.id}>
                <td className="crm-mini-table__id">{o.id}</td>
                <td>{o.type}</td>
                <td className="crm-mini-table__date">{fmtDate(o.createdAt)}</td>
                <td className="crm-mini-table__items">{o.mealCount} meal{o.mealCount !== 1 ? 's' : ''}</td>
                <td className="crm-mini-table__total">{fmtMoney(o.total)}</td>
                <td>
                  <span className={`status-badge status-badge--${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length > 6 && (
        <p className="crm-order-history__more">+{orders.length - 6} older orders not shown</p>
      )}
    </div>
  )
}

/* ── CRM side panel: tags, notes, n8n ── */
function CrmPanel({ customer, onSave, n8nConfig, onOpenN8n }) {
  const [noteInput, setNoteInput]       = useState('')
  const [addingTag, setAddingTag]       = useState(false)
  const [triggerStatus, setTriggerStatus] = useState({})

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const note = {
      id:        Date.now(),
      text:      noteInput.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    onSave({ ...customer, notes: [note, ...(customer.notes || [])] })
    setNoteInput('')
  }

  const handleRemoveNote = (noteId) =>
    onSave({ ...customer, notes: customer.notes.filter(n => n.id !== noteId) })

  const handleAddTag = (tag) => {
    if (customer.tags.includes(tag)) return
    onSave({ ...customer, tags: [...customer.tags, tag] })
    setAddingTag(false)
  }

  const handleRemoveTag = (tag) =>
    onSave({ ...customer, tags: customer.tags.filter(t => t !== tag) })

  const handleTrigger = async (workflow) => {
    if (!n8nConfig?.webhookUrl) { onOpenN8n(); return }
    setTriggerStatus(prev => ({ ...prev, [workflow.id]: 'loading' }))
    try {
      const payload = {
        workflow:    workflow.id,
        customer: {
          id:            customer.id,
          name:          customer.name,
          email:         customer.email,
          phone:         customer.phone,
          tags:          customer.tags,
          status:        customer.status,
          totalOrders:   customer.totalOrders,
          totalSpent:    customer.totalSpent,
          lastOrderDate: customer.lastOrderDate,
        },
        triggeredAt: new Date().toISOString(),
      }
      const res = await fetch(n8nConfig.webhookUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      setTriggerStatus(prev => ({ ...prev, [workflow.id]: res.ok ? 'success' : 'error' }))
    } catch {
      setTriggerStatus(prev => ({ ...prev, [workflow.id]: 'error' }))
    }
    setTimeout(() => {
      setTriggerStatus(prev => { const n = { ...prev }; delete n[workflow.id]; return n })
    }, 4000)
  }

  const availableTags = TAG_OPTS.filter(t => t !== 'All' && !customer.tags.includes(t))

  return (
    <div className="crm-panel">

      {/* Tags */}
      <div className="crm-panel-section">
        <p className="crm-section-title">CRM Tags</p>
        <div className="crm-panel-tags">
          {customer.tags.map(t => (
            <TagChip key={t} tag={t} onRemove={handleRemoveTag} />
          ))}
          {addingTag ? (
            <div className="crm-tag-picker">
              {availableTags.map(t => {
                const c = TAG_COLORS[t] || {}
                return (
                  <button
                    key={t}
                    className="crm-tag-option"
                    onClick={() => handleAddTag(t)}
                    style={{ background: c.bg, color: c.color }}
                  >{t}</button>
                )
              })}
              <button className="crm-tag-cancel" onClick={() => setAddingTag(false)}>Cancel</button>
            </div>
          ) : (
            <button className="crm-add-tag-btn" onClick={() => setAddingTag(true)}>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Tag
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="crm-panel-section">
        <p className="crm-section-title">Notes</p>
        <div className="crm-note-input-row">
          <input
            type="text"
            className="crm-note-input"
            placeholder="Add a note…"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddNote()}
          />
          <button className="crm-note-add-btn" onClick={handleAddNote} disabled={!noteInput.trim()}>
            Add
          </button>
        </div>
        <div className="crm-notes-list">
          {!(customer.notes?.length) ? (
            <p className="crm-notes-empty">No notes yet.</p>
          ) : customer.notes.map(n => (
            <div key={n.id} className="crm-note-item">
              <p className="crm-note-text">{n.text}</p>
              <div className="crm-note-meta">
                <span>{n.createdAt}</span>
                <button className="crm-note-del" onClick={() => handleRemoveNote(n.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* n8n Workflows */}
      <div className="crm-panel-section">
        <div className="crm-section-title-row">
          <p className="crm-section-title">n8n Workflows</p>
          <button className="crm-n8n-config-btn" onClick={onOpenN8n} title="Configure n8n">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configure
          </button>
        </div>

        {!n8nConfig?.webhookUrl && (
          <p className="crm-n8n-unconfigured">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            No webhook URL configured. Click Configure to connect n8n.
          </p>
        )}

        <div className="crm-workflow-list">
          {N8N_WORKFLOWS.map(wf => {
            const ts = triggerStatus[wf.id]
            return (
              <button
                key={wf.id}
                className={`crm-workflow-btn${ts === 'success' ? ' crm-workflow-btn--success' : ts === 'error' ? ' crm-workflow-btn--error' : ''}`}
                onClick={() => handleTrigger(wf)}
                disabled={ts === 'loading'}
                title={wf.desc}
              >
                {ts === 'loading' ? (
                  <span className="crm-btn-spinner" />
                ) : ts === 'success' ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : ts === 'error' ? (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
                {ts === 'success' ? 'Triggered!' : ts === 'error' ? 'Failed' : wf.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── n8n configuration modal ── */
function N8nModal({ config, onSave, onClose }) {
  const [url, setUrl]           = useState(config?.webhookUrl || '')
  const [testStatus, setTestStatus] = useState(null)

  const handleTest = async () => {
    if (!url.trim()) return
    setTestStatus('testing')
    try {
      const res = await fetch(url.trim(), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          event:     'test',
          source:    'Humble Chef CRM',
          timestamp: new Date().toISOString(),
        }),
      })
      setTestStatus(res.ok ? 'ok' : 'fail')
    } catch {
      setTestStatus('fail')
    }
  }

  const handleSave = () => {
    onSave({ ...(config || {}), webhookUrl: url.trim() })
    onClose()
  }

  return (
    <div className="crm-modal-backdrop" onClick={onClose}>
      <div className="crm-modal" onClick={e => e.stopPropagation()}>

        <div className="crm-modal__header">
          <div className="crm-modal__title-row">
            <div className="crm-n8n-logo">n8n</div>
            <h3>n8n Workflow Integration</h3>
          </div>
          <button className="crm-modal__close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="crm-modal__body">
          <p className="crm-modal__desc">
            Connect Humble Chef to your n8n instance to trigger CRM workflows directly from customer
            profiles. Create a <strong>Webhook</strong> node in n8n and paste its URL below.
          </p>

          <div className="crm-modal__field">
            <label className="crm-modal__label">Webhook URL</label>
            <div className="crm-modal__url-row">
              <input
                type="url"
                className="crm-modal__url-input"
                placeholder="https://your-n8n.app.n8n.cloud/webhook/..."
                value={url}
                onChange={e => { setUrl(e.target.value); setTestStatus(null) }}
              />
              <button
                className="crm-modal__test-btn"
                onClick={handleTest}
                disabled={!url.trim() || testStatus === 'testing'}
              >
                {testStatus === 'testing' ? 'Testing…' : 'Test'}
              </button>
            </div>
            {testStatus === 'ok'   && <p className="crm-modal__status crm-modal__status--ok">Connection successful</p>}
            {testStatus === 'fail' && <p className="crm-modal__status crm-modal__status--fail">Could not reach webhook. Check the URL and try again.</p>}
          </div>

          <div className="crm-modal__workflows">
            <p className="crm-modal__workflows-label">Available Workflows</p>
            <div className="crm-modal__workflow-grid">
              {N8N_WORKFLOWS.map(wf => (
                <div key={wf.id} className="crm-modal__workflow-item">
                  <strong>{wf.label}</strong>
                  <span>{wf.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="crm-modal__tip">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Each trigger sends a POST with <code>workflow</code>, <code>customer</code>, and{' '}
            <code>triggeredAt</code>. Use a <strong>Switch</strong> node in n8n to route by{' '}
            <code>workflow</code> ID.
          </div>
        </div>

        <div className="crm-modal__footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Configuration</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Customers component ── */
export default function Customers() {
  const [customers, setCustomers] = useState(() =>
    JSON.parse(localStorage.getItem('hc_customers') || '[]')
  )
  const [n8nConfig, setN8nConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hc_n8n_config') || 'null') } catch { return null }
  })
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [tagFilter,    setTagFilter]    = useState('All')
  const [sortBy,       setSortBy]       = useState('lastOrder')
  const [expandedId,   setExpandedId]   = useState(null)
  const [n8nModalOpen, setN8nModalOpen] = useState(false)

  const saveCustomer = useCallback((updated) => {
    setCustomers(prev => {
      const next = prev.map(c => c.id === updated.id ? updated : c)
      localStorage.setItem('hc_customers', JSON.stringify(next))
      return next
    })
  }, [])

  const saveN8nConfig = (cfg) => {
    setN8nConfig(cfg)
    localStorage.setItem('hc_n8n_config', JSON.stringify(cfg))
  }

  /* Analytics */
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)
  const activeCount  = customers.filter(c => c.status === 'Active').length
  const newCount     = customers.filter(c => c.status === 'New').length
  const atRiskCount  = customers.filter(c => c.status === 'At Risk').length
  const avgValue     = customers.length ? totalRevenue / customers.length : 0
  const vipCount     = customers.filter(c => c.tags.includes('VIP')).length

  const filtered = useMemo(() => {
    return customers
      .filter(c => {
        if (statusFilter !== 'All' && c.status !== statusFilter) return false
        if (tagFilter !== 'All' && !c.tags.includes(tagFilter)) return false
        if (search) {
          const q = search.toLowerCase()
          if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
        }
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'totalSpent':  return b.totalSpent - a.totalSpent
          case 'totalOrders': return b.totalOrders - a.totalOrders
          case 'name':        return a.name.localeCompare(b.name)
          default:            return new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
        }
      })
  }, [customers, search, statusFilter, tagFilter, sortBy])

  return (
    <div>
      {/* Page header */}
      <div className="crm-page-header">
        <div>
          <h1 className="dash-page-title">Customers</h1>
          <p className="crm-page-sub">{customers.length} customer{customers.length !== 1 ? 's' : ''} · all-time</p>
        </div>
        <button className="crm-n8n-header-btn" onClick={() => setN8nModalOpen(true)}>
          <div className="crm-n8n-logo crm-n8n-logo--sm">n8n</div>
          <span className={`crm-n8n-dot${n8nConfig?.webhookUrl ? ' crm-n8n-dot--on' : ' crm-n8n-dot--off'}`} />
          Workflows
        </button>
      </div>

      {/* Stat cards */}
      <div className="crm-stats-row">
        {[
          { label: 'Total Customers', value: customers.length,   color: 'var(--color-primary)', bg: 'var(--primary-alpha-9)' },
          { label: 'Active',          value: activeCount,         color: '#15803D', bg: '#DCFCE7' },
          { label: 'New',             value: newCount,            color: '#1D4ED8', bg: '#DBEAFE' },
          { label: 'At Risk',         value: atRiskCount,         color: '#92400E', bg: '#FEF3C7' },
          { label: 'VIP',             value: vipCount,            color: '#6D28D9', bg: '#EDE9FE' },
          { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(0)}`, color: 'var(--color-accent)', bg: '#FFF7ED' },
          { label: 'Avg LTV',         value: `$${avgValue.toFixed(0)}`,    color: '#0F766E', bg: '#CCFBF1' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="crm-stat-card">
            <span className="crm-stat-card__label">{label}</span>
            <span className="crm-stat-card__value" style={{ color, background: bg }}>{value}</span>
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
              className="crm-search-input"
              placeholder="Name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="dash-filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="dash-filter-group">
            <label>Tag</label>
            <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
              {TAG_OPTS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="dash-filter-group">
            <label>Sort</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <p className="crm-results-count">
          <strong>{filtered.length}</strong> customer{filtered.length !== 1 ? 's' : ''}
        </p>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="dash-empty">
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.3 }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      <p>No customers match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(c => (
                <React.Fragment key={c.id}>
                  <tr
                    className={`crm-row${expandedId === c.id ? ' expanded' : ''}`}
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  >
                    <td>
                      <div className="crm-customer-cell">
                        <Avatar name={c.name} />
                        <div>
                          <div className="crm-customer-cell__name">{c.name}</div>
                          <div className="crm-customer-cell__email">{c.email}</div>
                          {c.phone && <div className="crm-customer-cell__phone">{c.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div className="crm-tag-chips">
                        {c.tags.length > 0
                          ? c.tags.slice(0, 2).map(t => <TagChip key={t} tag={t} />)
                          : <span className="crm-no-tags">—</span>
                        }
                        {c.tags.length > 2 && (
                          <span className="crm-tag-more">+{c.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="crm-order-count">{c.totalOrders}</span>
                    </td>
                    <td>
                      <span className="crm-total-spent">{fmtMoney(c.totalSpent)}</span>
                    </td>
                    <td>
                      <div className="crm-last-order">
                        <span>{fmtDate(c.lastOrderDate)}</span>
                        <span className="crm-days-ago">{daysAgo(c.lastOrderDate)}d ago</span>
                      </div>
                    </td>
                  </tr>

                  {expandedId === c.id && (
                    <tr className="crm-expand-row">
                      <td colSpan={6}>
                        <div className="crm-expand-content">
                          <OrderHistory orders={c.orders} />
                          <CrmPanel
                            customer={c}
                            onSave={saveCustomer}
                            n8nConfig={n8nConfig}
                            onOpenN8n={() => setN8nModalOpen(true)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {n8nModalOpen && (
        <N8nModal
          config={n8nConfig}
          onSave={saveN8nConfig}
          onClose={() => setN8nModalOpen(false)}
        />
      )}
    </div>
  )
}

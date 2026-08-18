/* ===================================================
   Customers — CRM page (now using real Supabase orders)
   Aggregates past order data into customer profiles.
   Features: order history, tags/notes, analytics.
=================================================== */
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

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

/* ── Quotes Tab Component ── */
function QuotesTab({ quotes, setQuotes }) {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const STATUS_COLORS = {
    'new': { bg: '#DBEAFE', color: '#1D4ED8' },
    'reviewed': { bg: '#FEF3C7', color: '#92400E' },
    'quoted': { bg: '#E9D5FF', color: '#6D28D9' },
    'booked': { bg: '#DCFCE7', color: '#15803D' },
    'declined': { bg: '#F1F5F9', color: '#64748B' },
  };

  const filtered = quotes.filter(q => {
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    if (search) {
      const qLower = search.toLowerCase();
      return q.name.toLowerCase().includes(qLower) || q.email.toLowerCase().includes(qLower);
    }
    return true;
  });

  const handleStatusChange = async (quoteId, newStatus) => {
    await supabase.from('quotes').update({ status: newStatus }).eq('id', quoteId);
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
  };

  const handleNotesChange = async (quoteId, notes) => {
    await supabase.from('quotes').update({ admin_notes: notes }).eq('id', quoteId);
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, admin_notes: notes } : q));
  };

  const handleDeleteClick = (quoteId, quoteName) => {
    setDeleteConfirm({ quoteId, quoteName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await supabase.from('quotes').delete().eq('id', deleteConfirm.quoteId);
      setQuotes(prev => prev.filter(q => q.id !== deleteConfirm.quoteId));
      setDeleteConfirm(null);
      setExpandedId(null);
    } catch (err) {
      console.error('Delete quote error:', err);
      alert('Failed to delete quote. Please try again.');
    }
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fmtMoney = (n) => `$${Number(n).toFixed(0)}`;

  return (
    <div className="dash-section">
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
            <option value="All">All</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="booked">Booked</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      <p className="crm-results-count"><strong>{filtered.length}</strong> quote{filtered.length !== 1 ? 's' : ''}</p>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Submitted</th>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Guests</th>
              <th>Est. Total</th>
              <th>Event Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="dash-empty">
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.3 }}>
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                    </svg>
                    <p>No quotes submitted yet.</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(quote => (
              <React.Fragment key={quote.id}>
                <tr className={`crm-row${expandedId === quote.id ? ' expanded' : ''}`} onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}>
                  <td>{fmtDate(quote.created_at)}</td>
                  <td><strong>{quote.name}</strong></td>
                  <td>{quote.email}</td>
                  <td>{quote.tier_name}</td>
                  <td>{quote.guest_count_min}–{quote.guest_count_max}</td>
                  <td>{fmtMoney(quote.total_low)}–{fmtMoney(quote.total_high)}</td>
                  <td>{quote.event_type}</td>
                  <td>
                    <span className="crm-status-badge" style={STATUS_COLORS[quote.status] || STATUS_COLORS.new}>
                      {quote.status}
                    </span>
                  </td>
                </tr>

                {expandedId === quote.id && (
                  <tr className="crm-expand-row">
                    <td colSpan={8}>
                      <div className="crm-expand-content">
                        <div className="quote-detail-panel">
                          <section>
                            <h3>Contact Info</h3>
                            <p><strong>Name:</strong> {quote.name}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${quote.email}`}>{quote.email}</a></p>
                            {quote.phone && <p><strong>Phone:</strong> {quote.phone}</p>}
                          </section>

                          <section>
                            <h3>Event Details</h3>
                            <p><strong>Type:</strong> {quote.event_type}</p>
                            <p><strong>Date:</strong> {quote.event_date ? fmtDate(quote.event_date) : '(Not specified)'}</p>
                            <p><strong>Guests:</strong> {quote.guest_count_min}–{quote.guest_count_max}</p>
                          </section>

                          <section>
                            <h3>Tier & Pricing</h3>
                            <p><strong>{quote.tier_name}</strong> · ${quote.base_price_low}–${quote.base_price_high}/person</p>
                            <p><strong>Estimated Total:</strong> {fmtMoney(quote.total_low)}–{fmtMoney(quote.total_high)}</p>
                          </section>

                          {quote.selected_items && Object.keys(quote.selected_items).length > 0 && (
                            <section>
                              <h3>Menu Selections</h3>
                              {Object.entries(quote.selected_items).map(([k, v]) => (
                                (v && v.length > 0) && (
                                  <div key={k}>
                                    <strong>{k.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                                    <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                                      {v.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                  </div>
                                )
                              ))}
                            </section>
                          )}

                          {quote.upgrades && quote.upgrades.length > 0 && (
                            <section>
                              <h3>Add-Ons</h3>
                              <ul>
                                {quote.upgrades.map((u, i) => <li key={i}>{u.name}</li>)}
                              </ul>
                            </section>
                          )}

                          {quote.message && (
                            <section>
                              <h3>Customer Message</h3>
                              <p>{quote.message}</p>
                            </section>
                          )}

                          <section>
                            <h3>Admin Status</h3>
                            <select value={quote.status} onChange={e => handleStatusChange(quote.id, e.target.value)} style={{ padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="quoted">Quoted</option>
                              <option value="booked">Booked</option>
                              <option value="declined">Declined</option>
                            </select>
                          </section>

                          <section>
                            <h3>Admin Notes</h3>
                            <textarea
                              value={quote.admin_notes || ''}
                              onChange={e => handleNotesChange(quote.id, e.target.value)}
                              placeholder="Add internal notes…"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit', minHeight: '100px' }}
                            />
                          </section>

                          <section>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <a href={`mailto:${quote.email}`} className="btn btn-primary">
                                Send Email
                              </a>
                              <button
                                className="btn"
                                onClick={() => handleDeleteClick(quote.id, quote.name)}
                                style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                              >
                                Delete Quote
                              </button>
                            </div>
                          </section>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Delete Quote?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
              Are you sure you want to delete the quote from <strong>{deleteConfirm.quoteName}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleConfirmDelete}
                style={{ background: '#DC2626', color: '#fff', border: 'none' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Customers component ── */
export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('customers')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all orders and aggregate by user
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError

        const customerMap = {}
        orders.forEach(order => {
          const userId = order.user_id
          if (!customerMap[userId]) {
            customerMap[userId] = {
              id: userId,
              name: order.customer_name || 'Unknown',
              email: order.customer_email || 'unknown@example.com',
              totalSpent: 0,
              totalOrders: 0,
              lastOrder: null,
              status: 'Active',
              tags: [],
              orders: [],
            }
          }
          customerMap[userId].totalSpent += order.total || 0
          customerMap[userId].totalOrders += 1
          customerMap[userId].lastOrder = order.created_at
          customerMap[userId].orders.push(order)
        })

        setCustomers(Object.values(customerMap))

        // Fetch submitted quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false })

        if (quotesError) throw quotesError
        setQuotes(quotesData || [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setCustomers([])
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [tagFilter,    setTagFilter]    = useState('All')
  const [sortBy,       setSortBy]       = useState('lastOrder')
  const [expandedId,   setExpandedId]   = useState(null)
  const [n8nModalOpen, setN8nModalOpen] = useState(false)
  const [n8nConfig,    setN8nConfig]    = useState(null)

  const saveN8nConfig = useCallback((config) => {
    setN8nConfig(config)
  }, [])

  const saveCustomer = useCallback((updated) => {
    // TODO: Persist customer updates to Supabase (tags, status, notes)
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))
  }, [])

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
          default:            return new Date(b.lastOrder || 0) - new Date(a.lastOrder || 0)
        }
      })
  }, [customers, search, statusFilter, tagFilter, sortBy])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="acct-spinner" style={{ margin: '0 auto 1rem' }} />
          <p>Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="crm-page-header">
        <div>
          <h1 className="dash-page-title">Customers</h1>
          <p className="crm-page-sub">{activeTab === 'customers' ? `${customers.length} customer${customers.length !== 1 ? 's' : ''} · all-time` : `${quotes.length} quote${quotes.length !== 1 ? 's' : ''} · all-time`}</p>
        </div>
        {activeTab === 'customers' && (
          <button className="crm-n8n-header-btn" onClick={() => setN8nModalOpen(true)}>
            <div className="crm-n8n-logo crm-n8n-logo--sm">n8n</div>
            <span className={`crm-n8n-dot${n8nConfig?.webhookUrl ? ' crm-n8n-dot--on' : ' crm-n8n-dot--off'}`} />
            Workflows
          </button>
        )}
      </div>

      {/* Tab navigation */}
      <div className="crm-tabs">
        <button
          className={`crm-tab${activeTab === 'customers' ? ' active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          All Customers
        </button>
        <button
          className={`crm-tab${activeTab === 'quotes' ? ' active' : ''}`}
          onClick={() => setActiveTab('quotes')}
        >
          Submitted Quotes <span className="crm-tab__count">({quotes.length})</span>
        </button>
      </div>

      {/* Stat cards — Customers tab only */}
      {activeTab === 'customers' && (
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
      )}

      {/* Quotes tab content */}
      {activeTab === 'quotes' && <QuotesTab quotes={quotes} setQuotes={setQuotes} />}

      {activeTab === 'customers' && (
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
      )}

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

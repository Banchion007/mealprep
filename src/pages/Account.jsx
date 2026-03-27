/* ===================================================
   Account — customer-facing profile, settings,
   and order history page. Route: /account
=================================================== */
import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import './Account.css'

/* ── Helpers ── */
function fmtDate(str) {
  if (!str) return '—'
  const d = new Date(str.includes('T') ? str : str + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLES = {
  Confirmed:        { bg: '#DBEAFE', color: '#1D4ED8' },
  'In Prep':        { bg: '#FEF3C7', color: '#92400E' },
  'Out for Delivery': { bg: '#EDE9FE', color: '#6D28D9' },
  Delivered:        { bg: '#DCFCE7', color: '#15803D' },
  Cancelled:        { bg: '#FEE2E2', color: '#B91C1C' },
}

function OrderStatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: '#F1F5F9', color: '#64748B' }
  return (
    <span className="acct-order-status" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

/* ── Order card ── */
function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  const items = Array.isArray(order.items) ? order.items : []
  const preview = items.slice(0, 2).map(i => `${i.name} ×${i.qty}`).join(', ')
  const overflow = items.length > 2 ? ` +${items.length - 2} more` : ''

  return (
    <div className={`acct-order-card${open ? ' acct-order-card--open' : ''}`}>
      <button className="acct-order-card__header" onClick={() => setOpen(v => !v)}>
        <div className="acct-order-card__top">
          <span className="acct-order-card__num">{order.order_number}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="acct-order-card__preview">{preview}{overflow}</p>
        <div className="acct-order-card__meta">
          <span>Ordered {fmtDate(order.created_at)}</span>
          <span>·</span>
          <span>Delivery {fmtDate(order.delivery_date)}</span>
          <span>·</span>
          <span className="acct-order-card__total">${Number(order.total).toFixed(2)}</span>
        </div>
        <svg
          className={`acct-order-card__caret${open ? ' open' : ''}`}
          width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="acct-order-card__body">
          <div className="acct-order-items">
            {items.map((item, i) => (
              <div key={i} className="acct-order-item">
                <span className="acct-order-item__name">{item.name}</span>
                <span className="acct-order-item__qty">×{item.qty}</span>
                <span className="acct-order-item__price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="acct-order-details">
            {order.address && (
              <div className="acct-order-detail-row">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {order.address}
              </div>
            )}
            {order.time_window && (
              <div className="acct-order-detail-row">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {order.time_window}
              </div>
            )}
          </div>
          <div className="acct-order-card__total-row">
            <span>Order Total</span>
            <span className="acct-order-total-val">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Profile section ── */
function ProfileSection({ user }) {
  const displayName = user.user_metadata?.full_name || ''
  const [name,    setName]    = useState(displayName)
  const [saving,  setSaving]  = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  const handleSave = async () => {
    if (!name.trim() || name.trim() === displayName) return
    setSaving(true)
    setSaveMsg(null)
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } })
    setSaving(false)
    setSaveMsg(error ? { type: 'error', text: error.message } : { type: 'ok', text: 'Name updated!' })
    setTimeout(() => setSaveMsg(null), 3500)
  }

  const initials = (displayName || user.email || '?')[0].toUpperCase()

  return (
    <div className="acct-card">
      <h2 className="acct-card__title">Profile</h2>
      <div className="acct-profile-row">
        <div className="acct-profile-avatar">{initials}</div>
        <div className="acct-profile-info">
          <p className="acct-profile-name">{displayName || user.email}</p>
          <p className="acct-profile-email">{user.email}</p>
          <p className="acct-profile-since">Member since {fmtDate(user.created_at)}</p>
        </div>
      </div>

      <div className="acct-field">
        <label className="acct-label" htmlFor="acct-name">Display Name</label>
        <input
          id="acct-name"
          type="text"
          className="acct-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="acct-field">
        <label className="acct-label">Email Address</label>
        <input
          type="email"
          className="acct-input acct-input--readonly"
          value={user.email}
          readOnly
          tabIndex={-1}
        />
        <p className="acct-field-hint">Email changes require account verification — contact support.</p>
      </div>

      <div className="acct-card__footer">
        {saveMsg && (
          <p className={`acct-save-msg${saveMsg.type === 'error' ? ' acct-save-msg--error' : ''}`}>
            {saveMsg.text}
          </p>
        )}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSave}
          disabled={saving || !name.trim() || name.trim() === displayName}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/* ── Security section ── */
function SecuritySection({ user }) {
  const [sent,    setSent]    = useState(false)
  const [sending, setSending] = useState(false)
  const [error,   setError]   = useState(null)

  const handlePasswordReset = async () => {
    setSending(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account`,
    })
    setSending(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="acct-card">
      <h2 className="acct-card__title">Security</h2>
      <div className="acct-security-row">
        <div>
          <p className="acct-security-label">Password</p>
          <p className="acct-security-hint">Reset your password via email.</p>
        </div>
        {sent ? (
          <p className="acct-reset-sent">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Reset email sent to {user.email}
          </p>
        ) : (
          <button
            className="btn btn-outline btn-sm"
            onClick={handlePasswordReset}
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Send Reset Email'}
          </button>
        )}
      </div>
      {error && <p className="acct-save-msg acct-save-msg--error" style={{ marginTop: '0.75rem' }}>{error}</p>}
    </div>
  )
}

/* ── Order history section ── */
function OrderHistorySection({ user }) {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('orders')
      .select('order_number, status, items, total, delivery_date, time_window, address, created_at, type')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setOrders(data || [])
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [user.id])

  return (
    <div className="acct-card">
      <h2 className="acct-card__title">
        Order History
        {orders.length > 0 && (
          <span className="acct-card__title-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        )}
      </h2>

      {loading ? (
        <div className="acct-orders-loading">
          <span className="acct-spinner" />
          <span>Loading your orders…</span>
        </div>
      ) : error ? (
        <p className="acct-save-msg acct-save-msg--error">{error}</p>
      ) : orders.length === 0 ? (
        <div className="acct-orders-empty">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>No orders yet.</p>
          <Link to="/meal-prep" className="btn btn-primary btn-sm">Order Your First Meal</Link>
        </div>
      ) : (
        <div className="acct-orders-list">
          {orders.map(order => (
            <OrderCard key={order.order_number} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main page ── */
export default function Account() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="acct-gate">
        <span className="acct-spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="acct-gate">
        <div className="acct-gate__box">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Sign in to view your account</h2>
          <p>Access your order history and account settings by signing in.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email

  return (
    <div className="acct-page">
      <div className="acct-hero">
        <div className="container acct-hero__inner">
          <div className="acct-hero__avatar">
            {displayName[0].toUpperCase()}
          </div>
          <div>
            <p className="acct-hero__greeting">Welcome back</p>
            <h1 className="acct-hero__name">{displayName}</h1>
          </div>
        </div>
      </div>

      <div className="container acct-body">
        <ProfileSection user={user} />
        <SecuritySection user={user} />
        <OrderHistorySection user={user} />

        <div className="acct-signout-row">
          <button className="btn btn-ghost" onClick={signOut}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

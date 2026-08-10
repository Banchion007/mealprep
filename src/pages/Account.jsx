/* ===================================================
   Account — customer-facing profile, settings,
   and order history page. Route: /account
=================================================== */
import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { SkeletonProfile, SkeletonOrderCard } from '../components/Skeleton'
import '../components/Skeleton.css'
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
function OrderCard({ order, onCancelSuccess }) {
  const [open, setOpen] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  const items = Array.isArray(order.items) ? order.items : []
  const preview = items.slice(0, 2).map(i => `${i.name} ×${i.qty}`).join(', ')
  const overflow = items.length > 2 ? ` +${items.length - 2} more` : ''

  // Can cancel if status is not "Out for Delivery", "Delivered", or "Cancelled"
  const canCancel = order.status && !['Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)

  const handleCancelOrder = async () => {
    if (!canCancel) return
    setCancelling(true)
    setCancelError(null)

    try {
      // Call edge function to refund and update order
      const { data, error: fnError } = await supabase.functions.invoke('refund-order', {
        body: {
          order_id: order.id,
          order_number: order.order_number,
          stripe_payment_intent: order.stripe_payment_intent,
          total: order.total,
          customer_email: order.customer_email,
        },
      })

      if (fnError) throw fnError

      // Update order status to Cancelled
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
        .eq('id', order.id)

      if (updateErr) throw updateErr

      setCancelConfirm(false)
      onCancelSuccess?.()
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order. Please contact support.')
    } finally {
      setCancelling(false)
    }
  }

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

          {/* Cancel order section */}
          {canCancel && !cancelConfirm && (
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1rem', paddingTop: '1rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCancelConfirm(true)}
                style={{ color: '#dc2626', borderColor: '#dc2626' }}
              >
                Cancel Order
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Refund will be processed in 2-3 business days
              </p>
            </div>
          )}

          {/* Cancel confirmation */}
          {canCancel && cancelConfirm && (
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1rem', paddingTop: '1rem' }}>
              <p style={{ color: '#dc2626', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                Cancel this order?
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Refund of ${Number(order.total).toFixed(2)} will be processed to your original payment method.
              </p>
              {cancelError && (
                <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {cancelError}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setCancelConfirm(false)
                    setCancelError(null)
                  }}
                  disabled={cancelling}
                >
                  Keep Order
                </button>
                <button
                  className="btn btn-sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  style={{ background: '#dc2626', color: 'white' }}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          )}
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
  const [resendingSent,    setResendingSent]    = useState(false)
  const [resendingSending, setResendingSending] = useState(false)
  const [resendingError,   setResendingError]   = useState(null)

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

  const handleResendVerification = async () => {
    setResendingSending(true)
    setResendingError(null)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      })
      if (error) throw error
      setResendingSent(true)
      setTimeout(() => setResendingSent(false), 3000)
    } catch (err) {
      setResendingError(err.message || 'Failed to resend verification email')
    } finally {
      setResendingSending(false)
    }
  }

  return (
    <div className="acct-card">
      <h2 className="acct-card__title">Security</h2>

      {/* Email verification status */}
      <div className="acct-security-row">
        <div>
          <p className="acct-security-label">Email Verification</p>
          <p className="acct-security-hint">
            {user.email_confirmed_at
              ? '✓ Your email is verified'
              : 'Verify your email to place orders'}
          </p>
        </div>
        {user.email_confirmed_at ? (
          <p className="acct-reset-sent">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Verified
          </p>
        ) : (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleResendVerification}
              disabled={resendingSending}
            >
              {resendingSending ? 'Sending…' : 'Resend Verification'}
            </button>
            {resendingSent && (
              <p className="acct-reset-sent" style={{ position: 'absolute', right: '1rem' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Email sent!
              </p>
            )}
          </>
        )}
      </div>
      {resendingError && <p className="acct-save-msg acct-save-msg--error" style={{ marginTop: '0.75rem' }}>{resendingError}</p>}

      {/* Password reset */}
      <div className="acct-security-row" style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
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

/* ── Data & privacy section ── */
function DataPrivacySection({ user }) {
  const [downloading, setDownloading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      await downloadUserData(user)
    } catch (err) {
      setError(err.message || 'Failed to download data')
    }
    setDownloading(false)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setDeleting(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      await supabase.from('orders').delete().eq('user_id', user.id)
      await supabase.from('recipes').delete().eq('user_id', user.id)
      await supabase.from('delivery_profiles').delete().eq('user_id', user.id)

      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  return (
    <div className="acct-card">
      <h2 className="acct-card__title">Data & Privacy</h2>

      <div className="acct-security-row">
        <div>
          <p className="acct-security-label">Download My Data</p>
          <p className="acct-security-hint">Export all your orders, recipes, and preferences as JSON.</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Downloading…' : 'Download Data'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
        <div className="acct-security-row">
          <div>
            <p className="acct-security-label">Delete Account</p>
            <p className="acct-security-hint">Permanently delete your account and all personal data. This cannot be undone.</p>
          </div>
          {!deleteConfirm ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setDeleteConfirm(true)}
              style={{ color: '#dc2626' }}
            >
              Delete Account
            </button>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#dc2626', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <strong>Are you sure?</strong> This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ background: '#dc2626', color: 'white' }}
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="acct-save-msg acct-save-msg--error" style={{ marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}

/* ── Order history section ── */
function OrderHistorySection({ user }) {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select('id, order_number, status, items, total, delivery_date, time_window, address, created_at, type, customer_email, stripe_payment_intent')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setOrders(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonOrderCard />
          <SkeletonOrderCard />
          <SkeletonOrderCard />
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
            <OrderCard key={order.order_number} order={order} onCancelSuccess={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Data export & deletion helpers ── */
async function downloadUserData(user) {
  try {
    const { supabase } = await import('../lib/supabase')
    const [
      { data: orders },
      { data: recipes },
      { data: delivery },
    ] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id),
      supabase.from('recipes').select('*').eq('user_id', user.id),
      supabase.from('delivery_profiles').select('*').eq('user_id', user.id),
    ])

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || '',
        createdAt: user.created_at,
      },
      orders: orders || [],
      recipes: recipes || [],
      delivery: delivery || [],
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `humble-chef-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    throw err
  }
}

/* ── Main page ── */
export default function Account() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="acct-gate">
        <div style={{ width: '100%', maxWidth: '720px', padding: '2rem 1rem' }}>
          <SkeletonProfile />
        </div>
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
        <DataPrivacySection user={user} />
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

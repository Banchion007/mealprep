/* ===================================================
   Confirmation Screen — shown after order is placed
=================================================== */
import React from 'react'
import { Link } from 'react-router-dom'
import { DELIVERY_WINDOWS } from './data'
import { useMenu } from '../../contexts/MenuContext'
import { useAuth } from '../../contexts/AuthContext'
import './Confirmation.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateKey) {
  if (!dateKey) return '—'
  const d = new Date(dateKey + 'T12:00:00')
  const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
  return `${weekday}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const NEXT_STEPS = [
  {
    title: 'Confirmation Email',
    desc: 'Check your inbox for a full order confirmation with details.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: 'Meal Prep Begins',
    desc: 'Our chefs start preparing your meals 24 hours before delivery.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 11l19-9-9 19-2-8-8-2z"/>
      </svg>
    ),
  },
  {
    title: 'Fresh Delivery',
    desc: 'Your meals arrive in eco-friendly insulated packaging, ready to heat and eat.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    title: 'Leave a Review',
    desc: 'Let us know how your meals turned out. We love the feedback!',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
]

export default function Confirmation({ order, orderNo, orderTotal, onStartOver }) {
  useScrollAnimation()
  const { meals } = useMenu()
  const { user }  = useAuth()
  const { selectedMeals, schedule } = order

  const mealEntries = Object.entries(selectedMeals)
    .map(([id, qty]) => ({ meal: meals.find(m => m.id === id), qty }))
    .filter(e => e.meal)

  const total = orderTotal ?? mealEntries.reduce((sum, { meal, qty }) => sum + meal.price * qty, 0)

  const addr = schedule.address || {}
  const addressStr = addr.street
    ? `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`
    : schedule.address || '—'

  const timeLabel = DELIVERY_WINDOWS.find(w => w.id === schedule.timeWindow)?.time
    || schedule.timeWindow || '—'

  return (
    <div className="confirmation">
      {/* Success hero */}
      <div className="confirmation__hero fade-up">
        <div className="confirmation__check">
          <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="confirmation__title">Order Confirmed!</h1>
        <p className="confirmation__sub">
          Thank you for choosing Humble Chef. We'll have your meals ready on delivery day!
        </p>
        <div className="confirmation__order-no">Order #{orderNo}</div>
        {user && (
          <Link to="/account" className="confirmation__account-link">
            View order in your account
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>

      <div className="container confirmation__body">
        {/* Delivery info banner */}
        <div className="confirmation__delivery-banner fade-up">
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Delivery Date</p>
              <p className="confirmation__delivery-val">{formatDate(schedule.date)}</p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Time Window</p>
              <p className="confirmation__delivery-val">{timeLabel}</p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Delivery Address</p>
              <p className="confirmation__delivery-val">{addressStr}</p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Order Total</p>
              <p className="confirmation__delivery-val" style={{ color: 'var(--color-primary)' }}>
                ${total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Meal summary */}
        <div className="confirmation__summary fade-up">
          <h2 className="confirmation__summary-title">Your Order</h2>
          <p className="confirmation__summary-sub">
            {mealEntries.length} item{mealEntries.length !== 1 ? 's' : ''} · delivering {formatDate(schedule.date)}
          </p>

          <div className="confirmation__meals">
            {mealEntries.map(({ meal, qty }) => (
              <div key={meal.id} className="confirmation__meal-row">
                <img src={meal.img} alt={meal.name} className="confirmation__meal-img" />
                <div className="confirmation__meal-info">
                  <p className="confirmation__meal-name">{meal.name}</p>
                  <p className="confirmation__meal-meta">
                    {meal.calories} cal · {meal.protein}g protein · ×{qty}
                  </p>
                </div>
                <span className="confirmation__meal-price">
                  ${(meal.price * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="confirmation__actions">
            <button className="btn btn-outline" onClick={onStartOver}>
              Place Another Order
            </button>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>

        {/* What's Next */}
        <div className="confirmation__next fade-up">
          <h3>What Happens Next?</h3>
          <div className="confirmation__next-steps">
            {NEXT_STEPS.map(s => (
              <div key={s.title} className="confirmation__next-step">
                <div className="confirmation__next-step-icon">{s.icon}</div>
                <div>
                  <p className="confirmation__next-step-title">{s.title}</p>
                  <p className="confirmation__next-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

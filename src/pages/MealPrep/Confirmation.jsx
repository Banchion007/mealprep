/* ===================================================
   Confirmation Screen — shown after order is placed
=================================================== */
import React from 'react'
import { Link } from 'react-router-dom'
import { MEALS } from './data'
import './Confirmation.css'

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Confirmation({ order, orderNo, onStartOver }) {
  const { plan, selectedMeals, schedule } = order
  const firstDelivery = addDays(new Date(), 3)

  const mealEntries = Object.entries(selectedMeals)
    .map(([id, qty]) => ({ meal: MEALS.find(m => m.id === id), qty }))
    .filter(e => e.meal)

  return (
    <div className="confirmation">
      {/* Success hero */}
      <div className="confirmation__hero">
        <div className="confirmation__check">
          <svg width="40" height="40" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="confirmation__title">Order Confirmed!</h1>
        <p className="confirmation__sub">
          Thank you for choosing Saveur. Your first delivery is on its way!
        </p>
        <div className="confirmation__order-no">
          Order #{orderNo}
        </div>
      </div>

      <div className="container confirmation__body">
        {/* Delivery info banner */}
        <div className="confirmation__delivery-banner">
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">First Delivery</p>
              <p className="confirmation__delivery-val">{firstDelivery}</p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Time Window</p>
              <p className="confirmation__delivery-val">{schedule.timeWindow}</p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Delivery Address</p>
              <p className="confirmation__delivery-val">
                {schedule.address}, {schedule.city} {schedule.state}
              </p>
            </div>
          </div>
          <div className="confirmation__delivery-item">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <p className="confirmation__delivery-label">Weekly Total</p>
              <p className="confirmation__delivery-val" style={{ color: 'var(--color-primary)' }}>
                ${plan?.pricePerWeek.toFixed(2)}/week
              </p>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="confirmation__summary">
          <h2 className="confirmation__summary-title">Your {plan?.name} Plan Summary</h2>
          <p className="confirmation__summary-sub">
            {plan?.mealsPerWeek} meals/week · delivering {schedule.days.join(', ')}
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
                  ${(plan.pricePerMeal * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="confirmation__actions">
            <button className="btn btn-outline" onClick={onStartOver}>
              Start a New Order
            </button>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>

        {/* What's Next */}
        <div className="confirmation__next">
          <h3>What Happens Next?</h3>
          <div className="confirmation__next-steps">
            {[
              { icon: '📧', title: 'Confirmation Email', desc: 'Check your inbox for a full order confirmation with tracking details.' },
              { icon: '🍳', title: 'Meal Prep Begins', desc: 'Our chefs will start preparing your meals 24 hours before delivery.' },
              { icon: '🚚', title: 'Fresh Delivery', desc: `Your first delivery arrives ${firstDelivery} in our eco-friendly insulated packaging.` },
              { icon: '🔁', title: 'Weekly Renewals', desc: 'Your plan renews automatically every week. Manage it anytime in your account.' },
            ].map(s => (
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

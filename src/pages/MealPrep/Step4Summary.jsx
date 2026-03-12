/* ===================================================
   Step 4 — Order Summary
=================================================== */
import React from 'react'
import { MEALS, DIETARY_OPTIONS } from './data'
import './Steps.css'

export default function Step4Summary({ order, onBack, onPlace }) {
  const { plan, preferences, selectedMeals, schedule } = order

  // Build selected meal list
  const mealEntries = Object.entries(selectedMeals)
    .map(([id, qty]) => ({ meal: MEALS.find(m => m.id === id), qty }))
    .filter(e => e.meal)

  const mealSubtotal  = plan ? plan.pricePerMeal * plan.mealsPerWeek : 0
  const deliveryFee   = 0
  const weeklyTotal   = mealSubtotal + deliveryFee
  const totalSelected = Object.values(selectedMeals).reduce((s, n) => s + n, 0)

  const prefLabels = preferences
    .map(p => DIETARY_OPTIONS.find(o => o.id === p)?.label)
    .filter(Boolean)

  return (
    <div className="step-panel">
      <div className="step-panel__header">
        <h2 className="step-panel__title">Order Summary</h2>
        <p className="step-panel__sub">Review your selections before placing your order.</p>
      </div>

      <div className="summary-grid">
        {/* Left — details */}
        <div>
          {/* Plan */}
          <div className="summary-section">
            <p className="summary-section__title">Plan</p>
            <div className="summary-plan-chip">
              {plan?.name} Plan · {plan?.mealsPerWeek} meals/week · ${plan?.pricePerWeek.toFixed(2)}/week
            </div>
          </div>

          {/* Preferences */}
          {prefLabels.length > 0 && (
            <div className="summary-section">
              <p className="summary-section__title">Dietary Preferences</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {prefLabels.map(l => (
                  <span key={l} style={{
                    padding: '0.3rem 0.8rem',
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--color-secondary)',
                  }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          <div className="summary-section">
            <p className="summary-section__title">
              Selected Meals ({totalSelected} of {plan?.mealsPerWeek})
            </p>
            {mealEntries.map(({ meal, qty }) => (
              <div key={meal.id} className="summary-meal-row">
                <img src={meal.img} alt={meal.name} className="summary-meal-img" />
                <span className="summary-meal-name">{meal.name}</span>
                <span className="summary-meal-qty">x{qty}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ${(plan.pricePerMeal * qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div className="summary-section">
            <p className="summary-section__title">Delivery Schedule</p>
            <div className="summary-schedule-row">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{schedule.days.join(', ')}</span>
            </div>
            <div className="summary-schedule-row">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{schedule.timeWindow}</span>
            </div>
            <div className="summary-schedule-row">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>
                {schedule.address}, {schedule.city}, {schedule.state} {schedule.zip}
              </span>
            </div>
          </div>
        </div>

        {/* Right — pricing */}
        <div>
          <div className="pricing-card">
            <h3 className="pricing-card__title">Price Breakdown</h3>

            <div className="pricing-row">
              <span>{plan?.name} Plan ({plan?.mealsPerWeek} meals)</span>
              <span>${mealSubtotal.toFixed(2)}</span>
            </div>
            <div className="pricing-row">
              <span>${plan?.pricePerMeal.toFixed(2)} × {plan?.mealsPerWeek} meals</span>
            </div>
            <div className="pricing-row">
              <span>Delivery</span>
              <span style={{ color: '#16A34A', fontWeight: 700 }}>FREE</span>
            </div>
            <div className="pricing-row">
              <span>Taxes &amp; Fees</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="pricing-row pricing-row--total">
              <span>Weekly Total</span>
              <span>${weeklyTotal.toFixed(2)}</span>
            </div>
            <div className="pricing-row" style={{ color: 'var(--color-text-light)', fontSize: '0.78rem' }}>
              <span>Billed weekly · Cancel anytime</span>
            </div>

            <button className="btn btn-primary btn-lg pricing-card__place-btn" onClick={onPlace}>
              Place Order
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <p className="pricing-card__note">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure checkout · No commitment
            </p>
          </div>
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-ghost" onClick={onBack}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>
    </div>
  )
}

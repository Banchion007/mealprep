/* ===================================================
   Plan Selection — 3 plan cards with highlight
=================================================== */
import React from 'react'
import './PlanSelection.css'

export default function PlanSelection({ plans, onSelect }) {
  return (
    <section className="section plan-selection">
      <div className="container">
        <div className="plan-selection__header">
          <p className="section-label">Choose Your Plan</p>
          <h2 className="section-title">Pick the Plan That Fits Your Life</h2>
          <p className="section-sub" style={{ marginInline: 'auto' }}>
            All plans include free delivery, flexible meal swaps, and the ability to skip or cancel any week — no commitment required.
          </p>
        </div>

        <div className="plan-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`plan-card${plan.highlight ? ' plan-card--highlight' : ''}`}
            >
              {plan.badge && (
                <div className="plan-card__badge">{plan.badge}</div>
              )}
              <div className="plan-card__header">
                <h3 className="plan-card__name">{plan.name}</h3>
                <div className="plan-card__price">
                  <span className="plan-card__price-val">${plan.pricePerWeek.toFixed(2)}</span>
                  <span className="plan-card__price-unit">/week</span>
                </div>
                <p className="plan-card__per-meal">
                  ${plan.pricePerMeal.toFixed(2)} per meal · {plan.mealsPerDay} meal{plan.mealsPerDay > 1 ? 's' : ''}/day
                </p>
              </div>

              <p className="plan-card__desc">{plan.description}</p>

              <ul className="plan-card__perks">
                {plan.perks.map(perk => (
                  <li key={perk} className="plan-card__perk">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                className={`btn btn-lg plan-card__cta${plan.highlight ? '' : ' btn-outline'}`}
                style={plan.highlight ? { background: '#fff', color: 'var(--color-primary)', fontWeight: 700 } : {}}
                onClick={() => onSelect(plan)}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Feature table */}
        <div className="plan-compare">
          <p className="plan-compare__label">All plans include:</p>
          <div className="plan-compare__items">
            {[
              { icon: '🚚', text: 'Free weekly delivery' },
              { icon: '🔄', text: 'Skip or cancel anytime' },
              { icon: '🍽️', text: 'Chef-crafted recipes' },
              { icon: '📊', text: 'Full macro & calorie info' },
              { icon: '🌿', text: 'Seasonal, local ingredients' },
              { icon: '📦', text: 'Eco-friendly packaging' },
            ].map(f => (
              <div key={f.text} className="plan-compare__item">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

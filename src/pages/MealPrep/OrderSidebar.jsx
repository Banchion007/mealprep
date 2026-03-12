/* ===================================================
   Order Sidebar — live running total, sticky
=================================================== */
import React from 'react'
import { MEALS } from './data'
import './OrderSidebar.css'

export default function OrderSidebar({ plan, selectedMeals, quota, totalSelected }) {
  const mealEntries = Object.entries(selectedMeals)
    .map(([id, qty]) => ({ meal: MEALS.find(m => m.id === id), qty }))
    .filter(e => e.meal && e.qty > 0)

  const mealCost     = plan ? plan.pricePerMeal * totalSelected : 0
  const weeklyTotal  = plan ? plan.pricePerWeek : 0
  const remaining    = quota - totalSelected
  const fillPct      = Math.min((totalSelected / quota) * 100, 100)

  return (
    <aside className="order-sidebar">
      <div className="order-sidebar__inner">
        <h3 className="order-sidebar__title">Your Order</h3>

        {/* Plan summary */}
        {plan && (
          <div className="sidebar-plan">
            <div className="sidebar-plan__name">{plan.name} Plan</div>
            <div className="sidebar-plan__price">${plan.pricePerWeek.toFixed(2)}<span>/week</span></div>
          </div>
        )}

        {/* Quota tracker */}
        <div className="sidebar-quota">
          <div className="sidebar-quota__label">
            <span>{totalSelected} / {quota} meals</span>
            <span className={remaining === 0 ? 'sidebar-quota__full' : ''}>
              {remaining === 0 ? 'Full!' : `${remaining} remaining`}
            </span>
          </div>
          <div className="quota-track">
            <div
              className={`quota-fill${remaining === 0 ? ' quota-full' : ''}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Selected meals list */}
        {mealEntries.length > 0 ? (
          <div className="sidebar-meals">
            {mealEntries.map(({ meal, qty }) => (
              <div key={meal.id} className="sidebar-meal-row">
                <img src={meal.img} alt={meal.name} className="sidebar-meal-img" />
                <div className="sidebar-meal-info">
                  <p className="sidebar-meal-name">{meal.name}</p>
                  <p className="sidebar-meal-meta">{meal.calories} cal · ×{qty}</p>
                </div>
                <span className="sidebar-meal-price">
                  ${(plan ? plan.pricePerMeal * qty : 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="sidebar-empty">
            <svg width="28" height="28" fill="none" stroke="var(--color-text-light)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p>No meals added yet</p>
          </div>
        )}

        {/* Total */}
        <div className="sidebar-total">
          <div className="sidebar-total__row">
            <span>Meal cost ({totalSelected} meals)</span>
            <span>${mealCost.toFixed(2)}</span>
          </div>
          <div className="sidebar-total__row">
            <span>Delivery</span>
            <span style={{ color: '#16A34A', fontWeight: 600 }}>FREE</span>
          </div>
          <div className="sidebar-total__row sidebar-total__row--final">
            <span>Weekly Total</span>
            <span>${weeklyTotal.toFixed(2)}</span>
          </div>
          <p className="sidebar-total__note">Billed weekly · cancel anytime</p>
        </div>
      </div>
    </aside>
  )
}

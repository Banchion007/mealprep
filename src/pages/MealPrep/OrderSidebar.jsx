/* ===================================================
   Order Sidebar — live running total, sticky
=================================================== */
import React from 'react'
import { MEALS } from './data'
import './OrderSidebar.css'

export default function OrderSidebar({ selectedMeals, orderTotal, totalSelected }) {
  const mealEntries = Object.entries(selectedMeals)
    .map(([id, qty]) => ({ meal: MEALS.find(m => m.id === id), qty }))
    .filter(e => e.meal && e.qty > 0)

  return (
    <aside className="order-sidebar">
      <div className="order-sidebar__inner">
        <h3 className="order-sidebar__title">Your Order</h3>

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
                  ${(meal.price * qty).toFixed(2)}
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
            <span>{totalSelected} meal{totalSelected !== 1 ? 's' : ''}</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          <div className="sidebar-total__row">
            <span>Delivery</span>
            <span style={{ color: '#16A34A', fontWeight: 600 }}>FREE</span>
          </div>
          <div className="sidebar-total__row sidebar-total__row--final">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

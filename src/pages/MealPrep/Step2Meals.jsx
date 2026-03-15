/* ===================================================
   Step 2 — Meal Selection
=================================================== */
import React, { useState } from 'react'
import { MEALS } from './data'
import './Steps.css'

const TAG_CLASS = {
  'Vegan':       'tag-vegan',
  'Vegetarian':  'tag-vegetarian',
  'Keto':        'tag-keto',
  'Gluten-Free': 'tag-gf',
  'Dairy-Free':  'tag-dairy-free',
  'Halal':       'tag-halal',
  'Nut-Free':    'tag-nut-free',
}

const DIET_TAG_MAP = {
  'vegan':       'Vegan',
  'vegetarian':  'Vegetarian',
  'keto':        'Keto',
  'gluten-free': 'Gluten-Free',
  'dairy-free':  'Dairy-Free',
  'nut-free':    'Nut-Free',
  'halal':       'Halal',
}

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner']

export default function Step2Meals({ selectedMeals, preferences, onChange, onBack, onNext }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const totalSelected = Object.values(selectedMeals).reduce((s, n) => s + n, 0)
  const runningTotal  = Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
    const meal = MEALS.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)

  const prefTags    = preferences.map(p => DIET_TAG_MAP[p]).filter(Boolean)
  const mealMatches = (meal) => prefTags.every(tag => meal.tags.includes(tag))

  const filtered = MEALS.filter(m => activeCategory === 'All' || m.category === activeCategory)

  const addMeal = (id) => onChange({ ...selectedMeals, [id]: (selectedMeals[id] || 0) + 1 })

  const removeMeal = (id) => {
    const newCount = (selectedMeals[id] || 0) - 1
    if (newCount <= 0) {
      const copy = { ...selectedMeals }
      delete copy[id]
      onChange(copy)
    } else {
      onChange({ ...selectedMeals, [id]: newCount })
    }
  }

  const canContinue = totalSelected > 0

  return (
    <div className="step-panel">
      <div className="step-panel__header">
        <h2 className="step-panel__title">Choose Your Meals</h2>
        <p className="step-panel__sub">
          Add as many meals as you like — each is individually priced.
          {preferences.length > 0 && ' Meals matching your dietary preferences are highlighted in green.'}
        </p>
      </div>

      {/* Running total bar */}
      <div className="meals-quota-bar">
        <p className="meals-quota-bar__text">
          <strong>{totalSelected}</strong> meal{totalSelected !== 1 ? 's' : ''} selected
          {totalSelected > 0 && (
            <span style={{ marginLeft: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              — ${runningTotal.toFixed(2)} total
            </span>
          )}
        </p>
      </div>

      {/* Active dietary preference chips */}
      {preferences.length > 0 && (
        <div className="meals-active-prefs">
          <span className="meals-active-prefs__label">Filtering for:</span>
          {preferences.map(p => (
            <span key={p} className={`tag ${TAG_CLASS[DIET_TAG_MAP[p]] || ''}`}>
              {DIET_TAG_MAP[p]}
            </span>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div className="meals-cat-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn${activeCategory === cat ? ' filter-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal grid */}
      <div className="meal-grid">
        {filtered.map(meal => {
          const count   = selectedMeals[meal.id] || 0
          const isMatch = prefTags.length > 0 && mealMatches(meal)
          return (
            <div
              key={meal.id}
              className={`meal-card${count > 0 ? ' meal-card--selected' : ''}${isMatch ? ' meal-card--match' : ''}`}
            >
              {isMatch && <span className="meal-card__match-badge">Matches Diet</span>}
              <div className="meal-card__img-wrap">
                <img src={meal.img} alt={meal.name} className="meal-card__img" />
              </div>
              <div className="meal-card__body">
                <div className="meal-card__tags">
                  {meal.tags.map(t => (
                    <span key={t} className={`tag ${TAG_CLASS[t] || ''}`}>{t}</span>
                  ))}
                </div>
                <h4 className="meal-card__name">{meal.name}</h4>
                <p className="meal-card__desc">{meal.desc}</p>
                <div className="meal-card__macros">
                  <div className="macro-item"><strong>{meal.calories}</strong>Cal</div>
                  <div className="macro-item"><strong>{meal.protein}g</strong>Protein</div>
                  <div className="macro-item"><strong>{meal.carbs}g</strong>Carbs</div>
                  <div className="macro-item"><strong>{meal.fat}g</strong>Fat</div>
                </div>
                <div className="meal-card__counter">
                  <span className="meal-card__price">${meal.price.toFixed(2)}</span>
                  <div className="counter">
                    <button
                      className="counter__btn"
                      onClick={() => removeMeal(meal.id)}
                      disabled={count === 0}
                      aria-label="Remove one"
                    >−</button>
                    <span className="counter__val">{count}</span>
                    <button
                      className="counter__btn counter__btn--add"
                      onClick={() => addMeal(meal.id)}
                      aria-label="Add one"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!canContinue && (
        <div className="step-note">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
          </svg>
          <span>Add at least one meal to continue.</span>
        </div>
      )}

      <div className="step-nav">
        <button className="btn btn-ghost" onClick={onBack}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canContinue}
          style={!canContinue ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Continue to Delivery
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

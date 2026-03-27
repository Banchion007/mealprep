/* ===================================================
   MealPrepMenu — Netflix-style menu with search/filters
=================================================== */
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { TIERS, TIER_DESC, DIETARY_OPTIONS } from './data'
import { useMenu } from '../../contexts/MenuContext'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const TAG_CLASS = {
  'Vegan':       'tag-vegan',
  'Vegetarian':  'tag-vegetarian',
  'Keto':        'tag-keto',
  'Gluten-Free': 'tag-gf',
  'Dairy-Free':  'tag-dairy-free',
  'Nut-Free':    'tag-nut-free',
  'Spicy':       'tag-spicy',
  'Halal':       'tag-halal',
}

function MealCard({ meal, count, onAdd, onRemove }) {
  const isSelected = count > 0
  return (
    <div className={`mp-meal-card${isSelected ? ' mp-meal-card--selected' : ''}`}>
      <div className="mp-meal-card__img-wrap">
        <img src={meal.img} alt={meal.name} className="mp-meal-card__img" loading="lazy" />
        <div className="mp-meal-card__tags">
          {meal.tags.slice(0, 2).map(t => (
            <span key={t} className={`tag ${TAG_CLASS[t] || ''}`}>{t}</span>
          ))}
        </div>
        {isSelected && (
          <div className="mp-meal-card__selected-badge">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {count} added
          </div>
        )}
      </div>
      <div className="mp-meal-card__body">
        <h4 className="mp-meal-card__name">{meal.name}</h4>
        <p className="mp-meal-card__desc">{meal.desc}</p>
        <div className="mp-meal-card__macros">
          <div className="mp-macro"><span>{meal.calories}</span>cal</div>
          <div className="mp-macro"><span>{meal.protein}g</span>protein</div>
          <div className="mp-macro"><span>{meal.carbs}g</span>carbs</div>
          <div className="mp-macro"><span>{meal.fat}g</span>fat</div>
        </div>
        <div className="mp-meal-card__footer">
          <span className="mp-meal-card__price">${meal.price.toFixed(2)}</span>
          <div className="mp-counter">
            <button
              className="mp-counter__btn"
              onClick={() => onRemove(meal.id)}
              disabled={count === 0}
              aria-label="Remove one"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/>
              </svg>
            </button>
            <span className="mp-counter__val">{count}</span>
            <button
              className="mp-counter__btn mp-counter__btn--add"
              onClick={() => onAdd(meal.id)}
              aria-label="Add one"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TierRow({ tier, meals, selectedMeals, onAdd, onRemove }) {
  const rowRef = useRef(null)

  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
  const scrollRight = () => rowRef.current?.scrollBy({ left: 320, behavior: 'smooth' })

  if (meals.length === 0) return null

  return (
    <div className="mp-tier">
      <div className="mp-tier__header">
        <div>
          <h2 className="mp-tier__title">{tier}</h2>
          <p className="mp-tier__desc">{TIER_DESC[tier]}</p>
        </div>
        <div className="mp-tier__arrows">
          <button className="mp-tier__arrow" onClick={scrollLeft} aria-label="Scroll left">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="mp-tier__arrow" onClick={scrollRight} aria-label="Scroll right">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="mp-tier__row" ref={rowRef}>
        {meals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            count={selectedMeals[meal.id] || 0}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}

export default function MealPrepMenu({ selectedMeals, onChange, onNext }) {
  const { meals, loading: menuLoading } = useMenu()
  const [search,      setSearch]      = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [filterOpen,  setFilterOpen]  = useState(false)
  const filterRef = useRef(null)

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useScrollAnimation('.fade-up', `${menuLoading}-${meals.length}`)

  const totalCount = Object.values(selectedMeals).reduce((s, n) => s + n, 0)
  const totalCost  = Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
    const meal = meals.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)

  const toggleFilter = (id) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredByTier = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = meals.filter(meal => {
      const matchesSearch = !q || meal.name.toLowerCase().includes(q) || meal.desc.toLowerCase().includes(q)
      const matchesDiet   = activeFilters.length === 0 || activeFilters.every(f => meal.tags.includes(f))
      return matchesSearch && matchesDiet
    })
    return Object.fromEntries(TIERS.map(tier => [tier, filtered.filter(m => m.tier === tier)]))
  }, [search, activeFilters, meals])

  const addMeal = (id) => onChange({ ...selectedMeals, [id]: (selectedMeals[id] || 0) + 1 })
  const removeMeal = (id) => {
    const next = (selectedMeals[id] || 0) - 1
    if (next <= 0) {
      const copy = { ...selectedMeals }
      delete copy[id]
      onChange(copy)
    } else {
      onChange({ ...selectedMeals, [id]: next })
    }
  }

  const totalResults = Object.values(filteredByTier).flat().length

  return (
    <div className="mp-menu">
      {/* Sticky top bar */}
      <div className="mp-menu__topbar">
        <div className="mp-menu__topbar-inner">
          {/* Search */}
          <div className="mp-search">
            <svg className="mp-search__icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="mp-search__input"
              type="search"
              placeholder="Search meals…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search meals"
            />
            {search && (
              <button className="mp-search__clear" onClick={() => setSearch('')} aria-label="Clear search">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mp-filter-wrap" ref={filterRef}>
            <button
              className={`mp-filter-btn${activeFilters.length > 0 ? ' mp-filter-btn--active' : ''}`}
              onClick={() => setFilterOpen(v => !v)}
              aria-expanded={filterOpen}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
              {activeFilters.length > 0 && (
                <span className="mp-filter-btn__badge">{activeFilters.length}</span>
              )}
            </button>
            {filterOpen && (
              <div className="mp-filter-dropdown">
                <p className="mp-filter-dropdown__label">Dietary Preferences</p>
                {DIETARY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    className={`mp-filter-option${activeFilters.includes(opt.id) ? ' mp-filter-option--active' : ''}`}
                    onClick={() => toggleFilter(opt.id)}
                  >
                    <span className={`tag ${opt.tagClass}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem' }}>
                      {opt.label}
                    </span>
                    {activeFilters.includes(opt.id) && (
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
                {activeFilters.length > 0 && (
                  <button className="mp-filter-dropdown__clear" onClick={() => setActiveFilters([])}>
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart count */}
          {totalCount > 0 && (
            <div className="mp-menu__cart-pill">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
              {totalCount} meal{totalCount !== 1 ? 's' : ''} · ${totalCost.toFixed(2)}
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mp-active-filters">
            <span className="mp-active-filters__label">Active:</span>
            {activeFilters.map(f => (
              <button key={f} className="mp-active-filter-chip" onClick={() => toggleFilter(f)}>
                {f}
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading / empty state */}
      {menuLoading && (
        <div className="mp-menu-loading fade-up">
          <span className="dash-auth-spinner" />
        </div>
      )}
      {!menuLoading && meals.length === 0 && (
        <div className="mp-menu-empty fade-up">
          <p>The menu for this week hasn't been published yet.</p>
          <span>Check back soon!</span>
        </div>
      )}

      {/* No results */}
      {!menuLoading && totalResults === 0 && meals.length > 0 && (
        <div className="mp-no-results fade-up">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p>No meals match your search or filters.</p>
          <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setActiveFilters([]) }}>
            Clear all
          </button>
        </div>
      )}

      {/* Tier rows */}
      <div className="mp-tiers fade-up">
        {TIERS.map(tier => (
          <TierRow
            key={tier}
            tier={tier}
            meals={filteredByTier[tier] || []}
            selectedMeals={selectedMeals}
            onAdd={addMeal}
            onRemove={removeMeal}
          />
        ))}
      </div>

      {/* Floating cart bar */}
      <div className={`mp-cart-bar${totalCount > 0 ? ' mp-cart-bar--visible' : ''}`}>
        <div className="mp-cart-bar__inner">
          <div className="mp-cart-bar__info">
            <span className="mp-cart-bar__count">
              {totalCount} meal{totalCount !== 1 ? 's' : ''} selected
            </span>
            <span className="mp-cart-bar__total">${totalCost.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={totalCount === 0}
          >
            Continue to Delivery
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================================================
   GroceryList — recipe selector, scaling, aggregated
   ingredient list, and shopping calendar
=================================================== */
import React, { useState, useEffect, useMemo } from 'react'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa']

const CATEGORY_ORDER = ['Produce', 'Proteins', 'Dairy', 'Pantry', 'Other']

/* ── Aggregate ingredients across selected recipes with scaling ── */
function aggregateIngredients(selectedIds, scalings, recipes) {
  const combined = {}

  selectedIds.forEach(id => {
    const recipe = recipes.find(r => r.id === id)
    if (!recipe) return
    const desiredServings = parseFloat(scalings[id]) || recipe.serves
    const scale = desiredServings / recipe.serves

    recipe.ingredients.forEach(ing => {
      const key = `${ing.name.toLowerCase()}||${ing.unit}`
      if (combined[key]) {
        combined[key].qty    += parseFloat(ing.qty) * scale
        combined[key].sources++
      } else {
        combined[key] = {
          name:     ing.name,
          qty:      parseFloat(ing.qty) * scale,
          unit:     ing.unit,
          category: ing.category || 'Other',
          sources:  1,
          key,
        }
      }
    })
  })

  return Object.values(combined).map(item => ({
    ...item,
    qty: Math.round(item.qty * 10) / 10,
  }))
}

/* ── Mini Calendar ── */
function MiniCalendar({ savedDates, selectedDate, onSelect }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const todayStr = today.toISOString().split('T')[0]

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth    = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr: ds, isToday: ds === todayStr, hasList: !!savedDates[ds] })
  }

  return (
    <div className="cal-wrap">
      <p className="cal-section-title">Shopping Calendar</p>
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="cal-month-label">{MONTH_NAMES[month]} {year}</span>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>
      <div className="cal-days-header">
        {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) =>
          cell === null
            ? <div key={`e-${i}`} className="cal-day cal-day--empty" />
            : <button
                key={cell.dateStr}
                className={[
                  'cal-day',
                  cell.isToday    ? 'cal-day--today'    : '',
                  cell.hasList    ? 'cal-day--has-list'  : '',
                  selectedDate === cell.dateStr ? 'cal-day--selected' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(cell.dateStr)}
              >
                {cell.day}
                {cell.hasList && <span className="cal-dot" />}
              </button>
        )}
      </div>
    </div>
  )
}

/* ── Main GroceryList page ── */
export default function GroceryList() {
  const [recipes,    setRecipes]    = useState([])
  const [selected,   setSelected]   = useState({})   // { recipeId: true }
  const [scalings,   setScalings]   = useState({})   // { recipeId: servingCount }
  const [purchased,  setPurchased]  = useState({})   // { ingredientKey: true }
  const [savedLists, setSavedLists] = useState({})   // { dateStr: aggregated[] }
  const [calDate,    setCalDate]    = useState(null)

  // Load data
  useEffect(() => {
    setRecipes(JSON.parse(localStorage.getItem('hc_recipes') || '[]'))
    setSavedLists(JSON.parse(localStorage.getItem('hc_grocery_calendar') || '{}'))
  }, [])

  // Aggregate based on current selections
  const selectedIds = Object.keys(selected).filter(id => selected[id])

  const aggregated = useMemo(
    () => aggregateIngredients(selectedIds, scalings, recipes),
    [selectedIds, scalings, recipes]
  )

  // Group by category
  const grouped = useMemo(() => {
    const g = {}
    aggregated.forEach(item => {
      const cat = CATEGORY_ORDER.includes(item.category) ? item.category : 'Other'
      if (!g[cat]) g[cat] = []
      g[cat].push(item)
    })
    return g
  }, [aggregated])

  const toggleRecipe = (id) =>
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))

  const setScaling = (id, val) =>
    setScalings(prev => ({ ...prev, [id]: val }))

  const togglePurchased = (key) =>
    setPurchased(prev => ({ ...prev, [key]: !prev[key] }))

  const clearPurchased = () => setPurchased({})

  // Save to calendar date
  const saveToDate = () => {
    if (!calDate) return alert('Select a date on the calendar first.')
    if (aggregated.length === 0) return alert('Generate a grocery list first by selecting recipes.')
    const updated = { ...savedLists, [calDate]: aggregated }
    setSavedLists(updated)
    localStorage.setItem('hc_grocery_calendar', JSON.stringify(updated))
    alert(`Grocery list saved to ${calDate}!`)
  }

  const handleCalSelect = (dateStr) => {
    setCalDate(prev => prev === dateStr ? null : dateStr)
  }

  const calendarSavedList = calDate ? savedLists[calDate] : null

  const purchasedCount = Object.values(purchased).filter(Boolean).length
  const totalItems     = aggregated.length

  return (
    <div>
      <h1 className="dash-page-title">Grocery List Generator</h1>

      <div className="grocery-layout">
        {/* ── Left panel: recipe selector ── */}
        <div>
          <div className="grocery-panel">
            <p className="grocery-panel__title">
              Select Recipes
              {selectedIds.length > 0 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                  ({selectedIds.length} selected)
                </span>
              )}
            </p>

            {recipes.length === 0 ? (
              <div className="dash-empty" style={{ padding: '1.5rem 0' }}>
                <span className="dash-empty__icon">📖</span>
                <p>No recipes yet. Add recipes in the Recipe Library.</p>
                <a href="/dashboard/recipes" className="btn btn-outline btn-sm">Go to Recipe Library</a>
              </div>
            ) : (
              <div className="recipe-select-list">
                {recipes.map(r => (
                  <div
                    key={r.id}
                    className={`recipe-select-item${selected[r.id] ? ' recipe-select-item--checked' : ''}`}
                  >
                    <div className="recipe-select-item__row" onClick={() => toggleRecipe(r.id)}>
                      <div className="recipe-select-item__check">
                        {selected[r.id] && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className="recipe-select-item__name">{r.name}</span>
                      <span className="recipe-select-item__serves">serves {r.serves}</span>
                    </div>

                    {selected[r.id] && (
                      <div className="recipe-select-item__scaling">
                        <label>Scale to how many servings?</label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={scalings[r.id] ?? r.serves}
                          onChange={e => setScaling(r.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedIds.length > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSelected({}); setScalings({}) }}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                Clear Selection
              </button>
            )}

            {/* Calendar */}
            <MiniCalendar
              savedDates={savedLists}
              selectedDate={calDate}
              onSelect={handleCalSelect}
            />

            {/* Assign / view */}
            {calDate && (
              <div className="cal-assign-row">
                <span className="cal-selected-label">
                  {calendarSavedList
                    ? `${calDate} has a saved list (${calendarSavedList.length} items)`
                    : `Selected: ${calDate}`}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={saveToDate}
                  disabled={aggregated.length === 0}
                >
                  {calendarSavedList ? 'Update List' : 'Save List'}
                </button>
              </div>
            )}

            {/* Show saved list for selected date */}
            {calDate && calendarSavedList && (
              <div className="cal-saved-preview">
                <p className="cal-saved-preview__title">Saved list for {calDate}:</p>
                <div className="cal-saved-preview__items">
                  {calendarSavedList.slice(0, 5).map(item => (
                    <div key={item.key}>{item.qty} {item.unit} {item.name}</div>
                  ))}
                  {calendarSavedList.length > 5 && (
                    <div style={{ opacity: 0.6 }}>+{calendarSavedList.length - 5} more items</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel: generated list ── */}
        <div className="grocery-panel">
          <div className="dash-section__header" style={{ marginBottom: '1rem' }}>
            <p className="grocery-panel__title" style={{ marginBottom: 0 }}>
              Generated List
              {totalItems > 0 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                  {purchasedCount}/{totalItems} checked
                </span>
              )}
            </p>
            {totalItems > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {purchasedCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={clearPurchased}>Uncheck All</button>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print List
                </button>
              </div>
            )}
          </div>

          {aggregated.length === 0 ? (
            <div className="grocery-empty">
              <svg width="48" height="48" fill="none" stroke="var(--color-border)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                {recipes.length === 0
                  ? 'Add recipes first, then select them to generate a grocery list.'
                  : 'Select recipes on the left to generate a grocery list.'}
              </p>
            </div>
          ) : (
            <>
              {CATEGORY_ORDER.filter(cat => grouped[cat]?.length > 0).map(cat => (
                <div key={cat} className="grocery-category">
                  <p className="grocery-category__title">{cat}</p>
                  {grouped[cat].map(item => (
                    <div
                      key={item.key}
                      className={`grocery-item${purchased[item.key] ? ' grocery-item--purchased' : ''}`}
                    >
                      <div
                        className={`grocery-item__checkbox${purchased[item.key] ? ' grocery-item__checkbox--checked' : ''}`}
                        onClick={() => togglePurchased(item.key)}
                      >
                        {purchased[item.key] && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className="grocery-item__name">{item.name}</span>
                      <span className="grocery-item__qty">{item.qty} {item.unit}</span>
                      {item.sources > 1 && (
                        <span className="grocery-item__sources">{item.sources} recipes</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

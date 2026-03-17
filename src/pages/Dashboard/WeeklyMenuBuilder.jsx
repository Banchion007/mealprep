/* ===================================================
   WeeklyMenuBuilder — drag-and-drop weekly menu editor
   Left: scrollable recipe library sidebar
   Right: 3 tier drop zones (Essentials / Classics / Deluxe)
   Actions: Save Draft + Publish Menu (both upsert to Supabase)
=================================================== */
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const TIERS = [
  { key: 'Essentials', color: '#16a34a', desc: 'Simple, nourishing, budget-friendly · Always available' },
  { key: 'Classics',   color: 'oklch(0.234 0.0787 282.66)', desc: 'Chef-crafted complete meals' },
  { key: 'Deluxe',     color: 'oklch(0.6228 0.2064 36.04)', desc: "The chef's finest selections" },
]

export default function WeeklyMenuBuilder() {
  // recipes from localStorage
  const [recipes, setRecipes] = useState([])
  // assignments: { Essentials: [recipeId,...], Classics: [...], Deluxe: [...] }
  const [assignments, setAssignments] = useState({ Essentials: [], Classics: [], Deluxe: [] })
  const [publishedAt, setPublishedAt] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [toast, setToast]         = useState('')
  const [search, setSearch]       = useState('')
  const [dragOverTier, setDragOverTier] = useState(null) // tier key or 'sidebar'

  // Load recipes from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('hc_recipes') || '[]')
    setRecipes(stored)
  }, [])

  // Load existing draft from Supabase on mount
  useEffect(() => {
    async function loadDraft() {
      try {
        const { data } = await supabase
          .from('weekly_menu')
          .select('meals, published_at')
          .eq('status', 'draft')
          .single()
        if (data?.meals) {
          const rebuilt = { Essentials: [], Classics: [], Deluxe: [] }
          for (const meal of data.meals) {
            if (rebuilt[meal.tier]) rebuilt[meal.tier].push(meal.id)
          }
          setAssignments(rebuilt)
        }
        // Also fetch published_at from published row
        const { data: pub } = await supabase
          .from('weekly_menu')
          .select('published_at')
          .eq('status', 'published')
          .single()
        if (pub?.published_at) setPublishedAt(pub.published_at)
      } catch {
        // No draft yet — start fresh
      } finally {
        setLoading(false)
      }
    }
    loadDraft()
  }, [])

  const showToast = (msg, duration = 3000) => {
    setToast(msg)
    setTimeout(() => setToast(''), duration)
  }

  // Get which tier a recipe is in (or null)
  const getAssignedTier = (id) => {
    for (const t of Object.keys(assignments)) {
      if (assignments[t].includes(id)) return t
    }
    return null
  }

  // Move recipe to a tier (or remove from all tiers if target is null/'sidebar')
  const moveToTier = (recipeId, targetTier) => {
    setAssignments(prev => {
      const next = {}
      for (const t of Object.keys(prev)) {
        next[t] = prev[t].filter(id => id !== recipeId)
      }
      if (targetTier && targetTier !== 'sidebar') {
        next[targetTier] = [...next[targetTier], recipeId]
      }
      return next
    })
  }

  // Build meal snapshot for Supabase: map recipe IDs to full objects
  const buildSnapshot = () => {
    const meals = []
    for (const tierKey of Object.keys(assignments)) {
      for (const id of assignments[tierKey]) {
        const recipe = recipes.find(r => r.id === id)
        if (!recipe) continue
        meals.push({
          id:       recipe.id,
          tier:     tierKey,
          name:     recipe.name,
          desc:     recipe.desc     || '',
          price:    parseFloat(recipe.price)    || 0,
          calories: parseInt(recipe.calories)   || 0,
          protein:  parseInt(recipe.protein)    || 0,
          carbs:    parseInt(recipe.carbs)       || 0,
          fat:      parseInt(recipe.fat)         || 0,
          img:      recipe.img      || '',
          tags:     recipe.dietaryTags || [],
        })
      }
    }
    return meals
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('weekly_menu')
        .upsert({ status: 'draft', meals: buildSnapshot(), updated_at: new Date().toISOString() },
                 { onConflict: 'status' })
      if (error) throw error
      showToast('Draft saved.')
    } catch (err) {
      showToast('Error: ' + err.message, 5000)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    const total = Object.values(assignments).flat().length
    if (total === 0) { showToast('Add at least one recipe before publishing.', 4000); return }
    if (!window.confirm(`Publish ${total} meal${total !== 1 ? 's' : ''} to the customer menu?`)) return
    setPublishing(true)
    try {
      const now = new Date().toISOString()
      const snapshot = buildSnapshot()
      // Save draft too so both stay in sync
      await supabase.from('weekly_menu')
        .upsert({ status: 'draft', meals: snapshot, updated_at: now },
                 { onConflict: 'status' })
      const { error } = await supabase.from('weekly_menu')
        .upsert({ status: 'published', meals: snapshot, published_at: now, updated_at: now },
                 { onConflict: 'status' })
      if (error) throw error
      setPublishedAt(now)
      showToast('Menu published! Customers can now see the new menu.', 5000)
    } catch (err) {
      showToast('Publish error: ' + err.message, 5000)
    } finally {
      setPublishing(false)
    }
  }

  // Drag handlers
  const handleDragStart = (e, recipeId, fromTier) => {
    e.dataTransfer.setData('recipeId', recipeId)
    e.dataTransfer.setData('fromTier', fromTier || 'sidebar')
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetTier) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverTier(targetTier)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverTier(null)
  }

  const handleDrop = (e, targetTier) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('recipeId')
    if (id) moveToTier(id, targetTier)
    setDragOverTier(null)
  }

  const handleDragEnd = () => setDragOverTier(null)

  const filteredRecipes = recipes.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalAssigned = Object.values(assignments).flat().length

  if (loading) {
    return (
      <div className="wm-loading">
        <span className="dash-auth-spinner" />
        <p>Loading menu builder…</p>
      </div>
    )
  }

  return (
    <div className="wm-layout">
      {/* ── Left sidebar ── */}
      <aside
        className={`wm-sidebar${dragOverTier === 'sidebar' ? ' wm-sidebar--over' : ''}`}
        onDragOver={e => handleDragOver(e, 'sidebar')}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e, 'sidebar')}
      >
        <div className="wm-sidebar__head">
          <h2 className="wm-sidebar__title">Recipe Library</h2>
          <p className="wm-sidebar__count">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
          <div className="wm-sidebar__search-wrap">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="search"
              className="wm-sidebar__search"
              placeholder="Search recipes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <p className="wm-sidebar__hint">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          Drag into a tier below
        </p>
        <div className="wm-sidebar__list">
          {filteredRecipes.length === 0 && (
            <p className="wm-sidebar__empty">No recipes found.</p>
          )}
          {filteredRecipes.map(recipe => {
            const tier = getAssignedTier(recipe.id)
            return (
              <div
                key={recipe.id}
                className={`wm-recipe-item${tier ? ' wm-recipe-item--assigned' : ''}`}
                draggable
                onDragStart={e => handleDragStart(e, recipe.id, tier || 'sidebar')}
                onDragEnd={handleDragEnd}
              >
                {recipe.img
                  ? <img src={recipe.img} alt={recipe.name} className="wm-recipe-item__img" />
                  : <div className="wm-recipe-item__img-ph">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                }
                <div className="wm-recipe-item__info">
                  <p className="wm-recipe-item__name">{recipe.name}</p>
                  {recipe.price
                    ? <p className="wm-recipe-item__price">${parseFloat(recipe.price).toFixed(2)}</p>
                    : <p className="wm-recipe-item__no-price">No price set</p>
                  }
                </div>
                {tier ? (
                  <span className="wm-tier-badge" data-tier={tier.toLowerCase()}>{tier}</span>
                ) : (
                  <svg className="wm-recipe-item__drag-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                    <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                    <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Right main board ── */}
      <div className="wm-board">
        {/* Header */}
        <div className="wm-board__header">
          <div>
            <h1 className="wm-board__title">Weekly Menu Builder</h1>
            <p className="wm-board__sub">
              {totalAssigned} meal{totalAssigned !== 1 ? 's' : ''} assigned
              {publishedAt && (
                <span className="wm-board__pub-date">
                  · Last published {new Date(publishedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <div className="wm-board__actions">
            {toast && <span className="wm-toast">{toast}</span>}
            <button className="btn btn-outline btn-sm" onClick={handleSaveDraft} disabled={saving || publishing}>
              {saving && <span className="wm-spin" />}
              Save Draft
            </button>
            <button className="btn btn-primary" onClick={handlePublish} disabled={saving || publishing}>
              {publishing ? <span className="wm-spin wm-spin--white" /> : (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                </svg>
              )}
              Publish Menu
            </button>
          </div>
        </div>

        {/* Tier rows */}
        <div className="wm-tiers">
          {TIERS.map(tier => {
            const assignedIds = assignments[tier.key] || []
            const assignedRecipes = assignedIds.map(id => recipes.find(r => r.id === id)).filter(Boolean)
            const isOver = dragOverTier === tier.key

            return (
              <div
                key={tier.key}
                className={`wm-tier-zone${isOver ? ' wm-tier-zone--over' : ''}`}
                onDragOver={e => handleDragOver(e, tier.key)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, tier.key)}
              >
                <div className="wm-tier-zone__header">
                  <div className="wm-tier-zone__title-row">
                    <span className="wm-tier-zone__dot" style={{ background: tier.color }} />
                    <h3 className="wm-tier-zone__name">{tier.key}</h3>
                    <span className="wm-tier-zone__desc">{tier.desc}</span>
                  </div>
                  <span className="wm-tier-zone__count">{assignedRecipes.length} meal{assignedRecipes.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="wm-tier-zone__cards">
                  {assignedRecipes.map(recipe => (
                    <div
                      key={recipe.id}
                      className="wm-tier-card"
                      draggable
                      onDragStart={e => handleDragStart(e, recipe.id, tier.key)}
                      onDragEnd={handleDragEnd}
                    >
                      {recipe.img
                        ? <img src={recipe.img} alt={recipe.name} className="wm-tier-card__img" />
                        : <div className="wm-tier-card__img-ph">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                      }
                      <div className="wm-tier-card__info">
                        <p className="wm-tier-card__name">{recipe.name}</p>
                        <p className="wm-tier-card__price">
                          {recipe.price ? `$${parseFloat(recipe.price).toFixed(2)}` : 'No price'}
                        </p>
                      </div>
                      <button
                        className="wm-tier-card__remove"
                        onClick={() => moveToTier(recipe.id, 'sidebar')}
                        title="Remove from this tier"
                      >
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}

                  {assignedRecipes.length === 0 && (
                    <div className="wm-tier-zone__empty">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Drop recipes here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

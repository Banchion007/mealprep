/* ===================================================
   Recipes — recipe library with add/edit modal
=================================================== */
import React, { useState, useEffect, useRef } from 'react'

const ALLERGEN_OPTIONS = [
  'Gluten', 'Dairy', 'Eggs', 'Fish', 'Shellfish',
  'Tree Nuts', 'Peanuts', 'Soy', 'Sesame', 'Sulfites',
]

const ING_CATEGORIES = ['Produce', 'Proteins', 'Dairy', 'Pantry', 'Other']

const UNIT_OPTIONS = [
  'tsp', 'tbsp', 'cup', 'oz', 'lb', 'g', 'kg', 'ml',
  'pieces', 'whole', 'cloves', 'cans', 'scoop',
  'large', 'medium', 'small', 'pint', 'to taste',
]

const EMPTY_RECIPE = {
  id: '',
  name: '',
  serves: 4,
  prepTime: 15,
  cookTime: 30,
  categoryTags: [],
  allergenTags: [],
  ingredients: [{ name: '', qty: '', unit: 'cup', category: 'Pantry' }],
  instructions: '',
}

/* ── TagChipsInput: free-text multi-tag input ── */
function TagChipsInput({ value, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)

  const addTag = (raw) => {
    const tag = raw.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setInputVal('')
  }

  const removeTag = (tag) => onChange(value.filter(t => t !== tag))

  return (
    <div className="tag-chips-input" onClick={() => inputRef.current?.focus()}>
      {value.map(t => (
        <span key={t} className="tag-chip">
          {t}
          <button type="button" className="tag-chip__remove" onClick={() => removeTag(t)}>×</button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
            e.preventDefault(); addTag(inputVal)
          }
          if (e.key === 'Backspace' && !inputVal && value.length > 0) {
            removeTag(value[value.length - 1])
          }
        }}
        onBlur={() => { if (inputVal.trim()) addTag(inputVal) }}
        placeholder={value.length === 0 ? placeholder : ''}
      />
    </div>
  )
}

/* ── RecipeModal ── */
function RecipeModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_RECIPE)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const updateIngredient = (idx, key, val) => {
    const ings = [...form.ingredients]
    ings[idx] = { ...ings[idx], [key]: val }
    set('ingredients', ings)
  }

  const addIngredient = () =>
    set('ingredients', [...form.ingredients, { name: '', qty: '', unit: 'cup', category: 'Pantry' }])

  const removeIngredient = (idx) =>
    set('ingredients', form.ingredients.filter((_, i) => i !== idx))

  const toggleAllergen = (a) =>
    set('allergenTags', form.allergenTags.includes(a)
      ? form.allergenTags.filter(x => x !== a)
      : [...form.allergenTags, a]
    )

  const handleSave = () => {
    if (!form.name.trim()) return alert('Recipe name is required.')
    const recipe = {
      ...form,
      id: form.id || `r${Date.now()}`,
      ingredients: form.ingredients.filter(i => i.name.trim()),
    }
    onSave(recipe)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{initial?.id ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <div className="modal__body">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Recipe Name *</label>
            <input
              className="form-input"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Herb-Crusted Salmon"
            />
          </div>

          {/* Serves / times */}
          <div className="modal-row-2">
            <div className="form-group">
              <label className="form-label">Serves</label>
              <input className="form-input" type="number" min="1" value={form.serves}
                onChange={e => set('serves', parseInt(e.target.value) || 1)} />
            </div>
            <div></div>
          </div>
          <div className="modal-row-2">
            <div className="form-group">
              <label className="form-label">Prep Time (min)</label>
              <input className="form-input" type="number" min="0" value={form.prepTime}
                onChange={e => set('prepTime', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Cook Time (min)</label>
              <input className="form-input" type="number" min="0" value={form.cookTime}
                onChange={e => set('cookTime', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Category tags */}
          <div className="form-group">
            <label className="form-label">Category Tags</label>
            <TagChipsInput
              value={form.categoryTags}
              onChange={v => set('categoryTags', v)}
              placeholder="Type tag and press Enter (e.g. Dinner, Meal Prep)"
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Press Enter or comma to add a tag</span>
          </div>

          {/* Allergen tags */}
          <div className="form-group">
            <label className="form-label">Allergen Tags</label>
            <div className="allergen-grid">
              {ALLERGEN_OPTIONS.map(a => (
                <label
                  key={a}
                  className={`allergen-checkbox${form.allergenTags.includes(a) ? ' allergen-checkbox--selected' : ''}`}
                >
                  <input type="checkbox" checked={form.allergenTags.includes(a)} onChange={() => toggleAllergen(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label className="form-label">Ingredients</label>
            <div className="ingredient-list">
              <div className="ingredient-row-header">
                <span>Ingredient</span><span>Qty</span><span>Unit</span><span>Category</span><span></span>
              </div>
              {form.ingredients.map((ing, idx) => (
                <div key={idx} className="ingredient-row">
                  <input
                    placeholder="e.g. Chicken breast"
                    value={ing.name}
                    onChange={e => updateIngredient(idx, 'name', e.target.value)}
                  />
                  <input
                    type="number" min="0" step="0.25" placeholder="1"
                    value={ing.qty}
                    onChange={e => updateIngredient(idx, 'qty', e.target.value)}
                  />
                  <select value={ing.unit} onChange={e => updateIngredient(idx, 'unit', e.target.value)}>
                    {UNIT_OPTIONS.map(u => <option key={u}>{u}</option>)}
                  </select>
                  <select value={ing.category} onChange={e => updateIngredient(idx, 'category', e.target.value)}>
                    {ING_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button
                    type="button"
                    className="ingredient-row__remove"
                    onClick={() => removeIngredient(idx)}
                    disabled={form.ingredients.length === 1}
                  >×</button>
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={addIngredient}
                style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                + Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label className="form-label">Instructions</label>
            <textarea
              className="form-textarea"
              value={form.instructions}
              onChange={e => set('instructions', e.target.value)}
              placeholder="Step-by-step cooking instructions…"
              rows={5}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Recipe</button>
        </div>
      </div>
    </div>
  )
}

/* ── RecipeCard ── */
function RecipeCard({ recipe, onEdit, onDelete }) {
  const handleShare = () => {
    const text = `${recipe.name} — serves ${recipe.serves}, ${recipe.ingredients.length} ingredients`
    if (navigator.share) {
      navigator.share({ title: recipe.name, text }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(text)
        .then(() => alert('Recipe details copied to clipboard!'))
        .catch(() => alert(text))
    }
  }

  return (
    <div className="recipe-card">
      <div className="recipe-card__header">
        <h3 className="recipe-card__name">{recipe.name}</h3>
        <div className="recipe-card__actions">
          <button className="recipe-card__icon-btn" onClick={handleShare} title="Share">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button className="recipe-card__icon-btn" onClick={() => onEdit(recipe)} title="Edit">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="recipe-card__icon-btn recipe-card__icon-btn--danger" onClick={() => onDelete(recipe.id)} title="Delete">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="recipe-card__meta">
        <span className="recipe-card__meta-item">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          Serves {recipe.serves}
        </span>
        <span className="recipe-card__meta-item">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {recipe.prepTime + recipe.cookTime} min
        </span>
        <span className="recipe-card__meta-item">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {recipe.ingredients.length} ingredients
        </span>
      </div>

      <hr className="recipe-card__divider" />

      {/* Category tags */}
      {recipe.categoryTags.length > 0 && (
        <div className="recipe-card__tags">
          {recipe.categoryTags.map(t => (
            <span key={t} className="tag-cat">{t}</span>
          ))}
        </div>
      )}

      {/* Allergen tags */}
      {recipe.allergenTags.length > 0 && (
        <div className="recipe-card__tags">
          {recipe.allergenTags.map(a => (
            <span key={a} className="tag-allergen">⚠ {a}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Recipes page ── */
export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [search,  setSearch]  = useState('')
  const [tagFilter, setTagFilter] = useState('All')
  const [modal, setModal]     = useState(null) // null | 'add' | recipe object for edit

  // Load from localStorage
  useEffect(() => {
    setRecipes(JSON.parse(localStorage.getItem('hc_recipes') || '[]'))
  }, [])

  const save = (updated) => {
    localStorage.setItem('hc_recipes', JSON.stringify(updated))
    setRecipes(updated)
  }

  const handleSave = (recipe) => {
    const existing = recipes.find(r => r.id === recipe.id)
    const updated  = existing
      ? recipes.map(r => r.id === recipe.id ? recipe : r)
      : [...recipes, recipe]
    save(updated)
    setModal(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this recipe?')) return
    save(recipes.filter(r => r.id !== id))
  }

  // Collect all unique category tags for the filter dropdown
  const allTags = ['All', ...new Set(recipes.flatMap(r => r.categoryTags))]

  const filtered = recipes.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.categoryTags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
    const matchTag = tagFilter === 'All' || r.categoryTags.includes(tagFilter)
    return matchSearch && matchTag
  })

  return (
    <div>
      <h1 className="dash-page-title">Recipe Library</h1>

      {/* Search + Filter + Add */}
      <div className="recipe-search-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, tag, or ingredient…"
        />
        <select
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', background: 'var(--color-surface)', color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit' }}
        >
          {allTags.map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Recipe
        </button>
      </div>

      {/* Result count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
        <strong style={{ color: 'var(--color-text)' }}>{filtered.length}</strong> recipe{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="dash-empty">
          <span className="dash-empty__icon">📖</span>
          <p>{recipes.length === 0
            ? 'No recipes yet. Add your first recipe!'
            : 'No recipes match your search.'}
          </p>
          {recipes.length === 0 && (
            <button className="btn btn-primary btn-sm" onClick={() => setModal('add')}>Add Recipe</button>
          )}
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map(r => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onEdit={recipe => setModal(recipe)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <RecipeModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

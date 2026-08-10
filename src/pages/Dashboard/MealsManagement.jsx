/* ===================================================
   Meals Management — admin interface to manage meal catalog
   Create, edit, delete meals; upload images to Supabase Storage
=================================================== */
import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './MealsManagement.css'

const TIERS = ['Essentials', 'Classics', 'Deluxe']
const DIETARY_TAGS = ['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Spicy']

function MealForm({ meal, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState(meal || {
    name: '',
    description: '',
    tier: 'Essentials',
    price: '',
    quantity_available: '',
    category: 'Lunch',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    dietary_tags: [],
    image_url: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter(t => t !== tag)
        : [...prev.dietary_tags, tag]
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const filename = `meals/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('gallery-uploads')
        .upload(filename, file, { upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-uploads')
        .getPublicUrl(filename)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err) {
      alert('Error uploading image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Meal name is required')
      return
    }
    if (!formData.price) {
      alert('Price is required')
      return
    }

    try {
      await onSave(formData)
    } catch (err) {
      alert('Error saving meal: ' + err.message)
    }
  }

  return (
    <div className="meal-form-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="meal-form">
        <div className="meal-form__header">
          <h2>{meal ? 'Edit Meal' : 'Add New Meal'}</h2>
          <button className="meal-form__close" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="meal-form__body">
          <div className="form-group">
            <label className="form-label">Meal Name *</label>
            <input
              className="form-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Herb-Crusted Salmon"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the meal..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tier *</label>
              <select
                className="form-select"
                name="tier"
                value={formData.tier}
                onChange={handleChange}
              >
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                className="form-input"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="12.99"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity Available</label>
              <input
                className="form-input"
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                placeholder="e.g., 10, 25, 50"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Macros</label>
            <div className="form-row">
              <input
                className="form-input"
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="Calories"
                min="0"
              />
              <input
                className="form-input"
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                placeholder="Protein (g)"
                min="0"
              />
              <input
                className="form-input"
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                placeholder="Carbs (g)"
                min="0"
              />
              <input
                className="form-input"
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                placeholder="Fat (g)"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Tags</label>
            <div className="meal-tags-grid">
              {DIETARY_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`meal-tag-btn${formData.dietary_tags.includes(tag) ? ' meal-tag-btn--active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="meal-image-upload">
              {formData.image_url && (
                <div className="meal-image-preview">
                  <img src={formData.image_url} alt={formData.name} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || uploadingImage}
            >
              {saving ? 'Saving...' : 'Save Meal'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MealsManagement() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filterTier, setFilterTier] = useState('All')

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('tier', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setMeals(data || [])
    } catch (err) {
      console.error('Error fetching meals:', err)
      alert('Failed to load meals: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMeal = async (formData) => {
    setSaving(true)
    try {
      if (editingMeal) {
        // Update existing meal
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: formData.name,
            description: formData.description,
            tier: formData.tier,
            price: parseFloat(formData.price),
            quantity_available: formData.quantity_available ? parseInt(formData.quantity_available) : null,
            category: formData.category,
            calories: formData.calories ? parseInt(formData.calories) : null,
            protein: formData.protein ? parseInt(formData.protein) : null,
            carbs: formData.carbs ? parseInt(formData.carbs) : null,
            fat: formData.fat ? parseInt(formData.fat) : null,
            dietary_tags: formData.dietary_tags,
            image_url: formData.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMeal.id)

        if (error) throw error
      } else {
        // Insert new meal
        const { error } = await supabase
          .from('menu_items')
          .insert([{
            name: formData.name,
            description: formData.description,
            tier: formData.tier,
            price: parseFloat(formData.price),
            quantity_available: formData.quantity_available ? parseInt(formData.quantity_available) : null,
            category: formData.category,
            calories: formData.calories ? parseInt(formData.calories) : null,
            protein: formData.protein ? parseInt(formData.protein) : null,
            carbs: formData.carbs ? parseInt(formData.carbs) : null,
            fat: formData.fat ? parseInt(formData.fat) : null,
            dietary_tags: formData.dietary_tags,
            image_url: formData.image_url,
            user_id: (await supabase.auth.getUser()).data?.user?.id,
          }])

        if (error) throw error
      }

      await fetchMeals()
      setShowForm(false)
      setEditingMeal(null)
    } catch (err) {
      console.error('Error saving meal:', err)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMeal = async (id) => {
    if (!confirm('Delete this meal? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchMeals()
    } catch (err) {
      console.error('Error deleting meal:', err)
      alert('Failed to delete meal: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="acct-spinner" style={{ margin: '0 auto 1rem' }} />
          <p>Loading meals...</p>
        </div>
      </div>
    )
  }

  const filtered = filterTier === 'All'
    ? meals
    : meals.filter(m => m.tier === filterTier)

  return (
    <div>
      <h1 className="dash-page-title">Meals Management</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', ...TIERS].map(tier => (
            <button
              key={tier}
              className={`btn${filterTier === tier ? ' btn-primary' : ' btn-outline'} btn-sm`}
              onClick={() => setFilterTier(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingMeal(null)
            setShowForm(true)
          }}
        >
          + Add Meal
        </button>
      </div>

      <div className="meals-grid">
        {filtered.map(meal => (
          <div key={meal.id} className="meal-card">
            <div className="meal-card__image">
              {meal.image_url ? (
                <img src={meal.image_url} alt={meal.name} />
              ) : (
                <div style={{ background: '#f1f5f9', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#94a3b8' }}>No image</span>
                </div>
              )}
            </div>
            <div className="meal-card__body">
              <h3 className="meal-card__name">{meal.name}</h3>
              <p className="meal-card__description">{meal.description}</p>
              <div className="meal-card__meta">
                <span className="meal-card__tier">{meal.tier}</span>
                <span className="meal-card__price">${meal.price?.toFixed(2)}</span>
              </div>
              <div className="meal-card__actions">
                <button
                  className="meal-card__btn"
                  onClick={() => {
                    setEditingMeal(meal)
                    setShowForm(true)
                  }}
                >
                  Edit
                </button>
                <button
                  className="meal-card__btn meal-card__btn--delete"
                  onClick={() => handleDeleteMeal(meal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <MealForm
          meal={editingMeal}
          onSave={handleSaveMeal}
          onCancel={() => {
            setShowForm(false)
            setEditingMeal(null)
          }}
          saving={saving}
        />
      )}
    </div>
  )
}

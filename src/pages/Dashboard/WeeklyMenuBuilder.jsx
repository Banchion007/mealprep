/* ===================================================
   WeeklyMenuBuilder — simple menu item manager
   Three tiers: Essentials, Classics, Deluxe
   Add items with just name and description
=================================================== */
import React, { useState } from 'react'
import { useMenuItems } from '../../hooks/useMenuItems'

const TIERS = [
  { key: 'Essentials', color: '#16a34a', desc: 'Simple, nourishing, budget-friendly · Always available' },
  { key: 'Classics',   color: 'oklch(0.234 0.0787 282.66)', desc: 'Chef-crafted complete meals' },
  { key: 'Deluxe',     color: 'oklch(0.6228 0.2064 36.04)', desc: "The chef's finest selections" },
]

function AddItemModal({ tier, onAdd, onClose }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setAdding(true)
    try {
      await onAdd(name, description, tier)
      setName('')
      setDescription('')
      onClose()
    } catch (err) {
      alert('Error adding item: ' + err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '450px' }}>
        <div className="modal__header">
          <h2 className="modal__title">Add Item to {tier}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Grilled Salmon with Vegetables"
              disabled={adding}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the dish..."
              rows="3"
              disabled={adding}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={adding}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={adding || !name.trim()}>
              {adding ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function WeeklyMenuBuilder() {
  const { items, loading, error, addItem, deleteItem } = useMenuItems()
  const [addingToTier, setAddingToTier] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the menu?')) return

    setDeleting(id)
    try {
      await deleteItem(id)
    } catch (err) {
      alert('Error deleting item: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="dash-section">
        <h1>Weekly Menu</h1>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
          Loading menu items...
        </div>
      </div>
    )
  }

  return (
    <div className="dash-section">
      <h1>Weekly Menu</h1>
      {error && (
        <div style={{
          padding: '0.75rem',
          background: '#FEE2E2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          color: '#B91C1C',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {TIERS.map(tier => {
          const tierItems = items.filter(i => i.tier === tier.key)
          return (
            <div key={tier.key} style={{
              background: 'var(--color-surface)',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: tier.color,
                color: 'white',
                padding: '1rem',
                borderBottom: `2px solid var(--color-border)`
              }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{tier.key}</h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>{tier.desc}</p>
              </div>

              <div style={{ padding: '1rem' }}>
                {tierItems.length === 0 ? (
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', paddingBottom: '0.5rem' }}>
                    No items yet
                  </p>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    {tierItems.map(item => (
                      <div key={item.id} style={{
                        padding: '0.75rem',
                        background: 'var(--color-bg-alt)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-word' }}>
                            {item.name}
                          </p>
                          {item.description && (
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', wordBreak: 'break-word' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-accent)',
                            cursor: deleting === item.id ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem',
                            padding: '0',
                            opacity: deleting === item.id ? 0.5 : 1,
                            flexShrink: 0
                          }}
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setAddingToTier(tier.key)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {addingToTier && (
        <AddItemModal
          tier={addingToTier}
          onAdd={addItem}
          onClose={() => setAddingToTier(null)}
        />
      )}
    </div>
  )
}

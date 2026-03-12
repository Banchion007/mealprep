/* ===================================================
   Step 1 — Dietary Preferences
=================================================== */
import React from 'react'
import { DIETARY_OPTIONS } from './data'
import './Steps.css'

export default function Step1Preferences({ preferences, onChange, onBack, onNext }) {
  const toggle = (id) => {
    onChange(
      preferences.includes(id)
        ? preferences.filter(p => p !== id)
        : [...preferences, id]
    )
  }

  return (
    <div className="step-panel">
      <div className="step-panel__header">
        <h2 className="step-panel__title">Dietary Preferences</h2>
        <p className="step-panel__sub">
          Select any dietary requirements. We'll highlight compatible meals in the next step.
          You can select multiple or none — all preferences are optional.
        </p>
      </div>

      <div className="pref-grid">
        {DIETARY_OPTIONS.map(opt => {
          const checked = preferences.includes(opt.id)
          return (
            <label
              key={opt.id}
              className={`pref-card${checked ? ' pref-card--selected' : ''}`}
              htmlFor={`pref-${opt.id}`}
            >
              <input
                id={`pref-${opt.id}`}
                type="checkbox"
                className="pref-card__input"
                checked={checked}
                onChange={() => toggle(opt.id)}
              />
              <div className="pref-card__check">
                {checked && (
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="pref-card__label">{opt.label}</p>
                <p className="pref-card__desc">{opt.desc}</p>
              </div>
            </label>
          )
        })}
      </div>

      {preferences.length > 0 && (
        <div className="step-note">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
          </svg>
          <span>
            Selected: <strong>{preferences.map(p => DIETARY_OPTIONS.find(o => o.id === p)?.label).join(', ')}</strong>.
            Meals matching your preferences will be highlighted in the next step.
          </span>
        </div>
      )}

      <div className="step-nav">
        <button className="btn btn-ghost" onClick={onBack}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Plans
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Continue to Meal Selection
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

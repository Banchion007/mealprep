/* ===================================================
   Step 3 — Delivery Details
=================================================== */
import React from 'react'
import { DELIVERY_WINDOWS } from './data'
import './Steps.css'

/* Minimum selectable date = tomorrow */
function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function Step3Schedule({ schedule, onChange, onBack, onNext }) {
  const update = (field, value) => onChange({ ...schedule, [field]: value })

  const isValid =
    schedule.date &&
    schedule.timeWindow &&
    schedule.address.trim() &&
    schedule.city.trim() &&
    schedule.state.trim() &&
    schedule.zip.trim()

  return (
    <div className="step-panel">
      <div className="step-panel__header">
        <h2 className="step-panel__title">Delivery Details</h2>
        <p className="step-panel__sub">
          Choose a delivery date, time window, and enter your address.
        </p>
      </div>

      <div className="schedule-grid">
        {/* Delivery date */}
        <div className="form-group">
          <label className="form-label">Delivery Date</label>
          <input
            className="form-input"
            type="date"
            min={minDate()}
            value={schedule.date}
            onChange={e => update('date', e.target.value)}
          />
        </div>

        {/* Time window */}
        <div className="form-group">
          <label className="form-label">Preferred Time Window</label>
          <select
            className="form-select"
            value={schedule.timeWindow}
            onChange={e => update('timeWindow', e.target.value)}
          >
            <option value="">Select a time window…</option>
            {DELIVERY_WINDOWS.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div className="schedule-address">
          <div className="form-group schedule-address__full">
            <label className="form-label">Street Address</label>
            <input
              className="form-input"
              type="text"
              placeholder="123 Main Street, Apt 4B"
              value={schedule.address}
              onChange={e => update('address', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              className="form-input"
              type="text"
              placeholder="Austin"
              value={schedule.city}
              onChange={e => update('city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input
              className="form-input"
              type="text"
              placeholder="TX"
              maxLength={2}
              value={schedule.state}
              onChange={e => update('state', e.target.value.toUpperCase())}
            />
          </div>
          <div className="form-group">
            <label className="form-label">ZIP Code</label>
            <input
              className="form-input"
              type="text"
              placeholder="78701"
              maxLength={5}
              value={schedule.zip}
              onChange={e => update('zip', e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>
      </div>

      {!isValid && (
        <div className="step-note">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
          </svg>
          <span>Please select a delivery date, a time window, and enter your full address.</span>
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
          disabled={!isValid}
          style={!isValid ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Review Order
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

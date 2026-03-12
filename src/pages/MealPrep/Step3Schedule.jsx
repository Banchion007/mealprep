/* ===================================================
   Step 3 — Delivery Schedule
=================================================== */
import React from 'react'
import { DAYS, DELIVERY_WINDOWS } from './data'
import './Steps.css'

export default function Step3Schedule({ schedule, onChange, onBack, onNext }) {
  const update = (field, value) => onChange({ ...schedule, [field]: value })

  const toggleDay = (day) => {
    const days = schedule.days.includes(day)
      ? schedule.days.filter(d => d !== day)
      : [...schedule.days, day]
    update('days', days)
  }

  const isValid =
    schedule.days.length > 0 &&
    schedule.timeWindow &&
    schedule.address.trim() &&
    schedule.city.trim() &&
    schedule.state.trim() &&
    schedule.zip.trim()

  return (
    <div className="step-panel">
      <div className="step-panel__header">
        <h2 className="step-panel__title">Delivery Schedule</h2>
        <p className="step-panel__sub">
          Choose which days you'd like your meals delivered and your preferred time window.
        </p>
      </div>

      <div className="schedule-grid">
        {/* Delivery days */}
        <div>
          <p className="form-label" style={{ marginBottom: '0.75rem' }}>Delivery Days</p>
          <div className="days-grid">
            {DAYS.map(day => (
              <button
                key={day}
                type="button"
                className={`day-btn${schedule.days.includes(day) ? ' day-btn--active' : ''}`}
                onClick={() => toggleDay(day)}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
          {schedule.days.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.6rem' }}>
              Selected: {schedule.days.join(', ')}
            </p>
          )}
        </div>

        {/* Time window */}
        <div className="form-group">
          <label className="form-label">Preferred Delivery Window</label>
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
          <span>Please select at least one delivery day, a time window, and enter your full address.</span>
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

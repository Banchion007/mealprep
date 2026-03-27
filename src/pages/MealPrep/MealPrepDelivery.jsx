/* ===================================================
   MealPrepDelivery — Address + Mon–Sat date + time window
=================================================== */
import React, { useState, useEffect } from 'react'
import { MEALS, DELIVERY_WINDOWS } from './data'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const WINDOW_ICONS = {
  morning:   (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ),
  afternoon: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  evening:   (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
}

/* Return an array of Mon–Sat dates for the next N weeks */
function getAvailableDates(weeksAhead = 4) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // Start from tomorrow
  const start = new Date(today)
  start.setDate(today.getDate() + 1)

  for (let d = new Date(start); dates.length < weeksAhead * 6; d.setDate(d.getDate() + 1)) {
    const day = d.getDay() // 0=Sun, 6=Sat
    if (day !== 0) { // exclude Sundays
      dates.push(new Date(d))
    }
  }
  return dates
}

const AVAILABLE_DATES = getAvailableDates(4)

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat']
const DAY_IDX = [1,2,3,4,5,6] // Mon=1 ... Sat=6

function formatDateKey(d) {
  return d.toISOString().split('T')[0]
}
function formatDateDisplay(d) {
  const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
  return `${weekday}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

const INIT_ADDRESS = { street: '', city: '', state: '', zip: '' }

export default function MealPrepDelivery({ delivery, selectedMeals = {}, onChange, onBack, onNext }) {
  useScrollAnimation()
  const cartCount = Object.values(selectedMeals).reduce((s, n) => s + n, 0)
  const cartTotal = Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
    const m = MEALS.find(m => m.id === id)
    return sum + (m ? m.price * qty : 0)
  }, 0)
  const { user } = useAuth()
  const [address,    setAddress]    = useState(delivery.address    || INIT_ADDRESS)
  const [dateKey,    setDateKey]    = useState(delivery.date       || '')
  const [timeWindow, setTimeWindow] = useState(delivery.timeWindow || '')
  const [saveInfo,   setSaveInfo]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [errors,     setErrors]     = useState({})

  // Group available dates by week for display
  const datesByWeek = AVAILABLE_DATES.reduce((acc, d) => {
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1))
    const key = formatDateKey(weekStart)
    if (!acc[key]) acc[key] = { label: `Week of ${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()}`, dates: [] }
    acc[key].dates.push(d)
    return acc
  }, {})
  const weeks = Object.values(datesByWeek).slice(0, 3)

  const updateAddress = (field, val) => {
    setAddress(prev => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!address.street.trim()) e.street = 'Street address is required'
    if (!address.city.trim())   e.city   = 'City is required'
    if (!address.state.trim())  e.state  = 'State is required'
    if (!address.zip.trim())    e.zip    = 'ZIP code is required'
    if (!dateKey)                e.date   = 'Please select a delivery date'
    if (!timeWindow)             e.time   = 'Please select a delivery window'
    return e
  }

  const handleContinue = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const payload = { address, date: dateKey, timeWindow }
    onChange(payload)

    if (saveInfo && user) {
      setLoading(true)
      try {
        await supabase.from('delivery_profiles').upsert({
          user_id: user.id,
          street:  address.street,
          city:    address.city,
          state:   address.state,
          zip:     address.zip,
        }, { onConflict: 'user_id' })
      } catch { /* silent */ } finally {
        setLoading(false)
      }
    }

    onNext()
  }

  return (
    <div className="mp-delivery">
      <div className="mp-delivery__header fade-up">
        <button className="mp-back-btn" onClick={onBack}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Menu
        </button>
        {cartCount > 0 && (
          <div className="mp-delivery__cart-banner">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span><strong>{cartCount}</strong> meal{cartCount !== 1 ? 's' : ''}</span>
            <span className="mp-delivery__cart-sep">·</span>
            <span className="mp-delivery__cart-total">${cartTotal.toFixed(2)}</span>
          </div>
        )}
        <h1 className="mp-delivery__title">Delivery Details</h1>
        <p className="mp-delivery__sub">Where and when should we deliver your meals?</p>
      </div>

      <div className="mp-delivery__body fade-up">
        {/* Date picker */}
        <div className="mp-delivery__section">
          <h3 className="mp-delivery__section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Choose a Delivery Date
            <span className="mp-delivery__section-note">Mon – Sat only</span>
          </h3>

          {weeks.map(week => (
            <div key={week.label} className="mp-date-week">
              <p className="mp-date-week__label">{week.label}</p>
              <div className="mp-date-grid">
                {week.dates.map(d => {
                  const key = formatDateKey(d)
                  const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
                  return (
                    <button
                      key={key}
                      className={`mp-date-btn${dateKey === key ? ' mp-date-btn--active' : ''}`}
                      onClick={() => { setDateKey(key); setErrors(e => ({ ...e, date: '' })) }}
                    >
                      <span className="mp-date-btn__day">{dayName}</span>
                      <span className="mp-date-btn__num">{d.getDate()}</span>
                      <span className="mp-date-btn__month">{MONTHS[d.getMonth()]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          {errors.date && <p className="mp-field-error">{errors.date}</p>}
        </div>

        {/* Time window */}
        <div className="mp-delivery__section">
          <h3 className="mp-delivery__section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Choose a Time Window
          </h3>
          <div className="mp-windows">
            {DELIVERY_WINDOWS.map(w => (
              <button
                key={w.id}
                className={`mp-window-card${timeWindow === w.id ? ' mp-window-card--active' : ''}`}
                onClick={() => { setTimeWindow(w.id); setErrors(e => ({ ...e, time: '' })) }}
              >
                <div className="mp-window-card__icon">{WINDOW_ICONS[w.id]}</div>
                <div>
                  <p className="mp-window-card__label">{w.label}</p>
                  <p className="mp-window-card__time">{w.time}</p>
                </div>
                {timeWindow === w.id && (
                  <svg className="mp-window-card__check" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
          {errors.time && <p className="mp-field-error">{errors.time}</p>}
        </div>

        {/* Address */}
        <div className="mp-delivery__section">
          <h3 className="mp-delivery__section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Delivery Address
          </h3>
          <div className="mp-address-grid">
            <div className="mp-field mp-field--full">
              <label className="mp-field__label" htmlFor="street">Street Address</label>
              <input
                id="street" type="text"
                className={`mp-field__input${errors.street ? ' mp-field__input--error' : ''}`}
                placeholder="1234 Main St, Apt 5B"
                value={address.street}
                onChange={e => updateAddress('street', e.target.value)}
              />
              {errors.street && <span className="mp-field-error">{errors.street}</span>}
            </div>
            <div className="mp-field">
              <label className="mp-field__label" htmlFor="city">City</label>
              <input
                id="city" type="text"
                className={`mp-field__input${errors.city ? ' mp-field__input--error' : ''}`}
                placeholder="Austin"
                value={address.city}
                onChange={e => updateAddress('city', e.target.value)}
              />
              {errors.city && <span className="mp-field-error">{errors.city}</span>}
            </div>
            <div className="mp-field">
              <label className="mp-field__label" htmlFor="state">State</label>
              <input
                id="state" type="text"
                className={`mp-field__input${errors.state ? ' mp-field__input--error' : ''}`}
                placeholder="TX"
                maxLength={2}
                value={address.state}
                onChange={e => updateAddress('state', e.target.value.toUpperCase())}
              />
              {errors.state && <span className="mp-field-error">{errors.state}</span>}
            </div>
            <div className="mp-field">
              <label className="mp-field__label" htmlFor="zip">ZIP Code</label>
              <input
                id="zip" type="text"
                className={`mp-field__input${errors.zip ? ' mp-field__input--error' : ''}`}
                placeholder="78701"
                maxLength={10}
                value={address.zip}
                onChange={e => updateAddress('zip', e.target.value)}
              />
              {errors.zip && <span className="mp-field-error">{errors.zip}</span>}
            </div>
          </div>

          {/* Save toggle */}
          {user && (
            <label className="mp-save-toggle">
              <div
                className={`mp-toggle${saveInfo ? ' mp-toggle--on' : ''}`}
                role="checkbox"
                aria-checked={saveInfo}
                tabIndex={0}
                onClick={() => setSaveInfo(v => !v)}
                onKeyDown={e => e.key === ' ' && setSaveInfo(v => !v)}
              >
                <div className="mp-toggle__thumb" />
              </div>
              <span>Save this address to my account for future orders</span>
            </label>
          )}
        </div>

        {/* Summary preview */}
        {(dateKey || timeWindow) && (
          <div className="mp-delivery__preview">
            <p className="mp-delivery__preview-label">Your delivery</p>
            <div className="mp-delivery__preview-row">
              {dateKey && (
                <span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDateDisplay(new Date(dateKey + 'T12:00:00'))}
                </span>
              )}
              {timeWindow && (
                <span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {DELIVERY_WINDOWS.find(w => w.id === timeWindow)?.time}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mp-delivery__actions">
          <button
            className="btn btn-primary btn-lg mp-delivery__continue"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? <span className="mp-spinner" /> : null}
            {loading ? 'Saving…' : 'Review & Pay'}
            {!loading && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================================================
   Contact Page — form with validation + company info
=================================================== */
import React, { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Contact.css'

const EVENT_TYPES = [
  'Corporate Event', 'Wedding', 'Birthday Party', 'Holiday Party',
  'Graduation', 'Bridal Shower', 'Private Dinner', 'Cocktail Reception',
  'Meal Prep Inquiry', 'Other',
]

const INFO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Address',
    value: '3803 Ward Neal Rd, Bells, TX 75414',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 12.91 19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Phone',
    value: '(903) 484-4470',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'humblechefbrian@gmail.com',
  }
]

const INIT = {
  name: '', email: '', phone: '', eventType: '',
  eventDate: '', guestCount: '', message: '',
}

function validate(fields) {
  const errors = {}
  if (!fields.name.trim())                        errors.name       = 'Name is required.'
  if (!fields.email.trim())                       errors.email      = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                                  errors.email      = 'Enter a valid email address.'
  if (!fields.phone.trim())                       errors.phone      = 'Phone number is required.'
  if (!fields.eventType)                          errors.eventType  = 'Please select an event type.'
  if (!fields.eventDate)                          errors.eventDate  = 'Please choose a date.'
  if (!fields.guestCount.trim())                  errors.guestCount = 'Guest count is required.'
  else if (isNaN(Number(fields.guestCount)) || Number(fields.guestCount) < 1)
                                                  errors.guestCount = 'Enter a valid number of guests.'
  if (!fields.message.trim())                     errors.message    = 'Please tell us about your event.'
  return errors
}

export default function Contact() {
  useScrollAnimation()

  const [fields,    setFields]    = useState(INIT)
  const [errors,    setErrors]    = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    // Simulate async submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="page-hero contact-hero">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x500/1E1B4B/EEF2FF?text=Contact+Us"
          alt="Contact Saveur"
          className="page-hero__bg"
        />
        <div className="container page-hero__content fade-up">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Let's Talk</p>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,251,245,0.8)', maxWidth: '480px', fontSize: '1.05rem' }}>
            Have an event in mind, or want to start a meal prep plan? Reach out — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-inner">

          {/* Left — form */}
          <div className="contact-form-col fade-up">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2>Message Received!</h2>
                <p>
                  Thank you, <strong>{fields.name}</strong>! A member of our team will be in touch within 24 hours. We can't wait to hear more about your event.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => { setFields(INIT); setSubmitted(false) }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-title">Send Us a Message</h2>
                <p className="contact-form-sub">All fields are required. We respond within 24 hours.</p>
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input
                        id="name" name="name" type="text"
                        className={`form-input${errors.name ? ' error' : ''}`}
                        placeholder="Jane Smith"
                        value={fields.name}
                        onChange={handleChange}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email" name="email" type="email"
                        className={`form-input${errors.email ? ' error' : ''}`}
                        placeholder="jane@example.com"
                        value={fields.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input
                        id="phone" name="phone" type="tel"
                        className={`form-input${errors.phone ? ' error' : ''}`}
                        placeholder="(512) 555-0100"
                        value={fields.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="eventType">Event Type</label>
                      <select
                        id="eventType" name="eventType"
                        className={`form-select${errors.eventType ? ' error' : ''}`}
                        value={fields.eventType}
                        onChange={handleChange}
                      >
                        <option value="">Select event type…</option>
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.eventType && <span className="form-error">{errors.eventType}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="eventDate">Event Date</label>
                      <input
                        id="eventDate" name="eventDate" type="date"
                        className={`form-input${errors.eventDate ? ' error' : ''}`}
                        value={fields.eventDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.eventDate && <span className="form-error">{errors.eventDate}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="guestCount">Guest Count</label>
                      <input
                        id="guestCount" name="guestCount" type="number"
                        className={`form-input${errors.guestCount ? ' error' : ''}`}
                        placeholder="e.g. 150"
                        min="1"
                        value={fields.guestCount}
                        onChange={handleChange}
                      />
                      {errors.guestCount && <span className="form-error">{errors.guestCount}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Tell Us About Your Event</label>
                    <textarea
                      id="message" name="message"
                      className={`form-textarea${errors.message ? ' error' : ''}`}
                      placeholder="Describe your vision, dietary requirements, venue details, preferred cuisine style, and anything else we should know…"
                      rows={5}
                      value={fields.message}
                      onChange={handleChange}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg contact-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right — info + map */}
          <div className="contact-info-col fade-up">
            <div className="contact-info-card">
              <h3 className="contact-info-title">Get in Touch</h3>
              <div className="contact-info-items">
                {INFO_ITEMS.map(item => (
                  <div key={item.label} className="contact-info-item">
                    <div className="contact-info-item__icon">{item.icon}</div>
                    <div>
                      <p className="contact-info-item__label">{item.label}</p>
                      <p className="contact-info-item__value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps placeholder */}
            <div className="map-placeholder">
              <img
                src="https://placehold.co/600x300/EEF2FF/1E1B4B?text=Google+Maps+Placeholder"
                alt="Map of Saveur Catering location"
                className="map-img"
              />
              <div className="map-overlay">
                <div className="map-pin">
                  <svg width="16" height="16" fill="var(--color-primary)" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3" fill="#fff"/>
                  </svg>
                </div>
                <span>3803 Ward Neal Rd, Bells, TX 75414</span>
              </div>
            </div>

            {/* FAQ chips */}
            <div className="contact-faq">
              <p className="contact-faq__label">Common Questions</p>
              {[
                'What is your minimum guest count?',
                'Do you offer tastings?',
                'Can you accommodate allergies?',
                'How far in advance should I book?',
              ].map(q => (
                <div key={q} className="contact-faq__item">
                  <svg width="14" height="14" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>{q}</span>
                </div>
              ))}
              <p className="contact-faq__note">Ask us anything in your message — we'll answer every question.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

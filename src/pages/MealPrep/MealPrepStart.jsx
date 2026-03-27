/* ===================================================
   MealPrepStart — Landing screen for the order flow
=================================================== */
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useMenu } from '../../contexts/MenuContext'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse the Menu',
    desc: 'Choose from Essentials, Classics, and Deluxe meals crafted fresh each week.',
  },
  {
    step: '02',
    title: 'Set Your Delivery',
    desc: 'Pick your address, a Mon–Sat date, and one of three convenient time windows.',
  },
  {
    step: '03',
    title: 'Enjoy Every Bite',
    desc: 'We cook, pack, and deliver. All you do is heat and eat.',
  },
]

const HIGHLIGHTS_TAIL = [
  { value: '6-day', label: 'Delivery Mon–Sat' },
]

export default function MealPrepStart({ onStart }) {
  useScrollAnimation()
  const { user, setShowAuthModal } = useAuth()
  const { meals, loading: menuLoading } = useMenu()
  const mealCountLabel = menuLoading ? '…' : String(meals.length)

  const handleStartClick = () => {
    if (user) {
      onStart()
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="mp-start">
      {/* Hero section */}
      <div className="mp-start__hero">
        <div className="mp-start__hero-overlay" />
        <img
          src="https://placehold.co/1600x900/1E1B4B/EEF2FF?text=Chef-Crafted+Meals"
          alt="Chef crafted meals"
          className="mp-start__hero-bg"
        />
        <div className="mp-start__hero-content">
          <p className="mp-start__hero-label fade-up">Weekly Meal Prep · Austin, TX</p>
          <h1 className="mp-start__hero-headline fade-up">
            Your Week,<br />
            <em>Fuelled by Chefs.</em>
          </h1>
          <p className="mp-start__hero-sub fade-up">
            Chef-crafted, macro-balanced meals — picked by you, delivered to your door.
            Fresh every time. Never frozen.
          </p>

          <div className="mp-start__hero-actions fade-up">
            <button className="btn btn-lg mp-start__cta" onClick={handleStartClick}>
              {user ? 'Start Your Order' : 'Sign In to Order'}
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            {!user && (
              <p className="mp-start__hero-signin-note">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Sign in to save your order history and delivery details
              </p>
            )}
          </div>

          {/* Highlight stats */}
          <div className="mp-start__highlights fade-up">
            <div className="mp-start__highlight">
              <span className="mp-start__highlight-value">{mealCountLabel}</span>
              <span className="mp-start__highlight-label mp-start__highlight-label--title">Chef-Crafted Meals this Week</span>
            </div>
            {HIGHLIGHTS_TAIL.map(h => (
              <div key={h.label} className="mp-start__highlight">
                <span className="mp-start__highlight-value">{h.value}</span>
                <span className="mp-start__highlight-label">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mp-start__how">
        <div className="mp-start__how-inner">
          <div className="mp-start__how-header fade-up">
            <p className="section-label">Simple Process</p>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="mp-start__steps">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} className="mp-start__step fade-up">
                <div className="mp-start__step-num">{s.step}</div>
                <h3 className="mp-start__step-title">{s.title}</h3>
                <p className="mp-start__step-desc">{s.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="mp-start__step-arrow">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mp-start__how-cta fade-up">
            <button className="btn btn-primary btn-lg" onClick={handleStartClick}>
              {user ? 'Browse the Menu' : 'Get Started — Sign In'}
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

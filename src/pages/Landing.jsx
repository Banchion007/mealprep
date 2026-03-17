/* ===================================================
   Landing Page — Hero, Intro, Features, Testimonials
=================================================== */
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Landing.css'

/* ---- Data ---- */
const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14a8 8 0 0 1-6.93-4c.03-2.29 4.62-3.55 6.93-3.55s6.9 1.26 6.93 3.55A8 8 0 0 1 12 20z"/>
      </svg>
    ),
    title: 'Expert Chefs',
    desc: 'Our team of culinary professionals crafts every meal with passion and precision.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Fresh Ingredients',
    desc: 'Sourced daily from local farms and trusted suppliers — never frozen, always vibrant.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Custom Menus',
    desc: 'Tailored to your event, dietary needs, and personal taste — no two menus alike.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'On-Time Delivery',
    desc: 'Punctual and professional. Your food arrives hot, fresh, and exactly on schedule.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Made with Love',
    desc: 'Every dish reflects our commitment to quality, care, and an unforgettable experience.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Macro-Tracked',
    desc: 'Meal prep plans include full nutritional info so you hit your health goals effortlessly.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Event Planner',
    avatar: 'https://placehold.co/80x80/1E1B4B/EEF2FF?text=SM',
    stars: 5,
    text: "Saveur transformed our corporate gala into a culinary experience our guests still talk about. The food was exceptional, the presentation was stunning, and the team was an absolute pleasure to work with.",
  },
  {
    name: 'Marcus Torres',
    role: 'Weekly Meal Prep Customer',
    avatar: 'https://placehold.co/80x80/312E81/EEF2FF?text=MT',
    stars: 5,
    text: "I've tried every meal prep service out there. Saveur is in a different league. The flavors are restaurant-quality and the macros are always spot-on. My keto journey has never been this delicious.",
  },
  {
    name: 'Priya Kapoor',
    role: 'Wedding Client',
    avatar: 'https://placehold.co/80x80/EA580C/FFF?text=PK',
    stars: 5,
    text: "They catered our 200-person wedding flawlessly. From the appetizers to the dessert table, everything was perfect. They accommodated every dietary restriction without compromising taste.",
  },
]

const STATS = [
  { value: '500+', label: 'Events Catered' },
  { value: '12K+', label: 'Meals Prepped' },
  { value: '8+', label: 'Years of Excellence' },
]

function StarRating({ count = 5 }) {
  return (
    <div className="stars">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{fill:'var(--secondary)'}}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function Landing() {
  useScrollAnimation()

  const handleOpenMenu = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const trigger = document.querySelector('.menu-dropdown__trigger')
    if (trigger) trigger.click()
  }

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__overlay" />
        <img
          src="https://placehold.co/1600x900/1E1B4B/EEF2FF?text=Premium+Catering+%26+Meal+Prep"
          alt="Beautifully arranged catering spread"
          className="hero__bg"
        />
        <div className="container hero__content">
          <h1 className="hero__headline display-heading fade-up">
            Exceptional Food,<br />
            <em>Crafted for You</em>
          </h1>
          <p className="hero__sub fade-up">
            From intimate gatherings to grand galas, and weekly meal prep that fuels your lifestyle — Saveur delivers restaurant-quality food right to your door.
          </p>
          <div className="hero__cta fade-up">
            <Link to="/meal-prep" className="btn btn-primary btn-lg">
              Start Meal Prep
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#menu" onClick={handleOpenMenu} className="btn btn-outline btn-lg hero__btn-outline">
              View Our Menu
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <span>Scroll to explore</span>
          <div className="hero__scroll-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro / About snippet ── */}
      <section className="section intro">
        <div className="container intro__inner">
          <div className="intro__image fade-up">
            <img
              src="https://placehold.co/600x500/EEF2FF/1E1B4B?text=Our+Story"
              alt="Chef preparing food"
              className="intro__img"
            />
          </div>

          <div className="intro__text">
            <p className="section-label fade-up">Our Story</p>
            <h2 className="section-title fade-up">Food is More Than a Meal — It's a Memory</h2>
            <div className="divider fade-up" />
            <p className="fade-up" style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Founded in 2016, Saveur Catering began as a weekend passion project in a small Austin kitchen. Chef Elena Russo had one belief: that people deserve food that's as nourishing as it is delicious.
            </p>
            <p className="fade-up" style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
              Today, we serve hundreds of events and thousands of meal prep subscribers each month — holding true to that same vision. Every ingredient is thoughtfully sourced, every recipe carefully developed, and every order delivered with care.
            </p>
            <div className="intro__pills fade-up">
              {['Locally Sourced', 'Chef-Crafted', 'Nutrition-Focused', 'Allergen-Aware'].map(p => (
                <span key={p} className="intro__pill">{p}</span>
              ))}
            </div>
            <Link to="/about" className="btn btn-outline fade-up" style={{ marginTop: '1.75rem' }}>
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features">
        <div className="container">
          <div className="features__header fade-up">
            <p className="section-label">Why Choose Saveur</p>
            <h2 className="section-title">The Saveur Difference</h2>
            <p className="section-sub">We don't just feed people — we create experiences worth remembering.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card fade-up">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meal Prep CTA Banner ── */}
      <section className="meal-cta fade-up">
        <div className="container meal-cta__inner">
          <div className="meal-cta__text">
            <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Weekly Meal Prep</p>
            <h2 style={{ color: '#fff', marginBottom: '0.75rem' }}>Eat Well, Every Day.</h2>
            <p style={{ color: 'rgba(255,251,245,0.8)', maxWidth: '480px' }}>
              Choose your plan, customize your meals, set your delivery schedule. We handle the rest. Fresh, macro-balanced meals delivered to your door every week.
            </p>
          </div>
          <div className="meal-cta__actions">
            <Link to="/meal-prep" className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}>
              Build My Meal Plan
            </Link>
            <a href="#menu" onClick={handleOpenMenu} className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
              See Full Menu
            </a>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section testimonials">
        <div className="container">
          <div className="testimonials__header fade-up">
            <p className="section-label">Testimonials</p>
            <h2 className="section-title">Loved by Our Clients</h2>
            <p className="section-sub">Don't take our word for it — hear from the people who matter most.</p>
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card fade-up">
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <img src={t.avatar} alt={t.name} className="testimonial-card__avatar" />
                  <div>
                    <StarRating count={t.stars} />
                    <p className="testimonial-card__name">{t.name}</p>
                    <p className="testimonial-card__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="section contact-cta">
        <div className="container contact-cta__inner fade-up">
          <div>
            <h2 className="section-title">Ready to Plan Your Event?</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Reach out and let's create something extraordinary together.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

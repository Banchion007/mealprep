/* ===================================================
   Landing Page — Hero, Intro, Features, Testimonials
=================================================== */
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import TiltedCard from '../components/TiltedCard'
import { pageMetadata, getCanonicalUrl, SITE_NAME, DEFAULT_OG_IMAGE, getSchemaOrgData } from '../lib/seo'
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
    desc: 'Sourced daily from local farms and trusted suppliers. Never frozen, always vibrant.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Custom Menus',
    desc: 'Tailored to your event, dietary needs, and personal taste. No two menus are alike.',
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
    desc: 'Passion and care in every plate. Quality you can taste and remember.',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Nutrition-Focused',
    desc: 'Balanced meals with quality ingredients, and food you can feel good about.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Tia S',
    role: 'Kings Trail Cowboy Church',
    stars: 5,
    text: 'We used Humble Chef for our Annual Christmas Leadership Party. I have been planning parties for 9 years at various locations and this caterer was the best. The food was perfect and well executed. It is hard to get food out for 70 people and it be 100% spot on! You can not go wrong using Humble Chef!',
  },
  {
    name: 'Tanya E',
    role: 'Baby showers & wedding celebrations',
    stars: 5,
    text: 'Humble Chef has catered several personal events, including baby showers and weddings celebrations, and the experience has consistently exceeded expectations. The quality of food has been excellent, and the service provided has been reliable and professional. I highly recommend Humble Chef when planning your next event.',
  },
  {
    name: 'Trudy Bangs',
    role: 'Christian Ambassadors',
    stars: 5,
    text: 'Chef Brian is a man of excellence and everything he does reveals that. At our last retreat, he prepared lunches and dinner which were not only delicious but the presentation was inviting, beautifully presented. It was a joy to work with him.',
  },
  {
    name: 'Michelle Graefen',
    role: 'Hope is Rising',
    stars: 5,
    text: "We highly recommend Humble Chef! Chef Brian is a talented and gifted chef with a true heart for both great food and ministry. He is a blessing to everyone who has the opportunity to enjoy his cooking or work alongside him. His support truly makes our ministry work so much easier, and we're incredibly grateful for all he brings to the table. We are already looking forward to working with him again at our Fall Advance!",
  },
  {
    name: 'The Millers',
    role: 'Newly Weds',
    stars: 5,
    text: 'Humble Chef was an amazing caterer! We had them do our wedding and they provided us with beautiful service and delicious food! Brian and his team were very easy to communicate with and open to helping us create the menu of our dreams! We could not suggest them more!',
  },
]

const STATS = [
  { value: '100+', label: 'Events Catered' },
  { value: '100k+', label: 'Meals Served' },
  { value: '40+', label: 'Years of Excellence' },
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

function TestimonialCard({ t }) {
  const [expanded, setExpanded] = useState(false)
  const textRef = useRef(null)
  const [showToggle, setShowToggle] = useState(false)
  const [hClosed, setHClosed] = useState(72)
  const [hOpen, setHOpen] = useState(400)

  const measureHeights = useCallback(() => {
    const el = textRef.current
    if (!el) return
    const lh = parseFloat(getComputedStyle(el).lineHeight)
    const closed = Number.isFinite(lh) && lh > 0 ? Math.ceil(lh * 3) : 72
    setHClosed(closed)
    const full = el.scrollHeight
    setHOpen(full)
    setShowToggle(full > closed + 6)
  }, [t.text])

  useLayoutEffect(() => {
    measureHeights()
  }, [measureHeights])

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const ro = new ResizeObserver(() => measureHeights())
    ro.observe(el)
    return () => ro.disconnect()
  }, [measureHeights])

  return (
    <div className="testimonial-card">
      <div className="testimonial-card__quote">"</div>
      <div
        className={`testimonial-card__text-shell${expanded ? ' testimonial-card__text-shell--open' : ''}`}
        style={{ maxHeight: expanded ? `${hOpen}px` : `${hClosed}px` }}
      >
        <p ref={textRef} className="testimonial-card__text">
          {t.text}
        </p>
      </div>
      {showToggle && (
        <button
          type="button"
          className="testimonial-card__toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
      <div className="testimonial-card__author">
        <div>
          <StarRating count={t.stars} />
          <p className="testimonial-card__name">{t.name}</p>
          <p className="testimonial-card__role">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  useScrollAnimation()
  const testimonialsScrollRef = useRef(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const scrollIndicatorRef = useRef(null)

  const updateScrollButtons = useCallback(() => {
    const el = testimonialsScrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollPrev(scrollLeft > 4)
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = testimonialsScrollRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    const ro = new ResizeObserver(updateScrollButtons)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      ro.disconnect()
    }
  }, [updateScrollButtons])

  const scrollTestimonials = (dir) => {
    const el = testimonialsScrollRef.current
    if (!el) return
    const item = el.querySelector('.testimonials__item')
    const gap = parseFloat(getComputedStyle(el).gap) || 24
    const step = (item?.offsetWidth ?? 320) + gap
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const handleOpenMenu = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const trigger = document.querySelector('.menu-dropdown__trigger')
    if (trigger) trigger.click()
  }

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const remaining = doc.scrollHeight - window.scrollY - window.innerHeight
      setShowScrollIndicator(remaining > 48)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const meta = pageMetadata.home

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={getCanonicalUrl(meta.path)} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(getSchemaOrgData())}
        </script>
      </Helmet>
      <div className="landing">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__overlay" />
        <img
          src="/heroes/landing.svg"
          onError={e => { e.currentTarget.style.display = 'none' }}
          alt="Beautifully arranged catering spread"
          className="hero__bg"
        />
        <div className="container hero__content">
          <h1 className="hero__headline display-heading fade-up">
            Exceptional Food,<br />
            <em>Crafted for You</em>
          </h1>
          <p className="hero__sub fade-up">
            With every event, every plate, and every conversation, our goal is the same: to serve you with{' '}
            <strong>a love for food and a heart for people.</strong>
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

      </section>

      {/* Scroll indicator — fixed to viewport until page bottom */}
      <div
        ref={scrollIndicatorRef}
        className={`hero__scroll${showScrollIndicator ? '' : ' hero__scroll--hidden'}`}
        aria-hidden={!showScrollIndicator}
      >
        <span>Scroll to explore</span>
        <div className="hero__scroll-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

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
            <figure className="intro__figure">
              <img
                src="/our-story.png"
                alt="Brian and Gabriel Gardner, Executive Chef and Sous Chef"
                className="intro__img"
              />
              <figcaption className="intro__caption">Our Story</figcaption>
            </figure>
          </div>

          <div className="intro__text">
            <p className="section-label fade-up">Our Story</p>
            <h2 className="section-title fade-up">
              Food is More Than a Meal
              <br />
              - It&apos;s a Ministry
            </h2>
            <div className="divider fade-up" />
            <Link to="/about" className="btn btn-primary btn-lg fade-up intro__about-btn">
              Learn more about Humble Chef
            </Link>
            <div className="intro__pills fade-up">
              {['Locally Sourced', 'Chef-Crafted', 'Nutrition-Focused', 'Allergen-Aware', 'Gluten-Free Options', 'Client Focused', 'Prompt Service'].map(p => (
                <span key={p} className="intro__pill">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features">
        <div className="container">
          <div className="features__header fade-up">
            <p className="section-label">Why Choose Humble Chef</p>
            <h2 className="section-title">The Humble Chef Difference</h2>
            <p className="section-sub">We don't just feed people, we create experiences worth remembering.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map(f => (
              <TiltedCard key={f.title} className="fade-up">
                <div className="feature-card">
                  <div className="feature-card__icon">{f.icon}</div>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </TiltedCard>
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
            <p className="section-sub">Don't take our word for it, hear from the people who matter most.</p>
          </div>
          <div className="testimonials__carousel">
            <div className="testimonials__nav">
              <button
                type="button"
                className="testimonials__arrow"
                onClick={() => scrollTestimonials(-1)}
                disabled={!canScrollPrev}
                aria-label="Previous testimonials"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
            <div
              className="testimonials__scroll"
              ref={testimonialsScrollRef}
            >
              {TESTIMONIALS.map(t => (
                <div className="testimonials__item" key={t.name}>
                  <TiltedCard className="fade-up">
                    <TestimonialCard t={t} />
                  </TiltedCard>
                </div>
              ))}
            </div>
            <div className="testimonials__nav">
              <button
                type="button"
                className="testimonials__arrow"
                onClick={() => scrollTestimonials(1)}
                disabled={!canScrollNext}
                aria-label="Next testimonials"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
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
    </>
  )
}

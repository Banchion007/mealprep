/* ===================================================
   About Page — story, team, mission, gallery
=================================================== */
import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './About.css'

const TEAM = [
  {
    name: 'Elena Russo',
    role: 'Founder & Executive Chef',
    bio: 'Trained at Le Cordon Bleu Paris, Elena brings 18 years of fine dining and events expertise. Her passion for local produce drives every menu.',
    img: 'https://placehold.co/320x380/1E1B4B/EEF2FF?text=Elena+R.',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Meal Prep & Nutrition',
    bio: 'A certified nutritionist and chef, Marcus designs our macro-balanced meal prep programs. His mantra: healthy food should never feel like a sacrifice.',
    img: 'https://placehold.co/320x380/312E81/EEF2FF?text=Marcus+W.',
  },
  {
    name: 'Sofia Delgado',
    role: 'Pastry Chef',
    bio: "Sofia's desserts are the grand finale of every Saveur event. With a background in Michelin-starred kitchens, her creations are equal parts art and indulgence.",
    img: 'https://placehold.co/320x380/EA580C/FFF?text=Sofia+D.',
  },
  {
    name: 'James Liu',
    role: 'Operations & Logistics Manager',
    bio: 'James ensures every order arrives on time and in perfect condition. His obsessive attention to detail keeps Saveur running like clockwork.',
    img: 'https://placehold.co/320x380/1E1B4B/EEF2FF?text=James+L.',
  },
]

const MILESTONES = [
  { year: '2016', event: 'Founded in a small Austin kitchen by Chef Elena Russo.' },
  { year: '2017', event: 'First corporate catering contract — 500-person tech conference.' },
  { year: '2018', event: 'Launched weekly meal prep subscription service.' },
  { year: '2020', event: 'Expanded kitchen facility; hired full culinary team of 12.' },
  { year: '2022', event: 'Named Austin\'s #1 Caterer by Austin Eater Magazine.' },
  { year: '2024', event: 'Reached 5,000 active weekly meal prep subscribers.' },
]

const GALLERY_IMGS = [
  { src: 'https://placehold.co/600x400/EEF2FF/1E1B4B?text=Catering+Event',  alt: 'Catering event setup', wide: true },
  { src: 'https://placehold.co/400x400/EA580C/FFF?text=Chef+at+Work',       alt: 'Chef at work' },
  { src: 'https://placehold.co/400x400/312E81/EEF2FF?text=Fresh+Ingredients',  alt: 'Fresh ingredients' },
  { src: 'https://placehold.co/600x400/1E1B4B/EEF2FF?text=Meal+Prep+Line',  alt: 'Meal prep production', wide: true },
  { src: 'https://placehold.co/400x400/312E81/EEF2FF?text=Plated+Dish',        alt: 'Plated dish' },
  { src: 'https://placehold.co/400x400/EEF2FF/EA580C?text=Desserts',        alt: 'Dessert spread' },
]

const VALUES = [
  { icon: '🌱', title: 'Sustainability',   desc: 'We partner with local farms to minimize waste and support the community.' },
  { icon: '🎨', title: 'Creativity',       desc: 'Every menu is a canvas. We innovate constantly and never repeat ourselves.' },
  { icon: '♥',  title: 'Integrity',        desc: 'No shortcuts. Real ingredients, honest pricing, genuine care.' },
  { icon: '🤝', title: 'Inclusivity',      desc: 'We celebrate all diets and cultures, creating menus that welcome everyone.' },
]

export default function About() {
  useScrollAnimation()

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero about-hero">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x500/1E1B4B/EEF2FF?text=Our+Story"
          alt="About Saveur"
          className="page-hero__bg"
        />
        <div className="container page-hero__content fade-up">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>About Saveur</p>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>Who We Are</h1>
          <p style={{ color: 'rgba(255,251,245,0.8)', maxWidth: '520px', fontSize: '1.05rem' }}>
            A team of passionate chefs, nutritionists, and food lovers dedicated to making every meal exceptional.
          </p>
        </div>
      </section>

      {/* Story + Mission */}
      <section className="section story-section">
        <div className="container story-inner">
          <div className="story-text fade-up">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">From Passion Project to Austin Institution</h2>
            <div className="divider" />
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              It started with a simple conviction: people deserve food that's both extraordinary and nourishing. In 2016, Chef Elena Russo left a Michelin-starred restaurant to start Saveur in her home kitchen. With a portable cooler and a borrowed van, she catered her first event for 40 guests.
            </p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Word spread quickly. By 2018, demand outpaced capacity, and Saveur moved into a proper commercial kitchen. Today, our team of 30 serves hundreds of events and thousands of weekly meal prep subscribers across Austin and the surrounding region.
            </p>
            <blockquote className="story-quote">
              "I cook to make people feel seen. A great meal says: you matter, this moment matters."
              <cite>— Chef Elena Russo</cite>
            </blockquote>
          </div>

          {/* Timeline */}
          <div className="timeline fade-up">
            <h3 className="timeline__title">Our Journey</h3>
            {MILESTONES.map(m => (
              <div key={m.year} className="timeline__item">
                <div className="timeline__year">{m.year}</div>
                <div className="timeline__dot" />
                <div className="timeline__event">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section values-section">
        <div className="container">
          <div className="values-header fade-up">
            <p className="section-label">Our Mission</p>
            <h2 className="section-title">We Believe Food Can Change Everything</h2>
            <p className="section-sub" style={{ marginBottom: '3rem', maxWidth: '600px' }}>
              Our mission is to make outstanding food accessible — whether it's a once-in-a-lifetime gala or a Tuesday night dinner. We stand for quality, sustainability, and inclusion in every bite.
            </p>
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card fade-up">
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section team-section">
        <div className="container">
          <div className="team-header fade-up">
            <p className="section-label">The People Behind the Food</p>
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-sub">
              Every dish begins with the dedicated individuals who put their heart into it.
            </p>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card fade-up">
                <div className="team-card__img-wrap">
                  <img src={m.img} alt={m.name} className="team-card__img" />
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{m.name}</h3>
                  <p className="team-card__role">{m.role}</p>
                  <p className="team-card__bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section gallery-section">
        <div className="container">
          <div className="gallery-header fade-up">
            <p className="section-label">In Our Kitchen</p>
            <h2 className="section-title">A Glimpse Behind the Scenes</h2>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMGS.map((img, i) => (
              <div key={i} className={`gallery-item fade-up${img.wide ? ' gallery-item--wide' : ''}`}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section about-cta fade-up">
        <div className="container about-cta__inner">
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Let's Create Something Together</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '480px' }}>
            Whether it's your next big event or your weekly meal plan, our team is ready to serve.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
            <Link to="/meal-prep" className="btn btn-outline btn-lg">Start Meal Prep</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ===================================================
   About Page — story, team, mission, gallery
=================================================== */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useAuth } from '../contexts/AuthContext'
import TiltedCard from '../components/TiltedCard'
import GalleryModal from '../components/GalleryModal'
import GalleryViewer from '../components/GalleryViewer'
import './About.css'

/** Set to true when team bios and photos are ready. */
const SHOW_TEAM_SECTION = false
/** Set to true when gallery images are uploaded. */
const SHOW_GALLERY_SECTION = false

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
    bio: "Sofia's desserts are the grand finale of every Humble Chef event. With a background in Michelin-starred kitchens, her creations are equal parts art and indulgence.",
    img: 'https://placehold.co/320x380/EA580C/FFF?text=Sofia+D.',
  },
  {
    name: 'James Liu',
    role: 'Operations & Logistics Manager',
    bio: 'James ensures every order arrives on time and in perfect condition. His obsessive attention to detail keeps Humble Chef running like clockwork.',
    img: 'https://placehold.co/320x380/1E1B4B/EEF2FF?text=James+L.',
  },
]

const MILESTONES = [
  { year: '9yo', event: "I started baking in my mom's kitchen when I was just 9 years old" },
  { year: '15yo', event: 'I got my first job in a pizza parlor' },
  { year: '18-23', event: 'I worked every part of a busy family dining restaurant — from busboy to prep cook, line cook, waiter, and crew leader' },
  { year: '25', event: 'I moved into management, where I had the opportunity to serve with The Old Spaghetti Factory, The Sacramento Hilton Hotel, Aramark, Sodexo, and at places like USAA, E-Trade, Johnson & Johnson, Hewlett Packard, and several senior retirement facilities around Sacramento, California' },
  { year: '32', event: 'I also provided catering support for our church and local soccer club' },
  { year: '42', event: 'After moving to Texas in 2011, I started Humble Chef to bring that same heart for hospitality, hard work, and dependable service to every meal and event we serve.' },
]

const GALLERY_CARDS = [
  { id: 'catering-events', title: 'Catering Events', wide: true },
  { id: 'chefs-at-work', title: 'Chefs at Work' },
  { id: 'fresh-ingredients', title: 'Fresh Ingredients' },
  { id: 'meal-prep-line', title: 'Meal Prep Line', wide: true },
  { id: 'plated-dishes', title: 'Plated Dishes', wide: true },
  { id: 'desserts', title: 'Desserts' },
]

const GALLERY_PLACEHOLDERS = {
  'catering-events': 'https://placehold.co/600x400/EEF2FF/1E1B4B?text=Catering+Events',
  'chefs-at-work': 'https://placehold.co/400x400/EA580C/FFF?text=Chefs+at+Work',
  'fresh-ingredients': 'https://placehold.co/400x400/312E81/EEF2FF?text=Fresh+Ingredients',
  'meal-prep-line': 'https://placehold.co/600x400/1E1B4B/EEF2FF?text=Meal+Prep+Line',
  'plated-dishes': 'https://placehold.co/400x400/312E81/EEF2FF?text=Plated+Dishes',
  'desserts': 'https://placehold.co/400x400/EEF2FF/EA580C?text=Desserts',
}

const VALUES_MISSION_IMAGE = '/image.png'

export default function About() {
  useScrollAnimation()
  const { isAdmin } = useAuth()
  const [openGallery, setOpenGallery] = useState(null)

  const currentGallery = GALLERY_CARDS.find(g => g.id === openGallery)

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero about-hero">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x500/1E1B4B/EEF2FF?text=Our+Story"
          alt="About Humble Chef"
          className="page-hero__bg"
        />
        <div className="container page-hero__content fade-up">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>About Humble Chef</p>
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
            <h2 className="section-title">Food is More Than a Meal</h2>
            <p className="story-kicker">It&apos;s a Ministry</p>
            <div className="divider" />
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              We do what we do because food is one of the most tangible ways to love and serve people. Humble Chef Catering is owned and operated by bi-vocational ministers who, like Paul, Priscilla and Aquila, and others in Scripture, chose to work with their hands and model non-dependent leadership rather than rely on a ministry salary. Our labor of love for food and people not only helps support our own families, it also fuels a broader Kingdom-focused, community-oriented mission. Every event, every meal, and every interaction is an opportunity to care for our neighbors, create space for connection, and quietly reflect the generosity and hospitality of Christ.
            </p>
          </div>

          {/* Timeline */}
          <div className="timeline fade-up">
            <h3 className="timeline__title">Our Journey</h3>
            {MILESTONES.map((m, i) => (
              <div key={i} className="timeline__item">
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
            <h2 className="section-title">The Why</h2>
            <div className="values-header__row">
              <div className="values-header__body">
                <p className="section-sub values-header__sub">
                  I started baking in my mom&apos;s kitchen when I was just 9 years old, and that early love for food never left me. At 15, I got my first job in a pizza parlor, and from ages 18 to 23 I worked every part of a busy family dining restaurant — from busboy to prep cook, line cook, waiter, and crew leader. By 25, I moved into management, where I had the opportunity to serve with The Old Spaghetti Factory, The Sacramento Hilton Hotel, Aramark, Sodexo, and at places like USAA, E-Trade, Johnson & Johnson, Hewlett Packard, and several senior retirement facilities around Sacramento, California. From 2001 to 2011, I also provided catering support for our church and local soccer club. After moving to Texas in 2011, I started Humble Chef to bring that same heart for hospitality, hard work, and dependable service to every meal and event we serve.
                </p>
              </div>
              <figure className="values-header__figure">
                <img
                  src={VALUES_MISSION_IMAGE}
                  alt="Brian and Gabriel Gardner, Executive Chef and Sous Chef"
                  className="values-header__image"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Team — set SHOW_TEAM_SECTION to true to restore */}
      {SHOW_TEAM_SECTION && <section className="section team-section">
        <div className="container">
          <div className="team-header fade-up">
            <p className="section-label">The People Behind the Food</p>
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-sub team-header__sub">
              Every dish begins with the dedicated individuals who put their heart into it.
            </p>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <TiltedCard key={m.name} className="fade-up">
                <div className="team-card">
                  <div className="team-card__img-wrap">
                    <img src={m.img} alt={m.name} className="team-card__img" />
                  </div>
                  <div className="team-card__body">
                    <h3 className="team-card__name">{m.name}</h3>
                    <p className="team-card__role">{m.role}</p>
                    <p className="team-card__bio">{m.bio}</p>
                  </div>
                </div>
              </TiltedCard>
            ))}
          </div>
        </div>
      </section>}

      {/* Gallery — set SHOW_GALLERY_SECTION to true to restore */}
      {SHOW_GALLERY_SECTION && <section className="section gallery-section">
        <div className="container">
          <div className="gallery-header fade-up">
            <p className="section-label">In Our Kitchen</p>
            <h2 className="section-title">A Glimpse Behind the Scenes</h2>
          </div>
          <div className="gallery-grid">
            {GALLERY_CARDS.map((card) => (
              <button
                key={card.id}
                className={`gallery-item gallery-item--clickable fade-up${card.wide ? ' gallery-item--wide' : ''}`}
                onClick={() => setOpenGallery(card.id)}
                aria-label={`Open ${card.title} gallery`}
              >
                <img src={GALLERY_PLACEHOLDERS[card.id]} alt={card.title} />
                <div className="gallery-item__overlay">
                  <span className="gallery-item__label">{card.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>}

      {SHOW_GALLERY_SECTION && (isAdmin ? (
        <GalleryModal
          isOpen={openGallery !== null}
          onClose={() => setOpenGallery(null)}
          galleryId={openGallery}
          galleryTitle={currentGallery?.title}
        />
      ) : (
        <GalleryViewer
          isOpen={openGallery !== null}
          onClose={() => setOpenGallery(null)}
          galleryId={openGallery}
          galleryTitle={currentGallery?.title}
        />
      ))}

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

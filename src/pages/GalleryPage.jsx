import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { fetchGalleryGroups, getGalleryImageUrl } from '../utils/galleryUtils'
import { PageHead } from '../components/PageHead'
import { SkeletonCard } from '../components/Skeleton'
import './GalleryPage.css'

function Lightbox({ isOpen, images, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen || !images[currentIndex]) return null

  const currentImage = images[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        className="gallery-lightbox-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="gallery-lightbox-container" onClick={(e) => e.stopPropagation()}>
          <button className="gallery-lightbox-close" onClick={onClose} aria-label="Close lightbox">
            ✕
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt="Gallery view"
              className="gallery-lightbox-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button className="gallery-lightbox-nav gallery-lightbox-nav--prev" onClick={onPrev} aria-label="Previous photo">
                ‹
              </button>
              <button className="gallery-lightbox-nav gallery-lightbox-nav--next" onClick={onNext} aria-label="Next photo">
                ›
              </button>
              <div className="gallery-lightbox-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function QuarterSection({ group, supabase, onPhotoClick }) {
  const [imageUrls, setImageUrls] = useState({})
  const [loaded, setLoaded] = useState({})

  useEffect(() => {
    const urls = {}
    group.files.forEach(file => {
      urls[file.name] = getGalleryImageUrl(supabase, group.year, group.quarter, file.name)
    })
    setImageUrls(urls)
  }, [group, supabase])

  const handleImageLoad = (filename) => {
    setLoaded(prev => ({ ...prev, [filename]: true }))
  }

  return (
    <section className="gallery-section" id={`section-${group.quarter}-${group.year}`}>
      <div className="gallery-section__header">
        <h2 className="gallery-section__title">{group.label}</h2>
        <div className="gallery-section__divider" />
      </div>

      <div className="gallery-masonry">
        {group.files.map((file) => (
          <div key={file.name} className="gallery-masonry__item">
            <div className="gallery-photo-wrapper">
              {!loaded[file.name] && (
                <div className="gallery-photo-placeholder" aria-hidden="true" />
              )}
              <img
                src={imageUrls[file.name]}
                alt="Gallery photo"
                className={`gallery-photo ${loaded[file.name] ? 'loaded' : ''}`}
                loading="lazy"
                onLoad={() => handleImageLoad(file.name)}
                onClick={() => onPhotoClick(imageUrls[file.name])}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function QuarterNav({ groups, activeQuarter }) {
  const [scrollLeft, setScrollLeft] = useState(false)
  const [scrollRight, setScrollRight] = useState(true)
  const navRef = React.useRef(null)

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        setScrollLeft(navRef.current.scrollLeft > 0)
        setScrollRight(
          navRef.current.scrollLeft < navRef.current.scrollWidth - navRef.current.clientWidth - 10
        )
      }
    }
    checkScroll()
    navRef.current?.addEventListener('scroll', checkScroll)
    return () => navRef.current?.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div className="gallery-quarter-nav">
      {scrollLeft && (
        <button
          className="gallery-quarter-nav__scroll-btn gallery-quarter-nav__scroll-btn--left"
          onClick={() => {
            navRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
          }}
          aria-label="Scroll quarters left"
        >
          ‹
        </button>
      )}
      <nav className="gallery-quarter-nav__list" ref={navRef}>
        {groups.map((group) => (
          <a
            key={`${group.quarter}-${group.year}`}
            href={`#section-${group.quarter}-${group.year}`}
            className={`gallery-quarter-nav__item ${
              activeQuarter === `${group.quarter}-${group.year}` ? 'active' : ''
            }`}
          >
            {group.label}
          </a>
        ))}
      </nav>
      {scrollRight && (
        <button
          className="gallery-quarter-nav__scroll-btn gallery-quarter-nav__scroll-btn--right"
          onClick={() => {
            navRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
          }}
          aria-label="Scroll quarters right"
        >
          ›
        </button>
      )}
    </div>
  )
}

export default function GalleryPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeQuarter, setActiveQuarter] = useState('')

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const data = await fetchGalleryGroups(supabase)
      setGroups(data)
      if (data.length > 0) {
        setActiveQuarter(`${data[0].quarter}-${data[0].year}`)
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = (url) => {
    setLightboxImages([url])
    setLightboxIndex(0)
    setLightboxOpen(true)
  }

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) {
              const quarter = id.replace('section-', '')
              setActiveQuarter(quarter)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    groups.forEach((group) => {
      const element = document.getElementById(`section-${group.quarter}-${group.year}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [groups])

  return (
    <>
      <PageHead page="gallery" />
      <div className="gallery-page">
        <header className="gallery-header">
          <h1 className="gallery-header__title">Our Work</h1>
          <p className="gallery-header__subtitle">
            A look at the meals and events we've had the privilege of preparing.
          </p>
        </header>

        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-loading__grid">
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty__content">
              <svg className="gallery-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="gallery-empty__text">No photos yet — check back soon.</p>
            </div>
          </div>
        ) : (
          <>
            <QuarterNav groups={groups} activeQuarter={activeQuarter} />

            <div className="gallery-content">
              {groups.map((group) => (
                <QuarterSection
                  key={`${group.quarter}-${group.year}`}
                  group={group}
                  supabase={supabase}
                  onPhotoClick={handlePhotoClick}
                />
              ))}
            </div>
          </>
        )}

        <Lightbox
          isOpen={lightboxOpen}
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      </div>
    </>
  )
}

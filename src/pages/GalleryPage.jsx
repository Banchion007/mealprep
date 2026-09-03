import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { fetchGalleryWithMetadata, getGalleryImageUrl } from '../utils/galleryUtils'
import { PageHead } from '../components/PageHead'
import { SkeletonCard } from '../components/Skeleton'
import './GalleryPage.css'

function Lightbox({ isOpen, imageData, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen || !imageData[currentIndex]) return null

  const current = imageData[currentIndex]

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
            <motion.div
              key={current.id}
              className="gallery-lightbox-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={current.url}
                alt={current.title || 'Gallery view'}
                className="gallery-lightbox-image"
              />
              {(current.title || current.caption) && (
                <div className="gallery-lightbox-info">
                  {current.title && <p className="gallery-lightbox-title">{current.title}</p>}
                  {current.caption && <p className="gallery-lightbox-caption">{current.caption}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {imageData.length > 1 && (
            <>
              <button className="gallery-lightbox-nav gallery-lightbox-nav--prev" onClick={onPrev} aria-label="Previous photo">
                ‹
              </button>
              <button className="gallery-lightbox-nav gallery-lightbox-nav--next" onClick={onNext} aria-label="Next photo">
                ›
              </button>
              <div className="gallery-lightbox-counter">
                {currentIndex + 1} / {imageData.length}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function QuarterSection({ images, onPhotoClick }) {
  const [loaded, setLoaded] = useState({})

  const handleImageLoad = (id) => {
    setLoaded(prev => ({ ...prev, [id]: true }))
  }

  return (
    <section className="gallery-section" id={`section-${images[0]?.quarter}-${images[0]?.year}`}>
      <div className="gallery-section__header">
        <h2 className="gallery-section__title">{images[0]?.quarter} {images[0]?.year}</h2>
        <div className="gallery-section__divider" />
      </div>

      <div className="gallery-masonry">
        {images.map((image) => (
          <div key={image.id} className="gallery-masonry__item">
            <div className="gallery-photo-wrapper">
              {!loaded[image.id] && (
                <div className="gallery-photo-placeholder" aria-hidden="true" />
              )}
              <img
                src={image.url}
                alt={image.title || 'Gallery photo'}
                className={`gallery-photo ${loaded[image.id] ? 'loaded' : ''}`}
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                onClick={() => onPhotoClick(image)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function QuarterNav({ quarters, activeQuarter }) {
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
        {quarters.map((qtr) => (
          <a
            key={`${qtr.quarter}-${qtr.year}`}
            href={`#section-${qtr.quarter}-${qtr.year}`}
            className={`gallery-quarter-nav__item ${
              activeQuarter === `${qtr.quarter}-${qtr.year}` ? 'active' : ''
            }`}
          >
            {qtr.quarter} {qtr.year}
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
  const [groupedImages, setGroupedImages] = useState([])
  const [quarters, setQuarters] = useState([])
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
      const YEARS = ['2026', '2025', '2024']
      const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

      const allImages = []
      const uniqueQuarters = []
      const quarterSet = new Set()

      for (const year of YEARS) {
        for (const quarter of QUARTERS) {
          try {
            const images = await fetchGalleryWithMetadata(supabase, parseInt(year), quarter)
            if (images.length > 0) {
              const withUrls = images.map(img => ({
                ...img,
                url: getGalleryImageUrl(supabase, year, quarter, img.storage_path)
              }))
              allImages.push(...withUrls)

              const key = `${quarter}-${year}`
              if (!quarterSet.has(key)) {
                quarterSet.add(key)
                uniqueQuarters.push({ quarter, year })
              }
            }
          } catch (err) {
            // Skip if quarter has no images
          }
        }
      }

      // Group by quarter
      const grouped = {}
      allImages.forEach(img => {
        const key = `${img.quarter}-${img.year}`
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(img)
      })

      setGroupedImages(grouped)
      setQuarters(uniqueQuarters)
      if (uniqueQuarters.length > 0) {
        setActiveQuarter(`${uniqueQuarters[0].quarter}-${uniqueQuarters[0].year}`)
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = (imageData) => {
    const quarterKey = `${imageData.quarter}-${imageData.year}`
    const quarterImages = groupedImages[quarterKey] || []
    setLightboxImages(quarterImages)
    const index = quarterImages.findIndex(img => img.id === imageData.id)
    setLightboxIndex(Math.max(0, index))
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

    quarters.forEach((qtr) => {
      const element = document.getElementById(`section-${qtr.quarter}-${qtr.year}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [quarters])

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
        ) : quarters.length === 0 ? (
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
            <QuarterNav quarters={quarters} activeQuarter={activeQuarter} />

            <div className="gallery-content">
              {quarters.map((qtr) => {
                const key = `${qtr.quarter}-${qtr.year}`
                return groupedImages[key] && groupedImages[key].length > 0 ? (
                  <QuarterSection
                    key={key}
                    images={groupedImages[key]}
                    onPhotoClick={handlePhotoClick}
                  />
                ) : null
              })}
            </div>
          </>
        )}

        <Lightbox
          isOpen={lightboxOpen}
          imageData={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      </div>
    </>
  )
}

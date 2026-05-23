import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './GalleryViewer.css'

export default function GalleryViewer({ isOpen, onClose, galleryId, galleryTitle }) {
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && galleryId) {
      loadGalleryItems()
    }
  }, [isOpen, galleryId])

  const loadGalleryItems = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .storage
        .from('gallery-uploads')
        .list(`gallery-${galleryId}`, { limit: 100 })

      if (err) {
        if (err.message.includes('not found')) {
          setItems([])
          return
        }
        throw err
      }

      const galleryItems = data.map(file => {
        const { data: urlData } = supabase
          .storage
          .from('gallery-uploads')
          .getPublicUrl(`gallery-${galleryId}/${file.name}`)
        return {
          name: file.name,
          url: urlData.publicUrl,
          isVideo: file.name.match(/\.(mp4|webm|mov)$/i),
        }
      })

      setItems(galleryItems)
      setCurrentIndex(0)
    } catch (err) {
      console.error('Error loading gallery:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') onClose()
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, items.length])

  if (!isOpen) return null

  const currentItem = items[currentIndex]

  return (
    <div className="gallery-viewer-overlay" onClick={onClose}>
      <div className="gallery-viewer" onClick={e => e.stopPropagation()}>
        <button
          className="gallery-viewer__close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          ✕
        </button>

        {items.length === 0 ? (
          <div className="gallery-viewer__empty">
            <p>No images or videos yet</p>
          </div>
        ) : (
          <>
            <div className="gallery-viewer__main">
              {currentItem && (
                currentItem.isVideo ? (
                  <video
                    src={currentItem.url}
                    controls
                    autoPlay
                    className="gallery-viewer__media"
                  />
                ) : (
                  <img
                    src={currentItem.url}
                    alt={`${galleryTitle} ${currentIndex + 1}`}
                    className="gallery-viewer__media"
                  />
                )
              )}
            </div>

            <div className="gallery-viewer__nav">
              <button
                className="gallery-viewer__arrow gallery-viewer__arrow--prev"
                onClick={handlePrevious}
                aria-label="Previous"
              >
                ‹
              </button>

              <div className="gallery-viewer__counter">
                {currentIndex + 1} / {items.length}
              </div>

              <button
                className="gallery-viewer__arrow gallery-viewer__arrow--next"
                onClick={handleNext}
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className="gallery-viewer__thumbnails">
              {items.map((item, i) => (
                <button
                  key={i}
                  className={`gallery-viewer__thumbnail${i === currentIndex ? ' gallery-viewer__thumbnail--active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  title={`Photo ${i + 1}`}
                >
                  {item.isVideo ? (
                    <div className="gallery-viewer__thumbnail-video">▶</div>
                  ) : (
                    <img src={item.url} alt={`Thumbnail ${i + 1}`} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

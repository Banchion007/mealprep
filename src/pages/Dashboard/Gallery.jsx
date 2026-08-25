import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fetchQuarterPhotos, uploadGalleryPhoto, deleteGalleryPhoto, getGalleryImageUrl } from '../../utils/galleryUtils'
import { SkeletonBar } from '../../components/Skeleton'
import './Gallery.css'

function DeleteConfirmationModal({ isOpen, filename, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null

  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <motion.div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="delete-modal__title">Delete Photo</h3>
        <p className="delete-modal__message">Delete this photo? This cannot be undone.</p>
        <div className="delete-modal__actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function UploadZone({ year, quarter, onUploadComplete, isUploading }) {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) dropZoneRef.current.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) dropZoneRef.current.classList.remove('drag-over')
  }

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    const maxSize = 10 * 1024 * 1024 // 10MB

    const errors = []
    const processed = []
    const newPreviews = []

    newFiles.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`)
        return
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 10MB)`)
        return
      }
      processed.push(file)
      newPreviews.push({
        id: Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        url: URL.createObjectURL(file),
      })
    })

    if (errors.length > 0) {
      setError(errors.join('; '))
    }

    setFiles((prev) => [...prev, ...processed])
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) dropZoneRef.current.classList.remove('drag-over')
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e) => {
    processFiles(e.target.files)
  }

  const removeFile = (id) => {
    const index = previews.findIndex((p) => p.id === id)
    if (index >= 0) {
      URL.revokeObjectURL(previews[index].url)
      setPreviews((prev) => prev.filter((p) => p.id !== id))
      setFiles((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    try {
      setUploading(true)
      setError(null)

      for (const file of files) {
        await uploadGalleryPhoto(supabase, year, quarter, file)
      }

      setFiles([])
      setPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      onUploadComplete()
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-zone">
      <div
        ref={dropZoneRef}
        className="upload-zone__drop-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg className="upload-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p className="upload-zone__text">Drop files here or <button
          type="button"
          className="upload-zone__browse-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          browse files
        </button></p>
        <p className="upload-zone__hint">JPEG, PNG, WebP or HEIC up to 10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={handleFileSelect}
          className="upload-zone__input"
        />
      </div>

      {error && <p className="upload-zone__error">{error}</p>}

      {previews.length > 0 && (
        <div className="upload-previews">
          <h4 className="upload-previews__title">Files to upload ({previews.length})</h4>
          <div className="upload-previews__grid">
            {previews.map((preview) => (
              <motion.div
                key={preview.id}
                className="upload-preview-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <img src={preview.url} alt="Preview" className="upload-preview-card__image" />
                <div className="upload-preview-card__info">
                  <p className="upload-preview-card__name">{preview.name}</p>
                  <p className="upload-preview-card__size">{preview.size}MB</p>
                </div>
                <button
                  className="upload-preview-card__remove"
                  onClick={() => removeFile(preview.id)}
                  disabled={uploading}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
          <button
            className="btn btn-primary upload-previews__upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload All'}
          </button>
        </div>
      )}
    </div>
  )
}

function PhotoGrid({ year, quarter, photos, onPhotoDelete, isLoading }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageUrls, setImageUrls] = useState({})
  const [loadedImages, setLoadedImages] = useState({})

  useEffect(() => {
    const urls = {}
    photos.forEach((photo) => {
      urls[photo.name] = getGalleryImageUrl(supabase, year, quarter, photo.name)
    })
    setImageUrls(urls)
  }, [photos, year, quarter])

  const handleDeleteClick = (photo) => {
    setDeleteTarget(photo)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      setIsDeleting(true)
      await deleteGalleryPhoto(supabase, year, quarter, deleteTarget.name)
      setDeleteModalOpen(false)
      setDeleteTarget(null)
      onPhotoDelete()
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="photo-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="photo-grid__skeleton">
            <SkeletonBar height="200px" />
          </div>
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="photo-grid-empty">
        <p>No photos in this quarter yet. Upload some to get started!</p>
      </div>
    )
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo) => (
          <motion.div
            key={photo.name}
            className="photo-grid-item"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="photo-grid-item__image-wrapper">
              <img
                src={imageUrls[photo.name]}
                alt="Gallery photo"
                className={`photo-grid-item__image ${loadedImages[photo.name] ? 'loaded' : ''}`}
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [photo.name]: true }))}
              />
            </div>
            <button
              className="photo-grid-item__delete"
              onClick={() => handleDeleteClick(photo)}
              aria-label="Delete photo"
              title="Delete photo"
            >
              🗑️
            </button>
          </motion.div>
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        filename={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default function GalleryAdmin() {
  const [selectedQuarter, setSelectedQuarter] = useState(null)
  const [selectedYear, setSelectedYear] = useState('2026')
  const [quarterCounts, setQuarterCounts] = useState({})
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const years = ['2026', '2025', '2024']

  // Initialize first available quarter
  useEffect(() => {
    loadQuarterCounts()
    if (!selectedQuarter) {
      setSelectedQuarter('Q4')
    }
  }, [])

  const loadQuarterCounts = async () => {
    const counts = {}
    for (const year of years) {
      for (const quarter of quarters) {
        const data = await fetchQuarterPhotos(supabase, year, quarter)
        counts[`${quarter}-${year}`] = data.length
      }
    }
    setQuarterCounts(counts)
  }

  const loadPhotos = async () => {
    if (!selectedQuarter || !selectedYear) return

    try {
      setLoading(true)
      const data = await fetchQuarterPhotos(supabase, selectedYear, selectedQuarter)
      setPhotos(data)
    } catch (err) {
      console.error('Error loading photos:', err)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [selectedQuarter, selectedYear])

  const handleUploadComplete = () => {
    loadPhotos()
    loadQuarterCounts()
  }

  const handlePhotoDelete = () => {
    loadPhotos()
    loadQuarterCounts()
  }

  return (
    <div className="gallery-admin">
      <div className="gallery-admin__header">
        <h1 className="gallery-admin__title">Gallery Manager</h1>
        <p className="gallery-admin__subtitle">Upload and manage food photos organized by quarter</p>
      </div>

      <div className="gallery-admin__container">
        {/* Left Panel — Quarter Browser */}
        <aside className="gallery-admin__sidebar">
          <h3 className="gallery-admin__sidebar-title">Quarters</h3>
          <div className="quarter-browser">
            {years.map((year) => (
              <div key={year} className="quarter-browser__year">
                <h4 className="quarter-browser__year-title">{year}</h4>
                <div className="quarter-browser__quarters">
                  {quarters.map((quarter) => {
                    const key = `${quarter}-${year}`
                    const count = quarterCounts[key] || 0
                    const isSelected = selectedQuarter === quarter && selectedYear === year

                    return (
                      <button
                        key={key}
                        className={`quarter-browser__item ${isSelected ? 'active' : ''} ${count === 0 ? 'empty' : ''}`}
                        onClick={() => {
                          setSelectedQuarter(quarter)
                          setSelectedYear(year)
                        }}
                      >
                        <span className="quarter-browser__item-label">{quarter}</span>
                        <span className="quarter-browser__item-count">
                          {count === 0 ? 'Empty' : `${count} photo${count !== 1 ? 's' : ''}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Panel — Photo Manager */}
        <div className="gallery-admin__main">
          {selectedQuarter && selectedYear && (
            <>
              <div className="gallery-admin__section-header">
                <h2 className="gallery-admin__section-title">
                  {selectedQuarter} {selectedYear}
                </h2>
                <p className="gallery-admin__section-count">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''}
                </p>
              </div>

              <section className="gallery-admin__upload">
                <h3 className="gallery-admin__section-subtitle">Add Photos</h3>
                <UploadZone
                  year={selectedYear}
                  quarter={selectedQuarter}
                  onUploadComplete={handleUploadComplete}
                  isUploading={loading}
                />
              </section>

              <section className="gallery-admin__photos">
                <h3 className="gallery-admin__section-subtitle">Existing Photos</h3>
                <PhotoGrid
                  year={selectedYear}
                  quarter={selectedQuarter}
                  photos={photos}
                  onPhotoDelete={handlePhotoDelete}
                  isLoading={loading}
                />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

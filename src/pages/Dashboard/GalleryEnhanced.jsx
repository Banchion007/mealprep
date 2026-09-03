/* Enhanced Gallery Manager with crop tool, bulk upload, and metadata */
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import {
  fetchGalleryWithMetadata,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
  createGalleryImageMetadata,
  updateGalleryImageMetadata,
  deleteGalleryImageMetadata,
  reorderGalleryImages,
  getGalleryImageUrl
} from '../../utils/galleryUtils'
import { calculateAutoCenter4x3Crop, normalizeCropPosition, cropPositionToPercentage, percentageToCropPosition } from '../../utils/imageCropUtils'
import './GalleryEnhanced.css'

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']
const YEARS = ['2026', '2025', '2024']

export default function GalleryEnhanced() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedQuarter, setSelectedQuarter] = useState(`Q${Math.ceil(new Date().getMonth() / 3)}`)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [cropImageId, setCropImageId] = useState(null)
  const [reordering, setReordering] = useState(false)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Load images for selected year/quarter
  useEffect(() => {
    loadImages()
  }, [selectedYear, selectedQuarter])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchGalleryWithMetadata(supabase, parseInt(selectedYear), selectedQuarter)
      setImages(data)
    } catch (err) {
      setError(`Failed to load images: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) dropZoneRef.current.classList.remove('drag-over')
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileSelect = (fileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) {
      setError('Please select image files only')
      return
    }
    handleUpload(files)
  }

  const handleUpload = async (files) => {
    try {
      setError(null)
      setSuccess(null)

      for (const file of files) {
        setUploadingFiles(prev => ({ ...prev, [file.name]: true }))

        try {
          const fileName = await uploadGalleryPhoto(supabase, parseInt(selectedYear), selectedQuarter, file)
          const imageUrl = getGalleryImageUrl(supabase, parseInt(selectedYear), selectedQuarter, fileName)

          // Create metadata entry
          const metadata = await createGalleryImageMetadata(
            supabase,
            parseInt(selectedYear),
            selectedQuarter,
            fileName,
            { crop_position: { x: 0, y: 0, width: 100, height: 75 } }
          )

          setImages(prev => [...prev, metadata])
          setSuccess(`Uploaded ${file.name} successfully`)
        } catch (err) {
          setError(`Failed to upload ${file.name}: ${err.message}`)
        } finally {
          setUploadingFiles(prev => {
            const updated = { ...prev }
            delete updated[file.name]
            return updated
          })
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteImage = async (imageId, storagePath) => {
    if (!window.confirm('Delete this image permanently?')) return

    try {
      setError(null)

      const [fileName] = storagePath.split('/').slice(-1)
      await deleteGalleryPhoto(supabase, parseInt(selectedYear), selectedQuarter, fileName)
      await deleteGalleryImageMetadata(supabase, imageId)

      setImages(prev => prev.filter(img => img.id !== imageId))
      setSuccess('Image deleted successfully')
    } catch (err) {
      setError(`Failed to delete image: ${err.message}`)
    }
  }

  const handleUpdateMetadata = async (imageId, updates) => {
    try {
      setError(null)
      await updateGalleryImageMetadata(supabase, imageId, updates)
      setImages(prev => prev.map(img => img.id === imageId ? { ...img, ...updates } : img))
      setSuccess('Updated successfully')
    } catch (err) {
      setError(`Failed to update: ${err.message}`)
    }
  }

  const handleReorder = async () => {
    try {
      setReordering(true)
      setError(null)
      await reorderGalleryImages(supabase, images)
      setSuccess('Images reordered successfully')
    } catch (err) {
      setError(`Failed to reorder: ${err.message}`)
    } finally {
      setReordering(false)
    }
  }

  const moveImage = (fromIndex, direction) => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= images.length) return

    const newImages = [...images]
    ;[newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]]
    setImages(newImages)
  }

  return (
    <div className="gallery-manager">
      <div className="gallery-manager__header">
        <h1>Gallery Manager</h1>
        <div className="gallery-manager__controls">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="gallery-manager__select"
          >
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="gallery-manager__select"
          >
            {QUARTERS.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="gallery-manager__alert gallery-manager__alert--error">
          {error}
          <button onClick={() => setError(null)} className="gallery-manager__alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="gallery-manager__alert gallery-manager__alert--success">
          {success}
          <button onClick={() => setSuccess(null)} className="gallery-manager__alert-close">×</button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="gallery-manager__upload-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="gallery-manager__upload-content">
          <svg className="gallery-manager__upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2"/>
            <polyline points="17 8 12 3 7 8" strokeWidth="2"/>
            <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2"/>
          </svg>
          <p className="gallery-manager__upload-text">Drop images here or click to select</p>
          <p className="gallery-manager__upload-subtext">JPG, PNG, or WebP • Auto-cropped to 4:3</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="gallery-manager__loading">Loading images...</div>
      ) : images.length === 0 ? (
        <div className="gallery-manager__empty">No images yet for this quarter</div>
      ) : (
        <div className="gallery-manager__grid">
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              total={images.length}
              isUploading={uploadingFiles[image.storage_path]}
              onDelete={handleDeleteImage}
              onUpdate={handleUpdateMetadata}
              onMove={moveImage}
            />
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="gallery-manager__actions">
          <button
            onClick={handleReorder}
            disabled={reordering}
            className="btn btn-primary"
          >
            {reordering ? 'Saving order...' : 'Save Order'}
          </button>
        </div>
      )}
    </div>
  )
}

function ImageCard({ image, index, total, isUploading, onDelete, onUpdate, onMove }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(image.title || '')
  const [caption, setCaption] = useState(image.caption || '')
  const [isFeatured, setIsFeatured] = useState(image.is_featured)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = {}
      if (title !== image.title) updates.title = title || null
      if (caption !== image.caption) updates.caption = caption || null
      if (isFeatured !== image.is_featured) updates.is_featured = isFeatured

      if (Object.keys(updates).length > 0) {
        await onUpdate(image.id, updates)
      }
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const imageUrl = getGalleryImageUrl(supabase, image.year, image.quarter, image.storage_path)

  return (
    <motion.div
      className="gallery-manager__card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="gallery-manager__card-image">
        <img src={imageUrl} alt={image.title || 'Gallery image'} />
        {isUploading && <div className="gallery-manager__uploading">Uploading...</div>}
      </div>

      <div className="gallery-manager__card-controls">
        <button
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
          className="gallery-manager__move-btn"
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={() => onMove(index, 'down')}
          disabled={index === total - 1}
          className="gallery-manager__move-btn"
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="gallery-manager__edit-btn"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(image.id, image.storage_path)}
          className="gallery-manager__delete-btn"
        >
          ✕
        </button>
      </div>

      {isEditing && (
        <div className="gallery-manager__edit-panel">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="gallery-manager__input"
            maxLength="255"
          />
          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="gallery-manager__textarea"
            maxLength="500"
          />
          <label className="gallery-manager__checkbox">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured image
          </label>
          <div className="gallery-manager__edit-actions">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-sm btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setTitle(image.title || '')
                setCaption(image.caption || '')
                setIsFeatured(image.is_featured)
              }}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

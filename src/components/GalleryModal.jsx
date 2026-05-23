import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './GalleryModal.css'

export default function GalleryModal({ isOpen, onClose, galleryId, galleryTitle }) {
  const [files, setFiles] = useState([])
  const [uploadedItems, setUploadedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && galleryId) {
      loadGalleryItems()
    }
  }, [isOpen, galleryId])

  const loadGalleryItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .storage
        .from('gallery-uploads')
        .list(`gallery-${galleryId}`, { limit: 100 })

      if (err) {
        if (err.message.includes('not found')) {
          setUploadedItems([])
          return
        }
        throw err
      }

      const items = data.map(file => {
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

      setUploadedItems(items)
    } catch (err) {
      console.error('Error loading gallery:', err)
      setError('Failed to load gallery. Make sure the storage bucket is properly configured.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...newFiles])
    setError(null)
  }

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    // Validate files
    const maxSize = 100 * 1024 * 1024 // 100MB
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large (max 100MB)`)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)

      for (const file of files) {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        const ext = file.name.split('.').pop()
        const fileName = `${timestamp}-${random}.${ext}`

        const { error: uploadError } = await supabase
          .storage
          .from('gallery-uploads')
          .upload(`gallery-${galleryId}/${fileName}`, file)

        if (uploadError) throw uploadError
      }

      setFiles([])
      await loadGalleryItems()
    } catch (err) {
      console.error('Error uploading files:', err)
      if (err.message.includes('not found')) {
        setError('Storage bucket not found. Please ask an admin to set up the gallery-uploads bucket in Supabase.')
      } else {
        setError(`Failed to upload files: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemName) => {
    try {
      setLoading(true)
      const { error: delError } = await supabase
        .storage
        .from('gallery-uploads')
        .remove([`gallery-${galleryId}/${itemName}`])

      if (delError) throw delError
      await loadGalleryItems()
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Failed to delete file')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal" onClick={e => e.stopPropagation()}>
        <div className="gallery-modal__header">
          <h2>{galleryTitle}</h2>
          <button
            className="gallery-modal__close"
            onClick={onClose}
            aria-label="Close gallery"
          >
            ✕
          </button>
        </div>

        <div className="gallery-modal__content">
          {/* Upload Section */}
          <div className="gallery-modal__upload-section">
            <h3>Add Images or Videos</h3>
            <div className="gallery-modal__file-input-wrapper">
              <label className="gallery-modal__file-input-label">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="gallery-modal__file-input"
                />
                <span className="gallery-modal__file-input-text">
                  {files.length > 0 ? `${files.length} file(s) selected` : 'Click to select files'}
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="gallery-modal__selected-files">
                <h4>Selected files:</h4>
                <ul>
                  {files.map((file, i) => (
                    <li key={i} className="gallery-modal__file-item">
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(i)}
                        className="gallery-modal__remove-file"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            )}

            {error && <p className="gallery-modal__error">{error}</p>}
          </div>

          {/* Gallery Section */}
          <div className="gallery-modal__gallery-section">
            <h3>Gallery ({uploadedItems.length})</h3>
            {uploadedItems.length === 0 ? (
              <p className="gallery-modal__empty">No items yet. Upload some images or videos!</p>
            ) : (
              <div className="gallery-modal__grid">
                {uploadedItems.map((item, i) => (
                  <div key={i} className="gallery-modal__item">
                    {item.isVideo ? (
                      <video
                        src={item.url}
                        controls
                        className="gallery-modal__media"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt="Gallery item"
                        className="gallery-modal__media"
                      />
                    )}
                    <button
                      className="gallery-modal__delete"
                      onClick={() => handleDeleteItem(item.name)}
                      disabled={loading}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

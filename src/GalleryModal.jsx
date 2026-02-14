import React, { useState, useEffect, useCallback } from 'react'

export default function GalleryModal({ images = [], isOpen, onClose, galleryLabel = 'Gallery' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgError, setImgError] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0)
      setImgError(false)
    }
  }, [isOpen])

  const current = images && images.length ? images[selectedIndex] : null

  const handlePrev = useCallback(() => {
    if (!images || images.length === 0) return
    setImgError(false)
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)
  }, [images])

  const handleNext = useCallback(() => {
    if (!images || images.length === 0) return
    setImgError(false)
    setSelectedIndex((i) => (i + 1) % images.length)
  }, [images])

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'Escape') onClose()
    },
    [handlePrev, handleNext, isOpen, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen) return null

  // If there are no images, show a friendly message
  if (!images || images.length === 0) {
    return (
      <>
        <div className="gallery-modal-backdrop" onClick={onClose} aria-hidden="true" />
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={galleryLabel}>
          <div style={{ color: '#fff', padding: '2rem' }}>
            <p>No images available.</p>
            <button onClick={onClose} className="gallery-modal-close">Close</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="gallery-modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className="gallery-modal"
        role="dialog"
        aria-modal="true"
        aria-label={galleryLabel}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="gallery-modal-close" onClick={onClose} aria-label="Close gallery" title="Close (ESC)">
          ✕
        </button>

        <div className="gallery-modal-viewer">
          {current && !imgError ? (
            <img
              src={current.src}
              alt={current.name || galleryLabel}
              className="gallery-modal-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ color: '#fff', padding: '1rem', textAlign: 'center' }}>
              <p>Unable to load image.</p>
              <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{current && current.name}</p>
            </div>
          )}

          <div className="gallery-modal-counter">{selectedIndex + 1} / {images.length}</div>
        </div>

        <button className="gallery-modal-nav gallery-modal-nav-prev" onClick={handlePrev} aria-label="Previous image" title="Previous (← arrow)">‹</button>
        <button className="gallery-modal-nav gallery-modal-nav-next" onClick={handleNext} aria-label="Next image" title="Next (→ arrow)">›</button>

        <div className="gallery-modal-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-modal-thumb ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => {
                setSelectedIndex(idx)
                setImgError(false)
              }}
              title={img.name}
              aria-label={`Image ${idx + 1}: ${img.name}`}
              aria-pressed={idx === selectedIndex}
            >
              <img src={img.src} alt={img.name || `Image ${idx + 1}`} onError={(e) => { e.currentTarget.style.opacity = '0.4' }} />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

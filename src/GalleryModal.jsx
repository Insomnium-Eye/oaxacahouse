import React, { useState } from 'react'

export default function GalleryModal({ images = [], isOpen, onClose, galleryLabel = 'Gallery' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!isOpen || !images || images.length === 0) {
    return null
  }

  const current = images[selectedIndex]

  const handlePrev = () => {
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    setSelectedIndex((i) => (i + 1) % images.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrev()
    else if (e.key === 'ArrowRight') handleNext()
    else if (e.key === 'Escape') onClose()
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [images.length])

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="gallery-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={galleryLabel}>
        {/* Close button */}
        <button
          className="gallery-modal-close"
          onClick={onClose}
          aria-label="Close gallery"
          title="Close (ESC)"
        >
          ✕
        </button>

        {/* Main image viewer */}
        <div className="gallery-modal-viewer">
          <img
            src={current.src}
            alt={current.name || galleryLabel}
            className="gallery-modal-image"
          />
          <div className="gallery-modal-counter">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          className="gallery-modal-nav gallery-modal-nav-prev"
          onClick={handlePrev}
          aria-label="Previous image"
          title="Previous (← arrow)"
        >
          ‹
        </button>
        <button
          className="gallery-modal-nav gallery-modal-nav-next"
          onClick={handleNext}
          aria-label="Next image"
          title="Next (→ arrow)"
        >
          ›
        </button>

        {/* Thumbnail grid */}
        <div className="gallery-modal-thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-modal-thumb ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              title={img.name}
              aria-label={`Image ${idx + 1}: ${img.name}`}
              aria-pressed={idx === selectedIndex}
            >
              <img src={img.src} alt={img.name || `Image ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

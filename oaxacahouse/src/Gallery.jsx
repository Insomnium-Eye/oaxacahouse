import React, { useEffect, useRef, useState } from 'react'

export default function Gallery({ images = [], galleryLabel = 'Gallery' }) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef(null)

  // start/stop autoplay
  useEffect(() => {
    if (!images || images.length === 0) return
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setIndex((i) => (images.length ? (i + 1) % images.length : 0))
    }, 3000)
    return () => clearInterval(intervalRef.current)
  }, [images])

  // preload next image
  useEffect(() => {
    if (!images || images.length < 2) return
    const next = (index + 1) % images.length
    const img = new Image()
    img.src = images[next].src
  }, [index, images])

  if (!images || images.length === 0) {
    return null
  }

  const current = images[index]

  return (
    <div
      className="gallery large-gallery"
      aria-label={galleryLabel}
      role="region"
      style={{ height: '100%', width: '100%' }}
    >
      <figure className="slideshow" aria-hidden="false">
        <img
          key={current.src}
          className="slide fade-in"
          src={current.src}
          alt={current.name || galleryLabel}
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <figcaption className="visually-hidden">{current.name}</figcaption>
      </figure>
    </div>
  )
}
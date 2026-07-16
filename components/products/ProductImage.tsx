'use client'

import { useState, useEffect } from 'react'

interface Props {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: Props) {
  const [imgSrc, setImgSrc] = useState(src)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const base = window.location.pathname.startsWith('/dgmarine') ? '/dgmarine' : ''
    setImgSrc(base + src)
  }, [src])

  if (!visible) return null

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card2)', minHeight: 220 }}>
      <img
        src={imgSrc}
        alt={alt}
        style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
        onError={() => setVisible(false)}
      />
    </div>
  )
}

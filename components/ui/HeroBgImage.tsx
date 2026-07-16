'use client'

import { useState, useEffect } from 'react'

export function HeroBgImage({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    const base = window.location.pathname.startsWith('/dgmarine') ? '/dgmarine' : ''
    setImgSrc(base + src)
  }, [src])

  if (!imgSrc) return null

  return (
    <img
      src={imgSrc}
      alt=""
      aria-hidden
      fetchPriority="high"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        pointerEvents: 'none',
      }}
    />
  )
}

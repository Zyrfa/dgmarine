'use client'

import { useState, useEffect } from 'react'

interface Props {
  style?: React.CSSProperties
  alt?: string
}

export function LogoImage({ style, alt = 'DG Marine Chemistry' }: Props) {
  const [src, setSrc] = useState('/logo.png')

  useEffect(() => {
    const base = window.location.pathname.startsWith('/dgmarine') ? '/dgmarine' : ''
    setSrc(`${base}/logo.png`)
  }, [])

  return <img src={src} alt={alt} style={style} />
}

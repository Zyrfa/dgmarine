'use client'
import { useEffect } from 'react'

const SUPPORTED = ['pl', 'en', 'de'] as const

export default function RootPage() {
  useEffect(() => {
    const lang = navigator.language.split('-')[0]
    const locale = SUPPORTED.includes(lang as typeof SUPPORTED[number]) ? lang : 'en'
    window.location.replace(`/dgmarine/${locale}/`)
  }, [])

  return null
}

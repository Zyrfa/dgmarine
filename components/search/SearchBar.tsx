'use client'

import { useState, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'
import type { Product } from '@/lib/mock-products'

interface Props {
  products: Product[]
  locale: string
  placeholder: string
  onResults: (results: Product[]) => void
}

export function SearchBar({ products, locale, placeholder, onResults }: Props) {
  const [query, setQuery] = useState('')

  const fuse = useCallback(
    () => new Fuse(products, {
      keys: [
        { name: `name.${locale}`, weight: 2 },
        { name: 'name.en', weight: 1.5 },
        { name: 'tags', weight: 1.5 },
        { name: `shortDesc.${locale}`, weight: 1 },
        { name: 'shortDesc.en', weight: 0.8 },
        { name: 'category', weight: 0.8 },
      ],
      threshold: 0.35,
      includeScore: true,
    }),
    [products, locale]
  )

  useEffect(() => {
    if (!query.trim()) { onResults(products); return }
    const results = fuse().search(query).map(r => r.item)
    onResults(results)
  }, [query, products, fuse, onResults])

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        width="17" height="17"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '.6rem .75rem .6rem 2.5rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, fontSize: '.9rem', color: 'var(--fg)',
          outline: 'none', transition: 'border-color .15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: 18, lineHeight: 1 }}
          aria-label="Clear search"
        >×</button>
      )}
    </div>
  )
}

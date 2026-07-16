'use client'

import { useState, useCallback } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { ProductCard } from './ProductCard'
import { ZONE_COLORS, type ZoneId } from '@/components/ship/ShipDiagram'
import type { Product } from '@/lib/mock-products'

const ALL_ZONES = Object.keys(ZONE_COLORS) as ZoneId[]

interface Props {
  products: Product[]
  locale: string
  zoneLabels: Record<string, string>
  ui: { search: string; filter: string; noResults: string; addToRfq: string; added: string; compare: string; all: string; biological: string }
}

export function ProductsClient({ products, locale, zoneLabels, ui }: Props) {
  const [filtered, setFiltered] = useState<Product[]>(products)
  const [activeZone, setActiveZone] = useState<ZoneId | 'bio' | null>(null)

  const handleSearch = useCallback((results: Product[]) => {
    setFiltered(
      activeZone === 'bio'  ? results.filter(p => p.isBiological)
      : activeZone          ? results.filter(p => p.zones.includes(activeZone))
      : results
    )
  }, [activeZone])

  const handleZone = (zone: ZoneId | 'bio' | null) => {
    setActiveZone(zone)
    setFiltered(
      zone === 'bio'  ? products.filter(p => p.isBiological)
      : zone          ? products.filter(p => p.zones.includes(zone))
      : products
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search */}
      <SearchBar
        products={products}
        locale={locale}
        placeholder={ui.search}
        onResults={handleSearch}
      />

      {/* Zone filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--fg-muted)', marginRight: '.25rem' }}>
          {ui.filter}:
        </span>
        <button
          onClick={() => handleZone(null)}
          className="tag"
          style={{ background: !activeZone ? 'var(--accent)' : 'var(--bg-card)', color: !activeZone ? 'var(--accent-fg)' : 'var(--fg)', border: '1px solid var(--border)', cursor: 'pointer', padding: '.3rem .75rem' }}
        >
          {ui.all}
        </button>
        {ALL_ZONES.map(z => {
          const active = activeZone === z
          return (
            <button key={z} onClick={() => handleZone(active ? null : z)}
              className="tag"
              style={{ background: active ? ZONE_COLORS[z] : 'var(--bg-card)', color: active ? '#fff' : 'var(--fg)', border: `1px solid ${active ? ZONE_COLORS[z] : 'var(--border)'}`, cursor: 'pointer', padding: '.3rem .75rem', transition: 'all .15s' }}
            >
              {zoneLabels[z] ?? z}
            </button>
          )
        })}
        <button
          onClick={() => handleZone(activeZone === 'bio' ? null : 'bio')}
          className="tag"
          style={{ background: activeZone === 'bio' ? 'var(--bio-accent)' : 'var(--bg-card)', color: activeZone === 'bio' ? '#fff' : 'var(--bio-accent)', border: `1px solid var(--bio-accent)`, cursor: 'pointer', padding: '.3rem .75rem' }}
        >
          🌿 {ui.biological}
        </button>
      </div>

      {/* Results count */}
      <p style={{ fontSize: '.85rem', color: 'var(--fg-muted)', margin: 0 }}>
        {filtered.length} / {products.length}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-muted)' }}>
          {ui.noResults}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              locale={locale}
              zoneLabels={zoneLabels}
              addRfqLabel={ui.addToRfq}
              addedLabel={ui.added}
              compareLabel={ui.compare}
            />
          ))}
        </div>
      )}
    </div>
  )
}

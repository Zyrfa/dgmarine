'use client'

import { useState } from 'react'
import { ShipDiagram, ZONE_COLORS, type ZoneId } from './ShipDiagram'
import { ProductCard } from '@/components/products/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mock-products'

const ALL_ZONES: ZoneId[] = [
  'engine_room', 'cooling', 'deck', 'fuel',
  'cargo_hold', 'accommodation', 'ballast_tank', 'bilge', 'galley',
]

interface Props {
  locale: string
  zoneLabels: Record<ZoneId, string>
  ui: {
    title: string
    subtitle: string
    selectPrompt: string
    productsFor: string
    clearLabel: string
    addRfqLabel: string
    addedLabel: string
    compareLabel: string
  }
}

export function VisualSearchClient({ locale, zoneLabels, ui }: Props) {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null)

  const handleZoneClick = (zone: ZoneId) =>
    setActiveZone(prev => (prev === zone ? null : zone))

  const filteredProducts = activeZone
    ? MOCK_PRODUCTS.filter(p => p.zones.includes(activeZone))
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--fg)', margin: '0 0 .35rem' }}>
          {ui.title}
        </h1>
        <p style={{ color: 'var(--fg-muted)', margin: 0 }}>{ui.subtitle}</p>
      </div>

      {/* Ship SVG */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <ShipDiagram
          activeZone={activeZone}
          onZoneClick={handleZoneClick}
          zoneLabels={zoneLabels}
        />
      </div>

      {/* Zone quick-select buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '.5rem' }}>
        {ALL_ZONES.map((id) => {
          const active = activeZone === id
          const color = ZONE_COLORS[id]
          const count = MOCK_PRODUCTS.filter(p => p.zones.includes(id)).length
          return (
            <button
              key={id}
              onClick={() => handleZoneClick(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                padding: '.5rem .75rem', borderRadius: 8,
                border: `1.5px solid ${active ? color : 'var(--border)'}`,
                background: active ? color + '22' : 'var(--bg-card)',
                color: active ? color : 'var(--fg)',
                cursor: 'pointer', fontSize: '.85rem', fontWeight: 500,
                textAlign: 'left', transition: 'all .15s',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{zoneLabels[id]}</span>
              <span style={{ fontSize: '.75rem', opacity: .6, fontWeight: 700 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Active zone banner */}
      {activeZone ? (
        <div style={{
          padding: '.75rem 1rem', borderRadius: 8,
          background: ZONE_COLORS[activeZone] + '18',
          borderLeft: `4px solid ${ZONE_COLORS[activeZone]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: '.95rem' }}>
            {ui.productsFor}: <span style={{ color: ZONE_COLORS[activeZone] }}>{zoneLabels[activeZone]}</span>
            <span style={{ fontWeight: 400, color: 'var(--fg-muted)', marginLeft: '.5rem' }}>
              ({filteredProducts.length})
            </span>
          </span>
          <button onClick={() => setActiveZone(null)}
            style={{ fontSize: '.8rem', color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>
            {ui.clearLabel}
          </button>
        </div>
      ) : (
        <div style={{
          padding: '.75rem 1rem', borderRadius: 8, textAlign: 'center',
          background: 'var(--bg-card)', border: '1px dashed var(--border)',
          color: 'var(--fg-muted)', fontSize: '.9rem',
        }}>
          {ui.selectPrompt}
        </div>
      )}

      {/* Product grid */}
      {activeZone && filteredProducts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.1rem' }}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              zoneLabels={zoneLabels}
              addRfqLabel={ui.addRfqLabel}
              addedLabel={ui.addedLabel}
              compareLabel={ui.compareLabel}
            />
          ))}
        </div>
      )}
    </div>
  )
}

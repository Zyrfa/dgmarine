'use client'

import { useState } from 'react'
import { ShipDiagram, ZONE_COLORS, type ZoneId } from './ShipDiagram'

const ALL_ZONES: ZoneId[] = [
  'deck', 'accommodation', 'cargo_hold', 'galley',
  'fuel', 'cooling', 'engine_room', 'ballast_tank', 'bilge',
]

interface Props {
  zoneLabels: Record<ZoneId, string>
  ui: { title: string; subtitle: string; selectPrompt: string; productsFor: string; clearLabel: string }
}

export function VisualSearchClient({ zoneLabels, ui }: Props) {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null)

  const handleZoneClick = (zone: ZoneId) =>
    setActiveZone(prev => (prev === zone ? null : zone))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--fg)' }}>
          {ui.title}
        </h1>
        <p style={{ color: 'var(--fg-muted)' }}>{ui.subtitle}</p>
      </div>

      {/* Ship SVG */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--border)' }}
      >
        <ShipDiagram
          activeZone={activeZone}
          onZoneClick={handleZoneClick}
          zoneLabels={zoneLabels}
        />
      </div>

      {/* Instruction / active zone banner */}
      <div
        className="rounded-lg px-4 py-3 text-sm text-center"
        style={{
          backgroundColor: activeZone ? ZONE_COLORS[activeZone] + '22' : 'var(--bg-card)',
          borderLeft: activeZone ? `4px solid ${ZONE_COLORS[activeZone]}` : '4px solid transparent',
          color: 'var(--fg)',
        }}
      >
        {activeZone
          ? `${ui.productsFor}: ${zoneLabels[activeZone]}`
          : ui.selectPrompt}
        {activeZone && (
          <button
            onClick={() => setActiveZone(null)}
            className="ml-3 text-xs underline opacity-70 hover:opacity-100"
          >
            {ui.clearLabel}
          </button>
        )}
      </div>

      {/* Zone legend / quick-select buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ALL_ZONES.map((id) => {
          const active = activeZone === id
          const color = ZONE_COLORS[id]
          return (
            <button
              key={id}
              onClick={() => handleZoneClick(id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
              style={{
                backgroundColor: active ? color + '33' : 'var(--bg-card)',
                border: `1.5px solid ${active ? color : 'var(--border)'}`,
                color: active ? color : 'var(--fg)',
              }}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              {zoneLabels[id]}
            </button>
          )
        })}
      </div>

      {/* Products area (placeholder until Sanity is connected) */}
      {activeZone && (
        <div
          className="rounded-xl p-6 border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
        >
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg)' }}>
            {zoneLabels[activeZone]}
          </h2>
          <p style={{ color: 'var(--fg-muted)' }}>
            Products for this zone will appear here once connected to Sanity CMS.
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

export type ZoneId =
  | 'deck' | 'accommodation' | 'cargo_hold' | 'galley'
  | 'fuel' | 'cooling' | 'engine_room' | 'ballast_tank' | 'bilge'

export const ZONE_COLORS: Record<ZoneId, string> = {
  deck:          '#2563eb',
  accommodation: '#7c3aed',
  cargo_hold:    '#d97706',
  galley:        '#c2410c',
  fuel:          '#a16207',
  cooling:       '#15803d',
  engine_room:   '#b91c1c',
  ballast_tank:  '#0e7490',
  bilge:         '#475569',
}

interface ZoneRect {
  id: ZoneId
  x: number; y: number; w: number; h: number
}

const ZONES: ZoneRect[] = [
  { id: 'deck',          x: 125, y: 140, w: 815, h: 30  },
  { id: 'accommodation', x: 560, y:  75, w: 170, h: 65  },
  { id: 'cargo_hold',    x: 135, y: 170, w: 425, h: 175 },
  { id: 'galley',        x: 560, y: 170, w: 170, h: 90  },
  { id: 'fuel',          x: 560, y: 260, w:  85, h: 115 },
  { id: 'cooling',       x: 645, y: 260, w:  85, h: 115 },
  { id: 'engine_room',   x: 730, y: 170, w: 210, h: 205 },
  { id: 'ballast_tank',  x: 135, y: 345, w: 425, h: 30  },
  { id: 'bilge',         x: 135, y: 375, w: 805, h: 25  },
]

const HULL = 'M 45,390 Q 30,280 70,190 Q 85,150 125,140 L 560,140 L 560,75 L 730,75 L 730,140 L 940,140 L 960,175 L 960,400 Q 500,440 45,390 Z'

function labelFontSize(w: number, h: number) {
  if (h < 28) return 9
  if (w < 90) return 9
  if (w < 160) return 10
  if (w < 240) return 11
  return 13
}

interface Props {
  activeZone: ZoneId | null
  onZoneClick: (zone: ZoneId) => void
  zoneLabels: Record<ZoneId, string>
}

export function ShipDiagram({ activeZone, onZoneClick, zoneLabels }: Props) {
  const [hovered, setHovered] = useState<ZoneId | null>(null)

  return (
    <svg
      viewBox="0 0 1000 460"
      className="w-full h-auto select-none"
      style={{ maxHeight: 520 }}
      role="img"
      aria-label="Interactive ship cross-section"
    >
      <defs>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="hull-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="1000" height="460" fill="#0a0f1e" />

      {/* Water */}
      <rect x="0" y="398" width="1000" height="62" fill="url(#water-grad)" rx="2" />

      {/* Hull fill */}
      <path d={HULL} fill="url(#hull-grad)" />

      {/* Clickable zones */}
      {ZONES.map((z) => {
        const active  = activeZone === z.id
        const hover   = hovered    === z.id
        const color   = ZONE_COLORS[z.id]
        const opacity = active ? 1 : hover ? 0.92 : 0.70
        const sw      = active ? 2.5 : hover ? 2 : 0.8
        const sc      = active || hover ? '#ffffff' : 'rgba(255,255,255,0.22)'
        const fs      = labelFontSize(z.w, z.h)
        const showLabel = z.w >= 80 && z.h >= 26

        return (
          <g
            key={z.id}
            role="button"
            aria-label={zoneLabels[z.id]}
            tabIndex={0}
            style={{ cursor: 'pointer', outline: 'none' }}
            onClick={() => onZoneClick(z.id)}
            onKeyDown={(e) => e.key === 'Enter' && onZoneClick(z.id)}
            onMouseEnter={() => setHovered(z.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h}
              fill={color} fillOpacity={opacity}
              stroke={sc} strokeWidth={sw}
              rx={3}
            />
            {active && (
              <circle
                cx={z.x + z.w - 9} cy={z.y + 9}
                r={4} fill="white" opacity={0.9}
                style={{ pointerEvents: 'none' }}
              />
            )}
            {showLabel && (
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={fs} fontWeight="700"
                style={{ pointerEvents: 'none' }}
              >
                {zoneLabels[z.id].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* Hull outline on top */}
      <path d={HULL} fill="none" stroke="#334155" strokeWidth="2.5" style={{ pointerEvents: 'none' }} />

      {/* Waterline */}
      <line x1="0" y1="406" x2="1000" y2="406"
        stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="10,5" opacity="0.45" />

      {/* Direction labels */}
      <text x="28"  y="450" fill="#475569" fontSize="11" textAnchor="middle" fontWeight="600">BOW</text>
      <text x="972" y="450" fill="#475569" fontSize="11" textAnchor="middle" fontWeight="600">STERN</text>

      {/* Tooltip */}
      {hovered && (() => {
        const z = ZONES.find(z => z.id === hovered)!
        const tx = Math.min(Math.max(z.x + z.w / 2, 75), 925)
        const ty = Math.max(z.y - 8, 38)
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect x={tx - 72} y={ty - 28} width={144} height={26}
              fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx={5} opacity={0.97} />
            <text x={tx} y={ty - 12} textAnchor="middle" dominantBaseline="middle"
              fill="#f1f5f9" fontSize={13} fontWeight={500}>
              {zoneLabels[hovered]}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

'use client'

import { useState, useEffect } from 'react'

export type ZoneId =
  | 'deck' | 'accommodation' | 'cargo_hold' | 'galley'
  | 'fuel' | 'cooling' | 'engine_room' | 'ballast_tank' | 'bilge'

export const ZONE_COLORS: Record<ZoneId, string> = {
  deck:          '#1e40af',
  accommodation: '#4c1d95',
  cargo_hold:    '#92400e',
  galley:        '#7c2d12',
  fuel:          '#713f12',
  cooling:       '#064e3b',
  engine_room:   '#7f1d1d',
  ballast_tank:  '#164e63',
  bilge:         '#374151',
}

interface ZoneRect { id: ZoneId; x: number; y: number; w: number; h: number }

// ─────────────────────────────────────────────────────────────
//  Coordinate space matches the schematic image: 1408 × 768 px
//
//  Ship orientation: STERN = LEFT  │  BOW = RIGHT
//
//  Key reference lines (measured from image):
//    Deck top     y ≈ 368
//    Keel bottom  y ≈ 548
//    Superstructure right edge  x ≈ 415
//    Cargo section right edge   x ≈ 1263
//
//  Vertical split below deck (total 148 px):
//    Row A  y 400–466  h 66   main compartments
//    Row B  y 466–522  h 56   lower tanks
//    Bilge  y 522–548  h 26
// ─────────────────────────────────────────────────────────────
const ZONES: ZoneRect[] = [
  { id: 'deck',          x: 155, y: 368, w: 1108, h: 32 },
  { id: 'accommodation', x: 125, y: 188, w: 290,  h: 180 },
  // ── stern, row A
  { id: 'engine_room',   x: 155, y: 400, w: 182,  h: 66 },
  { id: 'galley',        x: 337, y: 400, w: 78,   h: 66 },
  // ── cargo, row A
  { id: 'cargo_hold',    x: 415, y: 400, w: 848,  h: 66 },
  // ── stern, row B
  { id: 'cooling',       x: 155, y: 466, w: 182,  h: 56 },
  { id: 'fuel',          x: 337, y: 466, w: 78,   h: 56 },
  // ── cargo, row B
  { id: 'ballast_tank',  x: 415, y: 466, w: 848,  h: 56 },
  // ── bottom
  { id: 'bilge',         x: 155, y: 522, w: 1108, h: 26 },
]

function labelPx(w: number, h: number): number {
  if (h < 24 || w < 58) return 0
  if (w < 96)  return 9
  if (w < 180) return 10
  if (w < 290) return 11
  return 13
}

interface Props {
  activeZone: ZoneId | null
  onZoneClick: (zone: ZoneId) => void
  zoneLabels: Record<ZoneId, string>
}

export function ShipDiagram({ activeZone, onZoneClick, zoneLabels }: Props) {
  const [hovered,  setHovered]  = useState<ZoneId | null>(null)
  const [imgSrc,   setImgSrc]   = useState('/ship-diagram.jpg')
  const [isDark,   setIsDark]   = useState(false)

  useEffect(() => {
    // ── resolve basePath at runtime (works in dev AND on GitHub Pages)
    const base = window.location.pathname.startsWith('/dgmarine') ? '/dgmarine' : ''
    setImgSrc(`${base}/ship-diagram.jpg`)

    // ── track dark/light theme
    const root = document.documentElement
    const sync = () => setIsDark(root.getAttribute('data-theme') === 'dark')
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  return (
    <svg
      viewBox="0 0 1408 768"
      className="w-full h-auto select-none"
      style={{ maxHeight: 460, display: 'block' }}
      role="img"
      aria-label="Interactive ship diagram"
    >
      {/* ── background (white in light, near-black in dark) */}
      <rect width="1408" height="768" fill={isDark ? '#0d1520' : '#ffffff'} />

      {/* ── the schematic — inverted in dark mode for blueprint look */}
      <image
        href={imgSrc}
        x="0" y="0" width="1408" height="768"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: isDark ? 'invert(1) opacity(0.85)' : 'none' }}
      />

      {/* ══════════════════════════════════════════════
           INTERACTIVE ZONE OVERLAYS
           idle 0.13 → hover 0.58 → active 0.72
          ══════════════════════════════════════════════ */}
      {ZONES.map((z) => {
        const active  = activeZone === z.id
        const hover   = hovered    === z.id
        const color   = ZONE_COLORS[z.id]
        const fillOp  = active ? 0.72 : hover ? 0.58 : 0.13
        const sw      = active ? 2.5  : hover ? 2    : 0.7
        const sc      = (active || hover) ? color : 'rgba(0,0,0,0.12)'
        const size    = labelPx(z.w, z.h)

        return (
          <g
            key={z.id}
            role="button"
            aria-label={zoneLabels[z.id]}
            tabIndex={0}
            style={{ cursor: 'pointer', outline: 'none' }}
            onClick={() => onZoneClick(z.id)}
            onKeyDown={e => e.key === 'Enter' && onZoneClick(z.id)}
            onMouseEnter={() => setHovered(z.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h}
              fill={color} fillOpacity={fillOp}
              stroke={sc} strokeWidth={sw}
              rx={2}
            />

            {/* active indicator dot */}
            {active && (
              <circle
                cx={z.x + z.w - 10} cy={z.y + 10} r={4}
                fill={color}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* label — only when interacted */}
            {(hover || active) && size > 0 && (
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#ffffff" fontSize={size} fontWeight="800"
                stroke="rgba(0,0,0,0.75)" strokeWidth="3.5" paintOrder="stroke fill"
                style={{ pointerEvents: 'none' }}
              >
                {zoneLabels[z.id].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* ── tooltip above hovered / active zone ─────────── */}
      {(hovered ?? activeZone) && (() => {
        const id  = (hovered ?? activeZone)!
        const z   = ZONES.find(z => z.id === id)!
        const tx  = Math.min(Math.max(z.x + z.w / 2, 90), 1318)
        const ty  = Math.max(z.y - 12, 46)
        const lbl = zoneLabels[id]
        const tw  = Math.max(lbl.length * 8.5 + 32, 112)
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect
              x={tx - tw / 2} y={ty - 30} width={tw} height={26}
              fill={ZONE_COLORS[id]} rx={7} opacity={0.95}
            />
            <text
              x={tx} y={ty - 14}
              textAnchor="middle" dominantBaseline="middle"
              fill="#ffffff" fontSize={12} fontWeight={700}
            >
              {lbl}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

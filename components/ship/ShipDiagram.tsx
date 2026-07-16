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

// ─────────────────────────────────────────────────────────────────────────────
//  Coordinate space: 1408 × 768 px  (matches the SVG viewBox)
//  Ship orientation: STERN = LEFT  │  BOW = RIGHT
//
//  Key reference lines (measured from the ship schematic image):
//    y = 192   superstructure top
//    y = 373   main deck line (top of hull body)
//    y = 400   below-deck zone start
//    y = 470   horizontal split: upper / lower hull sections
//    y = 533   bilge start
//    y = 548   keel / bottom of hull
//    x = 108   stern left edge
//    x = 337   engine-room / galley vertical divider
//    x = 416   engine section / cargo section boundary
//    x = 1268  cargo section right edge / bow taper start
//    x = 1388  bow tip (rightmost point)
//    y = 458   bow tip vertical position
//
//  Bow slopes (straight lines from schematic):
//    Upper: (1268, 373) → (1388, 458)   Δx/Δy ≈ 1.41
//    Lower: (1388, 458) → (1268, 548)   Δx/Δy ≈ −1.33 (narrows left)
//
//  At y = 400:  bow right edge ≈ 1268 + (400−373)×1.41 ≈ 1306
//  At y = 470:  bow right edge ≈ 1388 − (470−458)×1.33 ≈ 1372
//  At y = 533:  bow right edge ≈ 1388 − (533−458)×1.33 ≈ 1288
// ─────────────────────────────────────────────────────────────────────────────

interface ZonePoly { id: ZoneId; pts: [number, number][] }

function parse(s: string): [number, number][] {
  return s.trim().split(/\s+/).map(p => p.split(',').map(Number) as [number, number])
}

const ZONES: ZonePoly[] = [
  // Superstructure / crew quarters — traced from schematic by user
  { id: 'accommodation', pts: parse('332,370 330,251 337,234 332,225 248,224 248,259 236,260 236,284 220,285 221,340 210,342 209,210 200,206 199,200 186,190 186,197 190,208 170,209 158,312 159,366') },

  // Main deck strip — user-calibrated, includes hatch coamings
  { id: 'deck',          pts: parse('72,367 330,371 385,373 386,361 389,354 520,354 526,360 528,370 599,370 599,361 603,355 733,351 738,358 742,369 810,366 814,359 818,352 950,352 954,359 954,368 1025,366 1029,358 1029,352 1164,347 1165,355 1168,357 1168,363 1196,345 1260,339 1268,330 1336,328 1304,400 355,406 72,409') },

  // Engine room — upper left of hull interior
  { id: 'engine_room',   pts: parse('108,400 337,400 337,470 108,470') },

  // Galley / utility — upper right of stern block
  { id: 'galley',        pts: parse('337,400 416,400 416,470 337,470') },

  // Cargo holds — tank body below deck + bow curve (user-calibrated)
  { id: 'cargo_hold',    pts: parse('357,409 357,469 1337,471 1335,464 1332,456 1325,447 1317,442 1306,437 1300,434 1295,429 1295,422 1297,411 355,408') },

  // Cooling systems — lower left of hull
  { id: 'cooling',       pts: parse('108,470 337,470 337,533 108,533') },

  // Fuel tanks — lower right of stern block
  { id: 'fuel',          pts: parse('337,470 416,470 416,533 337,533') },

  // Ballast tanks — lower centre + lower bow section
  { id: 'ballast_tank',  pts: parse('416,470 1372,470 1288,533 416,533') },

  // Bilge — bottom strip, full width including bow bottom
  { id: 'bilge',         pts: parse('108,533 1288,533 1268,548 108,548') },
]

// ── Geometry helpers ──────────────────────────────────────────────────────────
function centroid(pts: [number, number][]): [number, number] {
  return [
    pts.reduce((s, p) => s + p[0], 0) / pts.length,
    pts.reduce((s, p) => s + p[1], 0) / pts.length,
  ]
}

function bbox(pts: [number, number][]) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) }
}

function labelSize(pts: [number, number][]): number {
  const { minX, minY, maxX, maxY } = bbox(pts)
  const w = maxX - minX, h = maxY - minY
  if (h < 18 || w < 55) return 0
  if (w < 95)  return 9
  if (w < 180) return 10
  return 12
}

function ptsStr(pts: [number, number][]) {
  return pts.map(p => p.join(',')).join(' ')
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  activeZone: ZoneId | null
  onZoneClick: (zone: ZoneId) => void
  zoneLabels: Record<ZoneId, string>
}

export function ShipDiagram({ activeZone, onZoneClick, zoneLabels }: Props) {
  const [hovered, setHovered] = useState<ZoneId | null>(null)
  const [imgSrc,  setImgSrc]  = useState('/ship-diagram.jpg')
  const [isDark,  setIsDark]  = useState(false)

  useEffect(() => {
    const base = window.location.pathname.startsWith('/dgmarine') ? '/dgmarine' : ''
    setImgSrc(`${base}/ship-diagram.jpg`)

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
      {/* background */}
      <rect width="1408" height="768" fill={isDark ? '#0d1520' : '#ffffff'} />

      {/* ship schematic — inverted in dark mode for blueprint look */}
      <image
        href={imgSrc}
        x="0" y="0" width="1408" height="768"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: isDark ? 'invert(1) opacity(0.85)' : 'none' }}
      />

      {/* ── Interactive zone overlays ── */}
      {ZONES.map((z) => {
        const active  = activeZone === z.id
        const hover   = hovered    === z.id
        const color   = ZONE_COLORS[z.id]
        const fillOp  = active ? 0.70 : hover ? 0.55 : 0.12
        const sw      = active ? 2.5  : hover ? 2    : 0.8
        const sc      = (active || hover) ? color : 'rgba(0,0,0,0.15)'
        const [cx, cy] = centroid(z.pts)
        const size    = labelSize(z.pts)
        const bb      = bbox(z.pts)

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
            <polygon
              points={ptsStr(z.pts)}
              fill={color}
              fillOpacity={fillOp}
              stroke={sc}
              strokeWidth={sw}
              strokeLinejoin="round"
            />

            {/* active indicator dot */}
            {active && (
              <circle
                cx={bb.maxX - 10} cy={bb.minY + 10} r={4}
                fill={color}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* zone label — visible on hover / active */}
            {(hover || active) && size > 0 && (
              <text
                x={cx} y={cy}
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

      {/* ── Tooltip above hovered / active zone ── */}
      {(hovered ?? activeZone) && (() => {
        const id  = (hovered ?? activeZone)!
        const z   = ZONES.find(z => z.id === id)!
        const bb  = bbox(z.pts)
        const tx  = Math.min(Math.max((bb.minX + bb.maxX) / 2, 90), 1318)
        const ty  = Math.max(bb.minY - 12, 46)
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

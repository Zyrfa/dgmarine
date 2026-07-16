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
  // Superstructure / crew quarters — user-calibrated v2
  { id: 'accommodation', pts: parse('157,340 157,313 160,311 172,209 191,207 191,204 185,201 184,189 197,197 198,207 209,206 208,338 221,337 218,287 235,284 235,261 246,259 246,227 333,226 338,235 331,250 331,337') },

  // Main deck strip — user-calibrated, includes hatch coamings
  { id: 'deck',          pts: parse('72,367 330,371 385,373 386,361 389,354 520,354 526,360 528,370 599,370 599,361 603,355 733,351 738,358 742,369 810,366 814,359 818,352 950,352 954,359 954,368 1025,366 1029,358 1029,352 1164,347 1165,355 1168,357 1168,363 1196,345 1260,339 1268,330 1336,328 1304,400 355,406 72,409') },

  // Engine room — user-calibrated (stern interior with machinery outline)
  { id: 'engine_room',   pts: parse('72,409 352,407 352,467 148,468 144,462 142,454 134,451 125,448 118,446 117,474 114,474 114,517 83,517 76,448 101,447 100,440 94,438 89,438 79,435 74,435 72,408') },

  // Galley — user-calibrated
  { id: 'galley',        pts: parse('158,340 158,367 330,372 330,337') },

  // Cargo holds — left edge snapped to engine_room right (352)
  { id: 'cargo_hold',    pts: parse('352,407 1304,400 1297,411 1295,422 1295,429 1300,434 1306,437 1317,442 1325,447 1332,456 1335,464 1337,471 352,467') },

  // Cooling systems — bottom trimmed to bilge top (y=505)
  { id: 'cooling',       pts: parse('260,467 260,505 352,505 352,467') },

  // Fuel system — first point snapped to engine_room floor (148,468), last snapped to cooling left (260,467)
  { id: 'fuel',          pts: parse('148,468 148,474 144,481 138,482 135,482 133,473 132,468 128,463 123,465 125,476 128,483 125,486 122,488 125,492 128,498 126,503 128,510 130,514 135,507 135,498 139,494 146,501 149,505 156,504 162,503 173,503 196,504 258,507 260,467') },

  // Ballast tanks — top snapped to cargo_hold bottom (352,467)→(1337,471)
  { id: 'ballast_tank',  pts: parse('352,467 352,505 1199,504 1208,505 1276,505 1323,504 1332,494 1336,484 1338,476 1337,471') },

  // Bilge — user-calibrated
  { id: 'bilge',         pts: parse('144,502 196,505 196,506 1200,504 1208,505 1273,506 1323,504 1317,509 1311,511 1304,514 1295,517 1287,519 1280,519 176,520 165,518 159,513 152,507') },
]

// ── Geometry helpers ──────────────────────────────────────────────────────────
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
        const active = activeZone === z.id
        const hover  = hovered    === z.id
        const color  = ZONE_COLORS[z.id]
        const fillOp = active ? 0.70 : hover ? 0.55 : 0.12
        const sw     = active ? 2.5  : hover ? 2    : 0.8
        const sc     = (active || hover) ? color : 'rgba(0,0,0,0.15)'

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
          </g>
        )
      })}

      {/* ── Zone name banner — large, fixed below hull, always readable ── */}
      {(hovered ?? activeZone) && (() => {
        const id    = (hovered ?? activeZone)!
        const lbl   = zoneLabels[id]
        const color = ZONE_COLORS[id]
        const fs    = 26
        const pw    = lbl.length * fs * 0.58 + 48
        const ph    = 44
        const cx    = 704
        const cy    = 660
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect
              x={cx - pw / 2} y={cy - ph / 2} width={pw} height={ph}
              fill={color} opacity={0.93} rx={ph / 2}
            />
            <text
              x={cx} y={cy}
              textAnchor="middle" dominantBaseline="middle"
              fill="#ffffff" fontSize={fs} fontWeight="700"
              letterSpacing="0.5"
            >
              {lbl}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

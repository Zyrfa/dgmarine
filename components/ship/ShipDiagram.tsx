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

// ─── Ship geometry constants ───────────────────────────────
// ViewBox 0 0 1200 500
// Deck line  y=182
// Waterline  y=390
// Keel avg   y=452
// Bow tip    x=58, y=390
// Bow joins deck  x=168, y=182
// Stern deck end  x=1085, y=182
// Stern wall      x=1112, y=182–395
// ──────────────────────────────────────────────────────────

const ZONES: ZoneRect[] = [
  { id: 'deck',          x: 168, y: 182, w: 917, h: 28  },
  { id: 'accommodation', x: 810, y:  88, w: 275, h: 94  },
  { id: 'cargo_hold',    x: 168, y: 210, w: 548, h: 160 },
  { id: 'galley',        x: 716, y: 210, w:  96, h:  78 },
  { id: 'fuel',          x: 716, y: 288, w:  96, h:  82 },
  { id: 'cooling',       x: 812, y: 210, w:  90, h: 160 },
  { id: 'engine_room',   x: 902, y: 210, w: 183, h: 160 },
  { id: 'ballast_tank',  x: 168, y: 370, w: 548, h: 30  },
  { id: 'bilge',         x: 168, y: 400, w: 734, h: 24  },
]

// Outer hull silhouette (bow=left, stern=right)
const HULL     = 'M 58,392 Q 68,200 168,182 L 1085,182 L 1112,212 L 1112,392 Q 640,438 58,392 Z'
// Below-waterline band (dark antifouling)
const BELOW_WL = 'M 58,392 Q 640,438 1112,392 L 1112,408 Q 640,455 54,408 Z'

function fs(w: number, h: number) {
  if (h < 28 || w < 80) return 0   // 0 = hide
  if (w < 100) return 9
  if (w < 180) return 10
  if (w < 280) return 11
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
      viewBox="0 0 1200 500"
      className="w-full h-auto select-none"
      style={{ maxHeight: 520 }}
      role="img"
      aria-label="Interactive ship cross-section"
    >
      <defs>
        <linearGradient id="sg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0d1f38" />
        </linearGradient>
        <linearGradient id="sg-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="sg-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c0392b" />
          <stop offset="100%" stopColor="#a93226" />
        </linearGradient>
        <linearGradient id="sg-ss-lo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8a020" />
          <stop offset="100%" stopColor="#c68010" />
        </linearGradient>
        <linearGradient id="sg-ss-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3a60a8" />
          <stop offset="100%" stopColor="#2a4f90" />
        </linearGradient>
        <filter id="sg-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Background ──────────────────────────────── */}
      <rect width="1200" height="500" fill="url(#sg-sky)" />

      {/* ── Sea ─────────────────────────────────────── */}
      <rect x="0" y="398" width="1200" height="102" fill="url(#sg-water)" />
      <line x1="0" y1="410" x2="1200" y2="410" stroke="#38bdf8" strokeWidth="1"   opacity="0.15" />
      <line x1="0" y1="428" x2="1200" y2="428" stroke="#38bdf8" strokeWidth="0.5" opacity="0.09" />
      <line x1="0" y1="446" x2="1200" y2="446" stroke="#38bdf8" strokeWidth="0.5" opacity="0.06" />

      {/* ── Hull body (red freeboard) ────────────────── */}
      <path d={HULL} fill="url(#sg-hull)" />

      {/* ── Antifouling below waterline ──────────────── */}
      <path d={BELOW_WL} fill="#1c3a5e" />

      {/* ── Deck planking ───────────────────────────── */}
      <rect x="168" y="182" width="917" height="20" fill="#44566a" />
      {/* deck edge highlight */}
      <rect x="168" y="182" width="917" height="3"  fill="#5a6e84" />

      {/* ── Superstructure – lower deckhouse ─────────── */}
      <rect x="812" y="152" width="273" height="30" fill="url(#sg-ss-lo)" rx="2" />
      {/* porthole row on lower deckhouse */}
      {[828,854,880,906,932,958,984,1010,1036,1062].map((cx,i) => (
        <circle key={i} cx={cx} cy={167} r={5} fill="#a8d8ea" fillOpacity="0.7" />
      ))}

      {/* ── Superstructure – bridge block ───────────── */}
      <rect x="835" y="88" width="240" height="64" fill="url(#sg-ss-hi)" rx="3" />
      {/* bridge windows */}
      {[853,879,905,931,957,983,1009,1035,1057].map((cx,i) => (
        <rect key={i} x={cx} y={102} width={14} height={24} fill="#a8d8ea" fillOpacity="0.75" rx="1.5" />
      ))}
      {/* bridge roof lip */}
      <rect x="835" y="88" width="240" height="6" fill="#4a6080" rx="3" />

      {/* ── Funnel ──────────────────────────────────── */}
      <rect x="888" y="50" width="46" height="42" fill="#2d3a4a" rx="4" />
      {/* funnel colour band */}
      <rect x="888" y="50" width="46" height="9"  fill="#c0392b" />
      <rect x="888" y="59" width="46" height="4"  fill="#e8a020" />
      {/* funnel cap */}
      <ellipse cx="911" cy="50" rx="24" ry="5.5" fill="#1e2a3a" />
      {/* smoke wisps */}
      <ellipse cx="905" cy="35" rx="8"  ry="12" fill="#475569" fillOpacity="0.3" />
      <ellipse cx="920" cy="28" rx="6"  ry="10" fill="#475569" fillOpacity="0.2" />

      {/* ── Bow mast ────────────────────────────────── */}
      {/* main mast */}
      <rect x="188" y="105" width="4" height="77" fill="#8a9aaa" />
      {/* cross-tree */}
      <rect x="163" y="118" width="54" height="3" fill="#8a9aaa" />
      {/* stay lines */}
      <line x1="190" y1="118" x2="168" y2="182" stroke="#6a7a8a" strokeWidth="1.2" opacity="0.6" />
      <line x1="190" y1="118" x2="215" y2="182" stroke="#6a7a8a" strokeWidth="1.2" opacity="0.6" />
      {/* top light */}
      <circle cx="190" cy="103" r="4.5" fill="#fcd34d" filter="url(#sg-glow)" opacity="0.9" />

      {/* ── Stern mast / crane ──────────────────────── */}
      <rect x="774" y="140" width="3" height="42" fill="#7a8a9a" />
      <line x1="775" y1="145" x2="800" y2="182" stroke="#6a7a8a" strokeWidth="1" opacity="0.5" />
      <line x1="775" y1="145" x2="750" y2="182" stroke="#6a7a8a" strokeWidth="1" opacity="0.5" />

      {/* ── Cargo hatch covers on deck ───────────────── */}
      {([220, 385, 548] as const).map((hx, i) => (
        <g key={i}>
          {/* hatch coaming */}
          <rect x={hx} y={186} width={120} height={14} fill="#364556" stroke="#4e6070" strokeWidth="1" rx="2" />
          {/* hatch cover panels */}
          <rect x={hx+2}  y={187} width={55} height={11} fill="#3d5060" rx="1.5" />
          <rect x={hx+63} y={187} width={55} height={11} fill="#3d5060" rx="1.5" />
          {/* hatch panel gap */}
          <line x1={hx+59} y1={187} x2={hx+59} y2={198} stroke="#2a3a4a" strokeWidth="2" />
          {/* cleats */}
          <circle cx={hx+18}  cy={186} r={2.5} fill="#5a6a7a" />
          <circle cx={hx+102} cy={186} r={2.5} fill="#5a6a7a" />
        </g>
      ))}

      {/* ── Anchor hawse ────────────────────────────── */}
      <circle cx="115" cy="255" r="9"   fill="#2d3a4a" stroke="#4a5568" strokeWidth="1.5" />
      <circle cx="115" cy="255" r="4.5" fill="#1a2030" />

      {/* ── Railing stanchions ──────────────────────── */}
      {Array.from({length: 36}, (_,i) => 168 + i*25).map((sx, i) => (
        <line key={i} x1={sx} y1="182" x2={sx} y2="172" stroke="#5a7090" strokeWidth="1.2" opacity="0.5" />
      ))}
      <line x1="168" y1="172" x2="1085" y2="172" stroke="#5a7090" strokeWidth="1" opacity="0.4" />

      {/* ══════════════════════════════════════════════
          INTERACTIVE ZONE OVERLAYS
          ══════════════════════════════════════════════ */}
      {ZONES.map((z) => {
        const active  = activeZone === z.id
        const hover   = hovered === z.id
        const color   = ZONE_COLORS[z.id]
        const fillOp  = active ? 0.80 : hover ? 0.70 : 0.48
        const sw      = active ? 2.5 : hover ? 2 : 0.8
        const sc      = active || hover ? '#ffffff' : 'rgba(255,255,255,0.18)'
        const size    = fs(z.w, z.h)

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
              fill={color} fillOpacity={fillOp}
              stroke={sc} strokeWidth={sw}
              rx={4}
            />
            {active && (
              <circle
                cx={z.x + z.w - 10} cy={z.y + 10}
                r={4.5} fill="white" opacity={0.95}
                style={{ pointerEvents: 'none' }}
              />
            )}
            {size > 0 && (
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={size} fontWeight="700"
                stroke="rgba(0,0,0,0.55)" strokeWidth="3.5" paintOrder="stroke fill"
                style={{ pointerEvents: 'none' }}
              >
                {zoneLabels[z.id].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* ── Hull outline ─────────────────────────────── */}
      <path d={HULL} fill="none" stroke="#4a6080" strokeWidth="2.5"
        style={{ pointerEvents: 'none' }} />

      {/* ── Waterline ────────────────────────────────── */}
      <line x1="0" y1="398" x2="1200" y2="398"
        stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="14,7" opacity="0.5" />

      {/* ── Direction labels ─────────────────────────── */}
      <text x="34"   y="475" fill="#4a6080" fontSize="12" textAnchor="middle" fontWeight="700" letterSpacing="1">BOW</text>
      <text x="1166" y="475" fill="#4a6080" fontSize="12" textAnchor="middle" fontWeight="700" letterSpacing="1">STERN</text>

      {/* ── Hover tooltip ────────────────────────────── */}
      {hovered && (() => {
        const z  = ZONES.find(z => z.id === hovered)!
        const tx = Math.min(Math.max(z.x + z.w / 2, 85), 1115)
        const ty = Math.max(z.y - 10, 46)
        const label = zoneLabels[hovered]
        const tw = Math.max(label.length * 8 + 24, 120)
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect x={tx - tw/2} y={ty - 30} width={tw} height={26}
              fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx={6} opacity={0.97} />
            <text x={tx} y={ty - 14} textAnchor="middle" dominantBaseline="middle"
              fill="#e2e8f0" fontSize={12} fontWeight={600}>
              {label}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

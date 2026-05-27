'use client'

import { useState } from 'react'

export type ZoneId =
  | 'deck' | 'accommodation' | 'cargo_hold' | 'galley'
  | 'fuel' | 'cooling' | 'engine_room' | 'ballast_tank' | 'bilge'

// Darker, more muted palette – professional maritime feel
export const ZONE_COLORS: Record<ZoneId, string> = {
  deck:          '#1e40af', // blue-800
  accommodation: '#4c1d95', // violet-900
  cargo_hold:    '#92400e', // amber-800
  galley:        '#7c2d12', // orange-900
  fuel:          '#713f12', // yellow-900 / oil amber
  cooling:       '#064e3b', // emerald-900
  engine_room:   '#7f1d1d', // red-900
  ballast_tank:  '#164e63', // cyan-900
  bilge:         '#1e293b', // slate-800
}

interface ZoneRect { id: ZoneId; x: number; y: number; w: number; h: number }

// ─────────────────────────────────────────────────────────────────
//  ViewBox 0 0 1200 460
//
//  Deck     y = 172
//  Waterline y = 350
//  Keel     y = 425   (flat, no sag)
//
//  BOW (left):  stem at deck  x = 115
//               stem at wl    x = 148  → deck further LEFT = forward rake ↑
//  STERN (right): transom x = 1105, vertical
// ─────────────────────────────────────────────────────────────────

const ZONES: ZoneRect[] = [
  { id: 'deck',          x: 168, y: 172, w: 917, h: 28  },
  { id: 'accommodation', x: 803, y:  72, w: 282, h: 100 },
  { id: 'cargo_hold',    x: 168, y: 200, w: 537, h: 150 },
  { id: 'galley',        x: 705, y: 200, w:  98, h:  75 },
  { id: 'fuel',          x: 705, y: 275, w:  98, h:  75 },
  { id: 'cooling',       x: 803, y: 200, w:  92, h: 150 },
  { id: 'engine_room',   x: 895, y: 200, w: 210, h: 150 },
  { id: 'ballast_tank',  x: 168, y: 350, w: 537, h:  34 },
  { id: 'bilge',         x: 168, y: 384, w: 727, h:  30 }, // h≥30 → label shows
]

// ── Forward-raked bow: deck (115,172) is left of waterline (148,350)
//    Q bezier gives a slight concave stem – correct for cargo ships
const BOW_CURVE  = 'M 148,350 Q 133,262 115,172'

// Freeboard (above waterline) – red/orange hull colour
const FREEBOARD  = `${BOW_CURVE} L 1085,172 L 1105,200 L 1105,350 Z`

// Underwater section – dark antifouling navy (flat keel)
const UNDERWATER = 'M 148,350 L 130,395 L 158,425 L 1105,425 L 1105,350 Z'

// Single outer stroke path
const OUTLINE    = `${BOW_CURVE} L 1085,172 L 1105,200 L 1105,425 L 158,425 L 130,395 Z`

function labelPx(w: number, h: number): number {
  if (h < 28 || w < 60) return 0
  if (w < 100) return 9
  if (w < 190) return 10
  if (w < 300) return 11
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
      viewBox="0 0 1200 460"
      className="w-full h-auto select-none"
      style={{ maxHeight: 500 }}
      role="img"
      aria-label="Interactive ship diagram"
    >
      <defs>
        <linearGradient id="g-sky"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#07101e"/>
          <stop offset="100%" stopColor="#0c1b30"/>
        </linearGradient>
        <linearGradient id="g-sea"  x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0c4566" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#07273c" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="g-free" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c0311e"/>
          <stop offset="100%" stopColor="#9e2818"/>
        </linearGradient>
        <linearGradient id="g-anti" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a3554"/>
          <stop offset="100%" stopColor="#112540"/>
        </linearGradient>
        <linearGradient id="g-sslo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d4920e"/>
          <stop offset="100%" stopColor="#a87010"/>
        </linearGradient>
        <linearGradient id="g-sshi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e4b8f"/>
          <stop offset="100%" stopColor="#163870"/>
        </linearGradient>
        <filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Background ──────────────────────────────────── */}
      <rect width="1200" height="460" fill="url(#g-sky)"/>

      {/* ── Sea ─────────────────────────────────────────── */}
      <rect x="0" y="350" width="1200" height="110" fill="url(#g-sea)"/>
      <line x1="0" y1="362" x2="1200" y2="362" stroke="#38bdf8" strokeWidth="0.7" opacity="0.10"/>
      <line x1="0" y1="380" x2="1200" y2="380" stroke="#38bdf8" strokeWidth="0.5" opacity="0.06"/>

      {/* ── Hull – freeboard (red) ───────────────────────── */}
      <path d={FREEBOARD}  fill="url(#g-free)"/>

      {/* ── Hull – antifouling (dark navy, flat keel) ───── */}
      <path d={UNDERWATER} fill="url(#g-anti)"/>

      {/* ── Deck surface ────────────────────────────────── */}
      <rect x="168" y="172" width="917" height="16" fill="#38505e"/>
      <rect x="168" y="172" width="917" height="3"  fill="#4e6878"/>

      {/* ╔══════════════════════════════════════════════════╗
          ║  SUPERSTRUCTURE  – stern, right side             ║
          ╚══════════════════════════════════════════════════╝ */}

      {/* lower deckhouse (golden) */}
      <rect x="805" y="144" width="300" height="28" fill="url(#g-sslo)" rx="1"/>
      {/* porthole row */}
      {[820,844,868,892,916,940,964,988,1012,1036,1060,1086].map((cx,i)=>(
        <circle key={i} cx={cx} cy={158} r={4.8} fill="#c8e8f8" fillOpacity="0.72"/>
      ))}

      {/* bridge block (blue) */}
      <rect x="828" y="72"  width="257" height="72" fill="url(#g-sshi)" rx="2"/>
      {/* roof lip */}
      <rect x="828" y="72"  width="257" height="4"  fill="#2a4870"/>
      {/* panoramic bridge windows */}
      {[844,869,894,919,944,969,994,1019,1044,1069].map((cx,i)=>(
        <rect key={i} x={cx} y={86} width={16} height={30} fill="#90c8e0" fillOpacity="0.80" rx="1"/>
      ))}
      {/* lower windows */}
      {[844,872,900,928,956,984,1012,1040,1068].map((cx,i)=>(
        <rect key={i} x={cx} y={123} width={14} height={12} fill="#90c8e0" fillOpacity="0.55" rx="1"/>
      ))}

      {/* ── Funnel ──────────────────────────────────────── */}
      <rect x="892" y="34"  width="48" height="42" fill="#1e2d3e" rx="3"/>
      <rect x="892" y="34"  width="48" height="9"  fill="#c0311e"/>   {/* red band */}
      <rect x="892" y="43"  width="48" height="5"  fill="#d4920e"/>   {/* gold band */}
      <ellipse cx="916" cy="34" rx="25" ry="5" fill="#141e2c"/>
      {/* subtle smoke */}
      <ellipse cx="910" cy="20" rx="8" ry="11" fill="#3a4a5a" fillOpacity="0.22"/>
      <ellipse cx="922" cy="12" rx="6" ry="9"  fill="#3a4a5a" fillOpacity="0.14"/>

      {/* ── Bow mast ────────────────────────────────────── */}
      <rect   x="190" y="100" width="4" height="72" fill="#6a7e90"/>
      {/* crosstree */}
      <rect   x="164" y="113" width="56" height="3" fill="#6a7e90"/>
      {/* stays */}
      <line x1="192" y1="113" x2="168" y2="172" stroke="#536070" strokeWidth="1.1" opacity="0.50"/>
      <line x1="192" y1="113" x2="220" y2="172" stroke="#536070" strokeWidth="1.1" opacity="0.50"/>
      {/* masthead light */}
      <circle cx="192" cy="97" r="5" fill="#fde68a" filter="url(#f-glow)" opacity="0.90"/>

      {/* ── Cargo hatches (3) ───────────────────────────── */}
      {([215,390,555] as const).map((hx,i)=>(
        <g key={i}>
          <rect x={hx}    y={178} width={126} height={12} fill="#28404f" stroke="#3e5868" strokeWidth="1" rx="2"/>
          <rect x={hx+2}  y={179} width={58}  height={9}  fill="#324d5e" rx="1.5"/>
          <rect x={hx+66} y={179} width={58}  height={9}  fill="#324d5e" rx="1.5"/>
          <line x1={hx+63} y1={179} x2={hx+63} y2={188} stroke="#1a2e3a" strokeWidth="2"/>
          <circle cx={hx+16}  cy={178} r={2} fill="#4e6272"/>
          <circle cx={hx+110} cy={178} r={2} fill="#4e6272"/>
        </g>
      ))}

      {/* ── Anchor hawse ────────────────────────────────── */}
      <circle cx="132" cy="258" r="8"   fill="#1a2838" stroke="#364e62" strokeWidth="1.5"/>
      <circle cx="132" cy="258" r="3.5" fill="#0c1620"/>

      {/* ── Deck railing (simplified – single rail line + short stanchions) */}
      <line x1="168" y1="164" x2="1085" y2="164" stroke="#4a6278" strokeWidth="1" opacity="0.45"/>
      {Array.from({length:46},(_,i)=>168+i*20).filter(x=>x<=1085).map((sx,i)=>(
        <line key={i} x1={sx} y1="172" x2={sx} y2="164" stroke="#4a6278" strokeWidth="1" opacity="0.35"/>
      ))}

      {/* ═══════════════════════════════════════════════════
           CLICKABLE ZONE OVERLAYS
           Default: very low opacity (0.15) — ship stays clean
           Hover: 0.68  |  Active: 0.82
          ═══════════════════════════════════════════════════ */}
      {ZONES.map((z) => {
        const active = activeZone === z.id
        const hover  = hovered    === z.id
        const color  = ZONE_COLORS[z.id]
        const fillOp = active ? 0.82 : hover ? 0.68 : 0.15
        const sw     = active ? 2.5  : hover ? 1.8  : 0.6
        const sc     = active ? '#fff'
                     : hover  ? 'rgba(255,255,255,0.85)'
                     :           'rgba(255,255,255,0.14)'
        const size   = labelPx(z.w, z.h)

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
              rx={3}
            />
            {active && (
              <circle
                cx={z.x + z.w - 10} cy={z.y + 10} r={4.5}
                fill="#fff" opacity={0.95}
                style={{ pointerEvents: 'none' }}
              />
            )}
            {/* show label when hovered OR active */}
            {(hover || active) && size > 0 && (
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize={size} fontWeight="700"
                stroke="rgba(0,0,0,0.65)" strokeWidth="3.5" paintOrder="stroke fill"
                style={{ pointerEvents: 'none' }}
              >
                {zoneLabels[z.id].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* ── Hull outer stroke ────────────────────────────── */}
      <path d={OUTLINE} fill="none" stroke="#304558" strokeWidth="2.5"
        style={{ pointerEvents: 'none' }}/>

      {/* ── Waterline ────────────────────────────────────── */}
      <line x1="0" y1="350" x2="1200" y2="350"
        stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="18 9" opacity="0.40"/>

      {/* ── Hover / active tooltip ───────────────────────── */}
      {(hovered || activeZone) && (() => {
        const id  = hovered ?? activeZone!
        const z   = ZONES.find(z => z.id === id)!
        const tx  = Math.min(Math.max(z.x + z.w / 2, 95), 1105)
        const ty  = Math.max(z.y - 14, 46)
        const lbl = zoneLabels[id]
        const tw  = Math.max(lbl.length * 8.5 + 32, 112)
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect x={tx - tw/2} y={ty - 30} width={tw} height={26}
              fill="#071526" stroke="#38bdf8" strokeWidth="1.5" rx={7} opacity={0.97}/>
            <text x={tx} y={ty - 14}
              textAnchor="middle" dominantBaseline="middle"
              fill="#e2e8f0" fontSize={12} fontWeight={600}>
              {lbl}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

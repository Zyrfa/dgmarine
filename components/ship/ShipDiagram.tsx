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

interface ZoneRect { id: ZoneId; x: number; y: number; w: number; h: number }

// ─────────────────────────────────────────────────────────────
//  ViewBox 0 0 1200 460
//
//  deck level  y = 175
//  waterline   y = 345
//  keel        y = 420  (flat bottom, no sag)
//
//  bow deck    x = 170  (bow tip at waterline x≈68)
//  stern deck  x = 1085 (stern transom vertical at x = 1105)
// ─────────────────────────────────────────────────────────────

const ZONES: ZoneRect[] = [
  { id: 'deck',          x: 170, y: 175, w: 915, h: 28  },
  { id: 'accommodation', x: 805, y:  72, w: 280, h: 103 },
  { id: 'cargo_hold',    x: 170, y: 203, w: 540, h: 142 },
  { id: 'galley',        x: 710, y: 203, w: 97,  h:  71 },
  { id: 'fuel',          x: 710, y: 274, w: 97,  h:  71 },
  { id: 'cooling',       x: 807, y: 203, w: 92,  h: 142 },
  { id: 'engine_room',   x: 899, y: 203, w: 206, h: 142 },
  { id: 'ballast_tank',  x: 170, y: 345, w: 540, h:  34 },
  { id: 'bilge',         x: 170, y: 379, w: 729, h:  26 },
]

// ── Hull paths ─────────────────────────────────────────────
// Freeboard (above waterline) — red
const FREEBOARD =
  'M 68,345 C 78,264 115,192 170,175 L 1085,175 L 1105,200 L 1105,345 Z'

// Underwater — dark navy (flat bottom, bow keel shape)
const UNDERWATER =
  'M 68,345 L 105,390 L 170,420 L 1105,420 L 1105,345 Z'

// Full outline for stroke only
const HULL_OUTLINE =
  'M 68,345 C 78,264 115,192 170,175 L 1085,175 L 1105,200 L 1105,420 L 170,420 L 105,390 Z'

function labelSize(w: number, h: number): number {
  if (h < 30 || w < 62) return 0
  if (w < 108) return 9
  if (w < 200) return 10
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
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#08111f" />
          <stop offset="100%" stopColor="#0c1a30" />
        </linearGradient>
        <linearGradient id="d-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0c4a6e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#082f4a" stopOpacity="1"   />
        </linearGradient>
        <linearGradient id="d-free" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8341f" />
          <stop offset="100%" stopColor="#a82b18" />
        </linearGradient>
        <linearGradient id="d-anti" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e3a5c" />
          <stop offset="100%" stopColor="#152a42" />
        </linearGradient>
        <linearGradient id="d-sslo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8a020" />
          <stop offset="100%" stopColor="#c07a10" />
        </linearGradient>
        <linearGradient id="d-sshi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2e5ba8" />
          <stop offset="100%" stopColor="#1e4590" />
        </linearGradient>
        <filter id="d-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Background ─────────────────────────────── */}
      <rect width="1200" height="460" fill="url(#d-sky)" />

      {/* ── Sea (below waterline y=345) ─────────────── */}
      <rect x="0" y="345" width="1200" height="115" fill="url(#d-sea)" />
      {/* subtle wave lines */}
      <line x1="0" y1="358" x2="1200" y2="358" stroke="#38bdf8" strokeWidth="0.8" opacity="0.12"/>
      <line x1="0" y1="376" x2="1200" y2="376" stroke="#38bdf8" strokeWidth="0.6" opacity="0.07"/>
      <line x1="0" y1="394" x2="1200" y2="394" stroke="#38bdf8" strokeWidth="0.5" opacity="0.05"/>

      {/* ── Hull – freeboard (red) ──────────────────── */}
      <path d={FREEBOARD}   fill="url(#d-free)" />

      {/* ── Hull – antifouling (dark navy) ─────────── */}
      <path d={UNDERWATER}  fill="url(#d-anti)" />

      {/* ── Deck surface ───────────────────────────── */}
      <rect x="170" y="175" width="915" height="16" fill="#3a4f62" />
      <rect x="170" y="175" width="915" height="3"  fill="#4e6880" />

      {/* ╔═══════════════════════════════════════════╗
          ║  SUPERSTRUCTURE  (stern / right side)     ║
          ╚═══════════════════════════════════════════╝ */}

      {/* lower deckhouse */}
      <rect x="807" y="145" width="298" height="30" fill="url(#d-sslo)" />
      {/* porthole row */}
      {[824,848,872,896,920,944,968,992,1016,1040,1064,1088].map((cx,i)=>(
        <circle key={i} cx={cx} cy={160} r={5} fill="#b8dff0" fillOpacity="0.75"/>
      ))}

      {/* bridge block */}
      <rect x="828" y="72"  width="277" height="73" fill="url(#d-sshi)" rx="2" />
      {/* bridge roof lip */}
      <rect x="828" y="72"  width="277" height="5"  fill="#3a5880" />
      {/* bridge windows — large panoramic */}
      {[844,869,894,919,944,969,994,1019,1044,1069,1090].map((cx,i)=>{
        const w = i===10 ? 13 : 17
        return <rect key={i} x={cx} y={86} width={w} height={28} fill="#a8d8ea" fillOpacity="0.78" rx="1"/>
      })}
      {/* bridge lower windows */}
      {[844,872,900,928,956,984,1012,1040,1068,1092].map((cx,i)=>(
        <rect key={i} x={cx} y={121} width={14} height={14} fill="#a8d8ea" fillOpacity="0.5" rx="1"/>
      ))}

      {/* ── Funnel ─────────────────────────────────── */}
      <rect x="890" y="36"  width="50" height="40" fill="#232f3e" rx="3" />
      <rect x="890" y="36"  width="50" height="10" fill="#c8341f" />
      <rect x="890" y="46"  width="50" height="5"  fill="#e8a020" />
      <ellipse cx="915" cy="36" rx="26" ry="5.5"   fill="#1a2535" />
      {/* smoke */}
      <ellipse cx="910" cy="22" rx="9"  ry="12"    fill="#44556a" fillOpacity="0.28"/>
      <ellipse cx="922" cy="14" rx="7"  ry="10"    fill="#44556a" fillOpacity="0.18"/>

      {/* ── Bow mast ───────────────────────────────── */}
      <rect   x="192" y="96"  width="4"  height="79" fill="#8090a0" />
      <rect   x="165" y="110" width="58" height="3"  fill="#8090a0" />
      {/* forestay lines */}
      <line x1="194" y1="110" x2="170" y2="175" stroke="#607080" strokeWidth="1.2" opacity="0.55"/>
      <line x1="194" y1="110" x2="220" y2="175" stroke="#607080" strokeWidth="1.2" opacity="0.55"/>
      {/* nav light */}
      <circle cx="194" cy="93" r="5" fill="#fde68a" filter="url(#d-glow)" opacity="0.95"/>

      {/* ── Stern crane arm ────────────────────────── */}
      <rect   x="770" y="145" width="3"  height="30" fill="#7080a0" />
      <line x1="771" y1="150" x2="796" y2="175"      stroke="#607080" strokeWidth="1" opacity="0.5"/>
      <line x1="771" y1="150" x2="748" y2="175"      stroke="#607080" strokeWidth="1" opacity="0.5"/>

      {/* ── Cargo hatch covers (3) ─────────────────── */}
      {([215, 384, 543] as const).map((hx,i)=>(
        <g key={i}>
          <rect x={hx}   y={180} width={124} height={13} fill="#2e3f50" stroke="#42566a" strokeWidth="1" rx="2"/>
          <rect x={hx+2} y={181} width={57}  height={10} fill="#364c60" rx="1.5"/>
          <rect x={hx+65}y={181} width={57}  height={10} fill="#364c60" rx="1.5"/>
          <line x1={hx+62} y1={181} x2={hx+62} y2={191} stroke="#1e2d3a" strokeWidth="2"/>
          <circle cx={hx+16}  cy={180} r={2.5} fill="#526070"/>
          <circle cx={hx+108} cy={180} r={2.5} fill="#526070"/>
        </g>
      ))}

      {/* ── Anchor hawse ───────────────────────────── */}
      <circle cx="112" cy="248" r="9"   fill="#1e2d3a" stroke="#3a4e60" strokeWidth="1.5"/>
      <circle cx="112" cy="248" r="4.5" fill="#0f1a25"/>

      {/* ── Deck railing ───────────────────────────── */}
      {Array.from({length:40},(_,i)=>170+i*23).filter(x=>x<1086).map((sx,i)=>(
        <line key={i} x1={sx} y1="175" x2={sx} y2="165" stroke="#4a6278" strokeWidth="1.2" opacity="0.5"/>
      ))}
      <line x1="170" y1="165" x2="1085" y2="165" stroke="#4a6278" strokeWidth="1" opacity="0.4"/>

      {/* ── Freeboard portholes ─────────────────────── */}
      {[200,260,320,380,440,500,560,620,680].map((px,i)=>(
        <circle key={i} cx={px} cy={268} r={6} fill="none" stroke="#7a9ab0" strokeWidth="1.5" opacity="0.4"/>
      ))}

      {/* ═══════════════════════════════════════════════
           INTERACTIVE ZONE OVERLAYS
          ═══════════════════════════════════════════════ */}
      {ZONES.map((z) => {
        const active  = activeZone === z.id
        const hover   = hovered    === z.id
        const color   = ZONE_COLORS[z.id]
        const fillOp  = active ? 0.78 : hover ? 0.66 : 0.44
        const sw      = active ? 2.5  : hover ? 1.8  : 0.7
        const sc      = active ? '#fff' : hover ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)'
        const size    = labelSize(z.w, z.h)

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
              <circle cx={z.x+z.w-10} cy={z.y+10} r={4.5}
                fill="#fff" opacity={0.95} style={{pointerEvents:'none'}}/>
            )}
            {size > 0 && (
              <text
                x={z.x+z.w/2} y={z.y+z.h/2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize={size} fontWeight="700"
                stroke="rgba(0,0,0,0.6)" strokeWidth="3.5" paintOrder="stroke fill"
                style={{pointerEvents:'none'}}
              >
                {zoneLabels[z.id].toUpperCase()}
              </text>
            )}
          </g>
        )
      })}

      {/* ── Hull outline ───────────────────────────── */}
      <path d={HULL_OUTLINE} fill="none" stroke="#3a5570" strokeWidth="2.5"
        style={{pointerEvents:'none'}}/>

      {/* ── Waterline dash ─────────────────────────── */}
      <line x1="0" y1="345" x2="1200" y2="345"
        stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="16 8" opacity="0.45"/>

      {/* ── Hover tooltip ──────────────────────────── */}
      {hovered && (() => {
        const z   = ZONES.find(z => z.id === hovered)!
        const tx  = Math.min(Math.max(z.x + z.w/2, 90), 1110)
        const ty  = Math.max(z.y - 12, 44)
        const lbl = zoneLabels[hovered]
        const tw  = Math.max(lbl.length * 8.5 + 28, 110)
        return (
          <g style={{pointerEvents:'none'}}>
            <rect x={tx-tw/2} y={ty-30} width={tw} height={26}
              fill="#0c1a2e" stroke="#38bdf8" strokeWidth="1.5" rx={7} opacity={0.97}/>
            <text x={tx} y={ty-14} textAnchor="middle" dominantBaseline="middle"
              fill="#e2e8f0" fontSize={12} fontWeight={600}>
              {lbl}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

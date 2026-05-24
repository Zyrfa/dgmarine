'use client'

import Link from 'next/link'
import { useCompareStore } from '@/lib/compare-store'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { ZONE_COLORS, type ZoneId } from '@/components/ship/ShipDiagram'

interface UI {
  empty: string
  remove: string
  clearAll: string
  zones: string
  tags: string
  dosage: string
  category: string
  biological: string
  description: string
  browseProducts: string
  max: string
}

interface Props {
  ui: UI
  locale: string
  zoneLabels: Record<string, string>
}

const thStyle: React.CSSProperties = {
  padding: '1rem .75rem',
  textAlign: 'left',
  verticalAlign: 'top',
  borderBottom: '2px solid var(--border)',
  minWidth: 180,
}

const tdLabelStyle: React.CSSProperties = {
  padding: '.75rem',
  fontSize: '.78rem',
  fontWeight: 700,
  color: 'var(--fg-muted)',
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-card)',
  position: 'sticky',
  left: 0,
  zIndex: 1,
}

const tdValueStyle: React.CSSProperties = {
  padding: '.75rem',
  verticalAlign: 'top',
  borderBottom: '1px solid var(--border)',
  fontSize: '.875rem',
  color: 'var(--fg)',
}

export function CompareTableClient({ ui, locale, zoneLabels }: Props) {
  const { items, remove, clear } = useCompareStore()

  const products = items
    .map(item => MOCK_PRODUCTS.find(p => p.id === item.id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
        <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{ui.empty}</p>
        <Link href={`/${locale}/products`} className="btn-primary" style={{ display: 'inline-block' }}>
          {ui.browseProducts}
        </Link>
      </div>
    )
  }

  const loc = locale as 'en' | 'pl' | 'de'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '.5rem' }}>
        <span style={{ fontSize: '.82rem', color: 'var(--fg-muted)' }}>{ui.max}</span>
        <button
          onClick={clear}
          className="btn-ghost"
          style={{ fontSize: '.82rem', padding: '.35rem .9rem' }}
        >
          {ui.clearAll}
        </button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${140 + products.length * 200}px` }}>
          <thead>
            <tr>
              {/* empty corner cell */}
              <th style={{ ...thStyle, background: 'var(--bg-card)', position: 'sticky', left: 0, zIndex: 2, width: 140 }} />
              {products.map(p => {
                const accentColor = p.zones[0] ? ZONE_COLORS[p.zones[0] as ZoneId] : 'var(--accent)'
                const name = p.name[loc] ?? p.name.en
                return (
                  <th key={p.id} style={{ ...thStyle, background: 'var(--bg-card)', fontWeight: 'normal' }}>
                    <div style={{ height: 4, background: accentColor, borderRadius: '4px 4px 0 0', margin: '-.25rem -.75rem .75rem', marginTop: '-1rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                      <div>
                        <Link
                          href={`/${locale}/products/${p.slug}`}
                          style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--fg)', textDecoration: 'none', display: 'block', marginBottom: '.3rem' }}
                        >
                          {name}
                        </Link>
                        {p.isBiological && (
                          <span style={{ fontSize: '.72rem', color: 'var(--bio-accent)', fontWeight: 600 }}>🌿 BIO</span>
                        )}
                      </div>
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={ui.remove}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '1rem', padding: '2px 6px', borderRadius: 6, flexShrink: 0, lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {/* Category */}
            <tr>
              <td style={tdLabelStyle}>{ui.category}</td>
              {products.map(p => (
                <td key={p.id} style={tdValueStyle}>{p.category}</td>
              ))}
            </tr>

            {/* Zones */}
            <tr>
              <td style={tdLabelStyle}>{ui.zones}</td>
              {products.map(p => (
                <td key={p.id} style={tdValueStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                    {p.zones.map(z => (
                      <span key={z} className="tag" style={{
                        background: ZONE_COLORS[z as ZoneId] + '22',
                        color: ZONE_COLORS[z as ZoneId],
                        border: `1px solid ${ZONE_COLORS[z as ZoneId]}55`,
                        fontSize: '.72rem',
                      }}>
                        {zoneLabels[z] ?? z}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Biological */}
            <tr>
              <td style={tdLabelStyle}>{ui.biological}</td>
              {products.map(p => (
                <td key={p.id} style={tdValueStyle}>
                  {p.isBiological
                    ? <span style={{ color: 'var(--bio-accent)', fontWeight: 700 }}>🌿 BIO</span>
                    : <span style={{ color: 'var(--fg-muted)' }}>—</span>
                  }
                </td>
              ))}
            </tr>

            {/* Dosage */}
            <tr>
              <td style={tdLabelStyle}>{ui.dosage}</td>
              {products.map(p => (
                <td key={p.id} style={tdValueStyle}>
                  <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.dosage.baseConc}</span>
                  <span style={{ color: 'var(--fg-muted)', marginLeft: '.3rem' }}>{p.dosage.unit}</span>
                </td>
              ))}
            </tr>

            {/* Tags */}
            <tr>
              <td style={tdLabelStyle}>{ui.tags}</td>
              {products.map(p => (
                <td key={p.id} style={{ ...tdValueStyle, borderBottom: 'none' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                    {p.tags.map(t => (
                      <span key={t} className="tag" style={{ background: 'var(--bg-card2)', color: 'var(--fg-muted)', border: '1px solid var(--border)', fontSize: '.72rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link href={`/${locale}/products`} className="btn-ghost" style={{ fontSize: '.875rem' }}>
          ← {ui.browseProducts}
        </Link>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRFQStore } from '@/lib/rfq-store'
import { useCompareStore } from '@/lib/compare-store'
import { ZONE_COLORS } from '@/components/ship/ShipDiagram'
import type { Product } from '@/lib/mock-products'

interface Props {
  product: Product
  locale: string
  zoneLabels: Record<string, string>
  addRfqLabel: string
  addedLabel: string
  compareLabel: string
}

export function ProductCard({ product, locale, zoneLabels, addRfqLabel, addedLabel, compareLabel }: Props) {
  const { add: addRFQ, has: hasRFQ } = useRFQStore()
  const { add: addCompare, has: hasCompare, isFull } = useCompareStore()

  const name = product.name[locale as 'en' | 'pl' | 'de'] ?? product.name.en
  const desc = product.shortDesc[locale as 'en' | 'pl' | 'de'] ?? product.shortDesc.en
  const inRfq = hasRFQ(product.id)
  const inCompare = hasCompare(product.id)
  const primaryZone = product.zones[0]
  const accentColor = primaryZone ? ZONE_COLORS[primaryZone] : 'var(--accent)'

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'box-shadow .2s, transform .2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
    >
      {/* Color bar */}
      <div style={{ height: 4, background: accentColor }} />

      {/* Badge for biological */}
      {product.isBiological && (
        <div style={{ position: 'relative' }}>
          <span className="tag" style={{ position: 'absolute', top: 8, right: 8, background: 'var(--bio-accent)', color: '#fff' }}>
            BIO
          </span>
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        {/* Zones */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {product.zones.slice(0, 3).map(z => (
            <span key={z} className="tag"
              style={{ background: ZONE_COLORS[z] + '22', color: ZONE_COLORS[z], border: `1px solid ${ZONE_COLORS[z]}44` }}
            >
              {zoneLabels[z] ?? z}
            </span>
          ))}
        </div>

        {/* Name & description */}
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', lineHeight: 1.3 }}>
            {name}
          </h3>
          <p style={{ margin: '.35rem 0 0', fontSize: '.85rem', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            {desc}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto' }}>
          {product.tags.slice(0, 4).map(t => (
            <span key={t} className="tag" style={{ background: 'var(--bg-card2)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', gap: '.5rem' }}>
        <Link href={`/${locale}/products/${product.slug}`} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '.8rem' }}>
          Details
        </Link>
        <button
          onClick={() => !inCompare && !isFull() && addCompare({ id: product.id, name, slug: product.slug, zones: product.zones, tags: product.tags, dosage: { baseConc: product.dosage.baseConc, unit: product.dosage.unit } })}
          className="btn-ghost"
          style={{ padding: '.5rem .65rem', opacity: inCompare || isFull() ? .5 : 1 }}
          title={compareLabel}
          aria-label={compareLabel}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>
        <button
          onClick={() => !inRfq && addRFQ({ id: product.id, name, slug: product.slug, unit: 'L' })}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '.8rem', opacity: inRfq ? .7 : 1 }}
        >
          {inRfq ? addedLabel : addRfqLabel}
        </button>
      </div>
    </article>
  )
}

'use client'

import { useRFQStore } from '@/lib/rfq-store'
import { useCompareStore } from '@/lib/compare-store'

interface Props {
  product: { id: string; name: string; slug: string; unit: string; zones: string[]; tags: string[]; dosage?: { baseConc: number; unit: string } }
  ui: { addToRfq: string; addedToRfq: string; compare: string }
}

export function ProductDetailActions({ product, ui }: Props) {
  const { add: addRFQ, has: hasRFQ } = useRFQStore()
  const { add: addCompare, has: hasCompare } = useCompareStore()
  const inRfq = hasRFQ(product.id)
  const inCompare = hasCompare(product.id)

  return (
    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
      <button
        onClick={() => !inRfq && addRFQ(product)}
        className="btn-primary"
        style={{ opacity: inRfq ? .7 : 1 }}
      >
        {inRfq ? ui.addedToRfq : ui.addToRfq}
      </button>
      <button
        onClick={() => !inCompare && addCompare({ id: product.id, name: product.name, slug: product.slug, zones: product.zones, tags: product.tags, dosage: product.dosage })}
        className="btn-ghost"
        style={{ opacity: inCompare ? .5 : 1 }}
      >
        {ui.compare}
      </button>
    </div>
  )
}

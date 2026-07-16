import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { ProductsClient } from '@/components/products/ProductsClient'
import type { ZoneId } from '@/components/ship/ShipDiagram'

type Props = { params: Promise<{ locale: string }> }

const ZONE_IDS: ZoneId[] = ['deck','accommodation','cargo_hold','galley','fuel','cooling','engine_room','ballast_tank','bilge']

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const tz = await getTranslations({ locale, namespace: 'zones' })
  const tp = await getTranslations({ locale, namespace: 'products' })

  const zoneLabels = Object.fromEntries(ZONE_IDS.map(id => [id, tz(id)])) as Record<string, string>

  return (
    <main className="page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
          {tp('filter')}
        </h1>
        <p style={{ color: 'var(--fg-muted)', margin: '.35rem 0 0' }}>
          {MOCK_PRODUCTS.length} {tp('count')}
        </p>
      </div>

      <ProductsClient
        products={MOCK_PRODUCTS}
        locale={locale}
        zoneLabels={zoneLabels}
        ui={{
          search: tp('search'),
          filter: tp('filter'),
          noResults: tp('noResults'),
          addToRfq: tp('addToRfq'),
          added: tp('addedToRfq'),
          compare: tp('compare'),
          all: tp('all'),
          biological: tp('biologicalFilter'),
        }}
      />
    </main>
  )
}

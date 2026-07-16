import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { MOCK_PRODUCTS, getProductBySlug } from '@/lib/mock-products'
import { DosageCalculator } from '@/components/products/DosageCalculator'
import { ProductDetailActions } from '@/components/products/ProductDetailActions'
import { ProductImage } from '@/components/products/ProductImage'
import { ZONE_COLORS, type ZoneId } from '@/components/ship/ShipDiagram'

type Props = { params: Promise<{ locale: string; slug: string }> }

const ZONE_IDS: ZoneId[] = ['deck','accommodation','cargo_hold','galley','fuel','cooling','engine_room','ballast_tank','bilge']

export function generateStaticParams() {
  const locales = ['en', 'pl', 'de']
  return locales.flatMap(locale => MOCK_PRODUCTS.map(p => ({ locale, slug: p.slug })))
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const product = getProductBySlug(slug)
  if (!product) notFound()

  const tz = await getTranslations({ locale, namespace: 'zones' })
  const td = await getTranslations({ locale, namespace: 'dosage' })
  const tp = await getTranslations({ locale, namespace: 'products' })

  const zoneLabels = Object.fromEntries(ZONE_IDS.map(id => [id, tz(id)])) as Record<string, string>
  const name = product.name[locale as 'en' | 'pl' | 'de'] ?? product.name.en
  const desc = product.description[locale as 'en' | 'pl' | 'de'] ?? product.description.en
  const related = MOCK_PRODUCTS.filter(p => p.id !== product.id && p.zones.some(z => product.zones.includes(z))).slice(0, 3)

  return (
    <main className="page" style={{ maxWidth: 900 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '.82rem', color: 'var(--fg-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
        <Link href={`/${locale}/products`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          {tp('filter')}
        </Link>
        <span>›</span>
        <span>{name}</span>
      </nav>

      {/* Header */}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
        {product.zones.map(z => (
          <span key={z} className="tag" style={{ background: ZONE_COLORS[z] + '22', color: ZONE_COLORS[z], border: `1px solid ${ZONE_COLORS[z]}44` }}>
            {zoneLabels[z]}
          </span>
        ))}
        {product.isBiological && (
          <span className="tag" style={{ background: 'var(--bio-accent)', color: '#fff' }}>🌿 BIO</span>
        )}
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 1.5rem', color: 'var(--fg)' }}>{name}</h1>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
        {/* Image + description side by side on wider screens */}
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', alignItems: 'start' }}
          className="product-detail-top">
          <ProductImage src={product.image} alt={name} />
          <div className="card" style={{ padding: '1.5rem' }}>
            <p style={{ margin: 0, color: 'var(--fg)', lineHeight: 1.7, fontSize: '.95rem' }}>{desc}</p>
          </div>
        </div>

        {/* Dosage calculator */}
        <DosageCalculator
          dosage={product.dosage}
          ui={{ title: td('title'), tankVolume: td('tankVolume'), result: td('result'), concentration: td('concentration') }}
        />

        {/* Tags */}
        <div>
          <h3 style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--fg-muted)', margin: '0 0 .5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>{tp('tags')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
            {product.tags.map(t => (
              <span key={t} className="tag" style={{ background: 'var(--bg-card2)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <ProductDetailActions
          product={{ id: product.id, name, slug: product.slug, unit: 'L', zones: product.zones, tags: product.tags, dosage: { baseConc: product.dosage.baseConc, unit: product.dosage.unit } }}
          ui={{ addToRfq: tp('addToRfq'), addedToRfq: tp('addedToRfq'), compare: tp('compare') }}
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '1rem' }}>
            {tp('related')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
            {related.map(r => {
              const rname = r.name[locale as 'en'|'pl'|'de'] ?? r.name.en
              const rdesc = r.shortDesc[locale as 'en'|'pl'|'de'] ?? r.shortDesc.en
              return (
                <Link key={r.id} href={`/${locale}/products/${r.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ height: 3, background: r.zones[0] ? ZONE_COLORS[r.zones[0]] : 'var(--accent)', borderRadius: 2, marginBottom: '.75rem' }} />
                    <strong style={{ fontSize: '.9rem', color: 'var(--fg)' }}>{rname}</strong>
                    <p style={{ fontSize: '.8rem', color: 'var(--fg-muted)', margin: '.3rem 0 0' }}>{rdesc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { ProductCard } from '@/components/products/ProductCard'

type Props = { params: Promise<{ locale: string }> }

const ZONE_IDS = ['deck','accommodation','cargo_hold','galley','fuel','cooling','engine_room','ballast_tank','bilge'] as const

export default async function BiologicalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t  = await getTranslations({ locale, namespace: 'biological' })
  const tz = await getTranslations({ locale, namespace: 'zones' })
  const tp = await getTranslations({ locale, namespace: 'products' })

  const zoneLabels = Object.fromEntries(ZONE_IDS.map(id => [id, tz(id)])) as Record<string, string>
  const bioProducts = MOCK_PRODUCTS.filter(p => p.isBiological)

  const benefits = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: t('b1Title'),
      body: t('b1'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      ),
      title: t('b2Title'),
      body: t('b2'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      title: t('b3Title'),
      body: t('b3'),
    },
  ]

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 55%, #166534 100%)',
        color: '#f0fdf4',
        padding: '5rem 1rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Diagonal stripe decoration */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: .05,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 28px, #4ade80 28px, #4ade80 29px)',
          pointerEvents: 'none',
        }} />
        {/* Floating emoji decorations */}
        <div aria-hidden style={{ position: 'absolute', top: '12%',  left: '4%',   fontSize: '4.5rem', opacity: .12, transform: 'rotate(-20deg)', pointerEvents: 'none', userSelect: 'none' }}>🌿</div>
        <div aria-hidden style={{ position: 'absolute', bottom: '14%', right: '5%', fontSize: '5rem',   opacity: .10, transform: 'rotate(14deg)',  pointerEvents: 'none', userSelect: 'none' }}>🌱</div>
        <div aria-hidden style={{ position: 'absolute', top: '35%',  right: '11%', fontSize: '3rem',   opacity: .09, transform: 'rotate(-6deg)',  pointerEvents: 'none', userSelect: 'none' }}>🍃</div>

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '.3rem .9rem',
            background: '#4ade8020', border: '1px solid #4ade8045',
            borderRadius: 999, fontSize: '.8rem', fontWeight: 700,
            color: '#4ade80', marginBottom: '1.25rem', letterSpacing: '.06em',
          }}>
            {t('badge')}
          </span>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900,
            lineHeight: 1.15, margin: '0 0 1.1rem', color: '#f0fdf4',
          }}>
            {t('title')}
          </h1>
          <p style={{
            fontSize: 'clamp(.95rem, 2.5vw, 1.1rem)', color: '#86efac',
            margin: '0 0 2.5rem', maxWidth: 540, marginInline: 'auto', lineHeight: 1.65,
          }}>
            {t('subtitle')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#bio-products" className="btn-primary" style={{ padding: '.75rem 2rem', fontSize: '1rem' }}>
              {t('productsTitle')} ↓
            </a>
            <Link href={`/${locale}/products`} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '.75rem 2rem', fontSize: '1rem',
              background: 'transparent', color: '#d1fae5',
              border: '1px solid #4ade8035', borderRadius: 8,
              fontWeight: 600, textDecoration: 'none',
            }}>
              {t('cta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3.5rem 1rem 2.5rem' }}>
        <h2 style={{
          textAlign: 'center', fontSize: '1.35rem', fontWeight: 800,
          color: 'var(--fg)', marginBottom: '2rem',
        }}>
          {t('why')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {benefits.map((b, i) => (
            <div key={i} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div style={{
                color: 'var(--accent)', width: 52, height: 52,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent)18', borderRadius: 14, flexShrink: 0,
              }}>
                {b.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{b.title}</h3>
              <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--fg-muted)', lineHeight: 1.65 }}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product cards ─────────────────────────────── */}
      <section id="bio-products" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--fg)' }}>
            {t('productsTitle')}
          </h2>
          <span className="tag" style={{ background: 'var(--accent)22', color: 'var(--accent)', border: '1px solid var(--accent)44', fontSize: '.8rem' }}>
            {bioProducts.length}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {bioProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              zoneLabels={zoneLabels}
              addRfqLabel={tp('addToRfq')}
              addedLabel={tp('addedToRfq')}
              compareLabel={tp('compare')}
            />
          ))}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────── */}
      <section style={{
        background: 'var(--accent)', color: 'var(--accent-fg)',
        padding: '2.5rem 1rem', textAlign: 'center',
      }}>
        <p style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 600, opacity: .95 }}>
          {t('catalogueCta')}
        </p>
        <Link href={`/${locale}/products`} style={{
          display: 'inline-block', padding: '.65rem 2rem',
          background: 'var(--accent-fg)', color: 'var(--accent)',
          borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '.95rem',
        }}>
          {t('cta')}
        </Link>
      </section>
    </main>
  )
}

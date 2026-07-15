import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { LogoImage } from '@/components/ui/LogoImage'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t  = await getTranslations({ locale, namespace: 'home.hero' })
  const tn = await getTranslations({ locale, namespace: 'nav' })

  const features = locale === 'pl'
    ? ['Interaktywna mapa statku', 'Kalkulator dawkowania', 'Zapytania ofertowe B2B', 'Produkty biologiczne']
    : locale === 'de'
    ? ['Interaktive Schiffskarte', 'Dosierrechner', 'B2B-Angebotsanfragen', 'Biologische Produkte']
    : ['Interactive ship search', 'Dosage calculator', 'B2B quote requests', 'Biological products']

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #060e1a 0%, #0a1f3a 50%, #0d2a4a 100%)',
        color: '#e2e8f0', padding: '5rem 1rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background waves decoration */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: .07, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #38bdf8 40px, #38bdf8 41px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <LogoImage style={{ objectFit: 'contain', height: 72, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }} />
          </div>

          <span style={{ display: 'inline-block', padding: '.3rem .9rem', background: '#0ea5e920', border: '1px solid #0ea5e950', borderRadius: 999, fontSize: '.8rem', fontWeight: 600, color: '#38bdf8', marginBottom: '1.25rem', letterSpacing: '.05em' }}>
            {locale === 'pl' ? '⚓ Profesjonalna chemia morska' : locale === 'de' ? '⚓ Professionelle Meereschemie' : '⚓ Professional Marine Chemistry'}
          </span>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 1.25rem', color: '#f1f5f9' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#94a3b8', margin: '0 0 2.5rem', maxWidth: 560, marginInline: 'auto' }}>
            {t('subtitle')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/products`} className="btn-primary" style={{ padding: '.75rem 2rem', fontSize: '1rem' }}>
              {t('cta')}
            </Link>
            <Link href={`/${locale}/visual-search`} className="btn-ghost" style={{ padding: '.75rem 2rem', fontSize: '1rem', color: '#e2e8f0', borderColor: '#334155' }}>
              {tn('visualSearch')} →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{['🗺️','⚗️','📋','🌿'][i]}</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--fg)' }}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ background: 'var(--accent)', color: 'var(--accent-fg)', padding: '2.5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 .5rem', fontSize: '1.4rem', fontWeight: 800 }}>
          {locale === 'pl' ? 'Gotowy na zapytanie ofertowe?' : locale === 'de' ? 'Bereit für ein Angebot?' : 'Ready to request a quote?'}
        </h2>
        <p style={{ margin: '0 0 1.5rem', opacity: .9 }}>
          {locale === 'pl' ? 'Dodaj produkty do listy i wyślij jedno zbiorcze zapytanie.' : locale === 'de' ? 'Fügen Sie Produkte zur Liste hinzu und senden Sie eine Sammelanfrage.' : 'Add products to your list and send one consolidated request.'}
        </p>
        <Link href={`/${locale}/products`} style={{ display: 'inline-block', padding: '.65rem 2rem', background: 'var(--accent-fg)', color: 'var(--accent)', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '.95rem' }}>
          {t('cta')}
        </Link>
      </section>
    </main>
  )
}

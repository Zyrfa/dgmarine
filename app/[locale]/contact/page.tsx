import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <main className="page" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '2rem' }}>
        {t('contact')}
      </h1>
      <p style={{ color: 'var(--fg-muted)' }}>Treść strony kontaktowej — wkrótce.</p>
    </main>
  )
}

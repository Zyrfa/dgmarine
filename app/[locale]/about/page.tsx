import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>{t('title')}</h1>
      <p style={{ color: 'var(--fg-muted)' }}>{t('placeholder')}</p>
    </main>
  )
}

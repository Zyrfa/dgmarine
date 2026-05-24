import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'products' })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--fg)' }}>
        {t('filter')}
      </h1>
      {/* TODO: SearchBar + ProductGrid */}
      <p style={{ color: 'var(--fg-muted)' }}>Product catalog — coming soon</p>
    </main>
  )
}

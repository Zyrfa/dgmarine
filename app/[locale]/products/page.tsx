import { useTranslations } from 'next-intl'

export default function ProductsPage() {
  const t = useTranslations('products')

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

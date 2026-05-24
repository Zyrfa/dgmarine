import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function ComparePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>Compare Products</h1>
      <p style={{ color: 'var(--fg-muted)' }}>Comparison table — coming soon</p>
    </main>
  )
}

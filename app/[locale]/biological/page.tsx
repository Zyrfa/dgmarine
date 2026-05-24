import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function BiologicalPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="max-w-7xl mx-auto px-4 py-8" style={{ backgroundColor: 'var(--bio-bg)' }}>
      <h1 className="text-3xl font-bold" style={{ color: 'var(--bio-accent)' }}>Biological Products</h1>
      <p style={{ color: 'var(--fg-muted)' }}>Biological product catalog — coming soon</p>
    </main>
  )
}

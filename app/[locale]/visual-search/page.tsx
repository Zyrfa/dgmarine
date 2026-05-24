import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function VisualSearchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>Visual Search</h1>
      <p style={{ color: 'var(--fg-muted)' }}>Interactive ship diagram — coming soon</p>
    </main>
  )
}

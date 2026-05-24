import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export default async function RfqPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--fg)' }}>Request for Quotation</h1>
      <p style={{ color: 'var(--fg-muted)' }}>RFQ form — coming soon</p>
    </main>
  )
}

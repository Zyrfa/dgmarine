import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home.hero' })
  const nav = await getTranslations({ locale, namespace: 'nav' })

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
        {t('title')}
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl" style={{ color: 'var(--fg-muted)' }}>
        {t('subtitle')}
      </p>
      <Link
        href="/products"
        className="px-8 py-3 rounded-lg font-semibold text-white transition-colors"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        {t('cta')}
      </Link>

      <nav className="mt-12 flex flex-wrap gap-4 justify-center text-sm" style={{ color: 'var(--fg-muted)' }}>
        <Link href="/products">{nav('products')}</Link>
        <Link href="/visual-search">{nav('visualSearch')}</Link>
        <Link href="/biological">{nav('biological')}</Link>
        <Link href="/about">{nav('about')}</Link>
        <Link href="/rfq">{nav('rfq')}</Link>
      </nav>
    </main>
  )
}

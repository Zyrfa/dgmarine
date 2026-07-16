import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { Navbar } from '@/components/ui/Navbar'
type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale as typeof locales[number])) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()
  const tn = await getTranslations({ locale, namespace: 'nav' })

  const links = [
    { href: `/${locale}/products`,      label: tn('products') },
    { href: `/${locale}/visual-search`, label: tn('visualSearch') },
    { href: `/${locale}/biological`,    label: tn('biological') },
    { href: `/${locale}/compare`,       label: tn('compare') },
    { href: `/${locale}/contact`,       label: tn('contact') },
    { href: `/${locale}/about`,         label: tn('about') },
  ]

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <Navbar locale={locale} links={links} rfqLabel={tn('rfq')} />
        {children}
        <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--fg-muted)', fontSize: '.82rem', marginTop: '3rem' }}>
          © {new Date().getFullYear()} DG Marine — Professional Marine Chemicals
        </footer>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

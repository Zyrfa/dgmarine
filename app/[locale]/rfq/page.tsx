import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RFQPageClient } from '@/components/rfq/RFQPageClient'

type Props = { params: Promise<{ locale: string }> }

export default async function RfqPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'rfq' })
  const tn = await getTranslations({ locale, namespace: 'nav' })

  const ui = {
    title: t('title'),
    empty: t('empty'),
    portOfDelivery: t('portOfDelivery'),
    vesselName: t('vesselName'),
    imoNumber: t('imoNumber'),
    email: t('email'),
    notes: t('notes'),
    quantity: t('quantity'),
    send: t('send'),
    sending: t('sending'),
    success: t('success'),
    error: t('error'),
    browseProducts: tn('products'),
    remove: t('remove'),
    clearAll: t('clearAll'),
    product: t('product'),
    unit: t('unit'),
    deliveryDetails: t('deliveryDetails'),
  }

  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '2rem' }}>
        {ui.title}
      </h1>
      <RFQPageClient
        ui={ui}
        locale={locale}
        formspreeId={process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ''}
      />
    </main>
  )
}

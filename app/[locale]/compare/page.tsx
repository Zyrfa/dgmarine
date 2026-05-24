import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CompareTableClient } from '@/components/compare/CompareTableClient'

type Props = { params: Promise<{ locale: string }> }

const ZONE_IDS = ['deck','accommodation','cargo_hold','galley','fuel','cooling','engine_room','ballast_tank','bilge'] as const

export default async function ComparePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const tc = await getTranslations({ locale, namespace: 'compare' })
  const tn = await getTranslations({ locale, namespace: 'nav' })
  const tz = await getTranslations({ locale, namespace: 'zones' })

  const zoneLabels = Object.fromEntries(ZONE_IDS.map(id => [id, tz(id)])) as Record<string, string>

  const ui = {
    empty: tc('empty'),
    remove: tc('remove'),
    clearAll: tc('clearAll'),
    zones: tc('zones'),
    tags: tc('tags'),
    dosage: tc('dosage'),
    category: tc('category'),
    biological: tc('biological'),
    description: tc('description'),
    browseProducts: tn('products'),
    max: tc('max'),
  }

  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '2rem' }}>
        {tc('title')}
      </h1>
      <CompareTableClient ui={ui} locale={locale} zoneLabels={zoneLabels} />
    </main>
  )
}

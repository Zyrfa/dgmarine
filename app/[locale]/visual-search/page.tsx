import { getTranslations, setRequestLocale } from 'next-intl/server'
import { VisualSearchClient } from '@/components/ship/VisualSearchClient'
import type { ZoneId } from '@/components/ship/ShipDiagram'

type Props = { params: Promise<{ locale: string }> }

const ZONE_IDS: ZoneId[] = [
  'deck', 'accommodation', 'cargo_hold', 'galley',
  'fuel', 'cooling', 'engine_room', 'ballast_tank', 'bilge',
]

export default async function VisualSearchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const tz = await getTranslations({ locale, namespace: 'zones' })
  const tn = await getTranslations({ locale, namespace: 'nav' })
  const tv = await getTranslations({ locale, namespace: 'visual' })
  const tp = await getTranslations({ locale, namespace: 'products' })

  const zoneLabels = Object.fromEntries(
    ZONE_IDS.map((id) => [id, tz(id)])
  ) as Record<ZoneId, string>

  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <VisualSearchClient
        locale={locale}
        zoneLabels={zoneLabels}
        ui={{
          title: tn('visualSearch'),
          subtitle: tv('subtitle'),
          selectPrompt: tv('selectPrompt'),
          productsFor: tv('productsFor'),
          clearLabel: tv('clear'),
          addRfqLabel: tp('addToRfq'),
          addedLabel: tp('addedToRfq'),
          compareLabel: tp('compare'),
        }}
      />
    </main>
  )
}

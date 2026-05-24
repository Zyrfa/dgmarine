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

  const zoneLabels = Object.fromEntries(
    ZONE_IDS.map((id) => [id, tz(id)])
  ) as Record<ZoneId, string>

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <VisualSearchClient
        zoneLabels={zoneLabels}
        ui={{
          title: tn('visualSearch'),
          subtitle: locale === 'pl'
            ? 'Kliknij w strefę statku, aby zobaczyć dedykowane produkty chemiczne.'
            : locale === 'de'
            ? 'Klicken Sie auf einen Schiffsbereich, um passende Chemikalien anzuzeigen.'
            : 'Click a zone on the ship to see the matching chemical products.',
          selectPrompt: locale === 'pl'
            ? 'Wybierz strefę klikając na diagram lub przyciski poniżej'
            : locale === 'de'
            ? 'Wählen Sie einen Bereich im Diagramm oder über die Schaltflächen'
            : 'Select a zone by clicking the diagram or the buttons below',
          productsFor: locale === 'pl' ? 'Produkty dla' : locale === 'de' ? 'Produkte für' : 'Products for',
          clearLabel: locale === 'pl' ? 'wyczyść' : locale === 'de' ? 'löschen' : 'clear',
        }}
      />
    </main>
  )
}

import type { ZoneId } from '@/components/ship/ShipDiagram'

export interface Product {
  id: string
  slug: string
  name: { en: string; pl: string; de: string }
  shortDesc: { en: string; pl: string; de: string }
  description: { en: string; pl: string; de: string }
  zones: ZoneId[]
  tags: string[]
  isBiological: boolean
  dosage: { baseConc: number; unit: 'ml/L' | '%' | 'g/L'; notesEn: string }
  category: string
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', slug: 'marinclean-ex',
    name: { en: 'MarinClean EX', pl: 'MarinClean EX', de: 'MarinClean EX' },
    shortDesc: {
      en: 'Heavy-duty engine room degreaser', pl: 'Silny odtłuszczacz do maszynowni', de: 'Starkes Maschinenraum-Entfettungsmittel',
    },
    description: {
      en: 'MarinClean EX is a concentrated alkaline degreaser formulated for use in engine rooms and machinery spaces. Effectively removes oil, grease, fuel residues and carbon deposits from metal surfaces without damaging seals or painted surfaces.',
      pl: 'MarinClean EX to skoncentrowany alkaliczny odtłuszczacz przeznaczony do stosowania w maszynowniach i pomieszczeniach maszynowych. Skutecznie usuwa olej, smar, resztki paliwa i osady węglowe z powierzchni metalowych.',
      de: 'MarinClean EX ist ein konzentrierter alkalischer Entfetter für Maschinenräume. Entfernt effektiv Öl, Fett, Kraftstoffrückstände und Kohlenstoffablagerungen von Metalloberflächen.',
    },
    zones: ['engine_room', 'fuel'],
    tags: ['degreaser', 'engine', 'oil', 'grease', 'alkaline', 'machinery'],
    isBiological: false,
    dosage: { baseConc: 50, unit: 'ml/L', notesEn: 'Dilute 1:20 for general cleaning, 1:5 for heavy soiling.' },
    category: 'Engine Room',
  },
  {
    id: '2', slug: 'bilgesolv-pro',
    name: { en: 'BilgeSolv Pro', pl: 'BilgeSolv Pro', de: 'BilgeSolv Pro' },
    shortDesc: {
      en: 'Bilge cleaner & oil dispersant', pl: 'Środek do czyszczenia zęzy i dyspergent olejowy', de: 'Bilgenreiniger & Öldispersionsmittel',
    },
    description: {
      en: 'BilgeSolv Pro dissolves and disperses oil and fuel contamination in bilge water. Non-toxic formula safe for use near oil-water separators. Approved for overboard discharge in compliance with MARPOL regulations.',
      pl: 'BilgeSolv Pro rozpuszcza i dysperguje zanieczyszczenia olejowe i paliwowe w wodzie zęzowej. Formuła bezpieczna dla separatorów woda-olej.',
      de: 'BilgeSolv Pro löst und dispergiert Öl- und Kraftstoffverunreinigungen im Bilgenwasser. Sicher für Öl-Wasser-Separatoren. MARPOL-konform.',
    },
    zones: ['bilge', 'engine_room'],
    tags: ['bilge', 'oil dispersant', 'marpol', 'separator', 'cleanup'],
    isBiological: false,
    dosage: { baseConc: 20, unit: 'ml/L', notesEn: 'Apply undiluted directly to contamination, or dilute 1:50 for spray application.' },
    category: 'Bilge',
  },
  {
    id: '3', slug: 'deckmaster-plus',
    name: { en: 'DeckMaster Plus', pl: 'DeckMaster Plus', de: 'DeckMaster Plus' },
    shortDesc: {
      en: 'Non-slip deck cleaner & degreaser', pl: 'Antypoślizgowy środek do czyszczenia pokładu', de: 'Rutschfester Deckreiniger & Entfetter',
    },
    description: {
      en: 'DeckMaster Plus is a powerful yet biodegradable deck cleaning solution. Removes marine growth, salt, oil stains and weathering marks. Preserves non-slip surface texture and is safe for all deck coatings including anti-fouling paint.',
      pl: 'DeckMaster Plus to biodegradowalny środek do czyszczenia pokładów. Usuwa muszle, sól, plamy olejowe. Bezpieczny dla wszystkich powłok.',
      de: 'DeckMaster Plus ist ein biologisch abbaubarer Deckreiniger. Entfernt Meeresablagerungen, Salz und Ölflecken. Sicher für alle Deckbeschichtungen.',
    },
    zones: ['deck'],
    tags: ['deck', 'non-slip', 'salt removal', 'marine growth', 'biodegradable', 'outdoor'],
    isBiological: false,
    dosage: { baseConc: 30, unit: 'ml/L', notesEn: 'Apply diluted 1:30 with scrubbing brush. Rinse thoroughly with fresh water.' },
    category: 'Deck',
  },
  {
    id: '4', slug: 'cooltreat-200',
    name: { en: 'CoolTreat 200', pl: 'CoolTreat 200', de: 'CoolTreat 200' },
    shortDesc: {
      en: 'Cooling water treatment & scale inhibitor', pl: 'Środek do uzdatniania wody chłodzącej', de: 'Kühlwasserbehandlung & Kesselsteinverhinderer',
    },
    description: {
      en: 'CoolTreat 200 provides multi-action protection for freshwater cooling systems. Inhibits scale, corrosion and microbiological growth. Suitable for all ferrous and non-ferrous metals including aluminium alloys.',
      pl: 'CoolTreat 200 zapewnia wielofunkcyjną ochronę systemów chłodzenia słodką wodą. Hamuje osadzanie się kamienia, korozję i wzrost mikrobiologiczny.',
      de: 'CoolTreat 200 bietet Mehrfachschutz für Süßwasserkühlsysteme. Verhindert Kesselstein, Korrosion und mikrobiologisches Wachstum.',
    },
    zones: ['cooling', 'engine_room'],
    tags: ['cooling', 'scale inhibitor', 'corrosion', 'freshwater', 'antifreeze'],
    isBiological: false,
    dosage: { baseConc: 5, unit: '%', notesEn: 'Maintain 5% concentration in system. Check monthly with test kit.' },
    category: 'Cooling',
  },
  {
    id: '5', slug: 'fuelguard-b100',
    name: { en: 'FuelGuard B100', pl: 'FuelGuard B100', de: 'FuelGuard B100' },
    shortDesc: {
      en: 'Fuel biocide & stabiliser', pl: 'Biocyd i stabilizator paliwa', de: 'Kraftstoff-Biozid & Stabilisator',
    },
    description: {
      en: 'FuelGuard B100 eliminates microbial contamination in diesel and heavy fuel oil storage tanks. Prevents fuel degradation, sludge formation and filter blocking. Compatible with all marine distillate and residual fuel grades.',
      pl: 'FuelGuard B100 eliminuje zanieczyszczenia mikrobiologiczne w zbiornikach oleju napędowego i mazutu. Zapobiega degradacji paliwa i blokowania filtrów.',
      de: 'FuelGuard B100 eliminiert mikrobielle Kontamination in Diesel- und Schweröltanks. Verhindert Kraftstoffdegradation und Schlamm.',
    },
    zones: ['fuel', 'engine_room'],
    tags: ['fuel', 'biocide', 'diesel', 'HFO', 'sludge', 'microbial', 'filter'],
    isBiological: false,
    dosage: { baseConc: 0.1, unit: '%', notesEn: 'Add 1 litre per 1000 litres of fuel. Treat at every bunkering.' },
    category: 'Fuel',
  },
  {
    id: '6', slug: 'ballastshield',
    name: { en: 'BallastShield', pl: 'BallastShield', de: 'BallastShield' },
    shortDesc: {
      en: 'Ballast tank corrosion inhibitor', pl: 'Inhibitor korozji do zbiorników balastowych', de: 'Korrosionsschutz für Ballasttanks',
    },
    description: {
      en: 'BallastShield is a high-performance coating supplement that protects ballast tank steel from corrosion. Forms a durable protective film on steel surfaces. Reduces pitting and prevents coating breakdown in high-salinity environments.',
      pl: 'BallastShield to dodatek ochronny chroniący stal zbiorników balastowych przed korozją. Tworzy trwały film ochronny na powierzchniach stalowych.',
      de: 'BallastShield schützt Ballasttankstahl vor Korrosion. Bildet einen dauerhaften Schutzfilm auf Stahloberflächen in hochsalzigen Umgebungen.',
    },
    zones: ['ballast_tank'],
    tags: ['ballast', 'corrosion', 'steel', 'salt', 'coating', 'protection'],
    isBiological: false,
    dosage: { baseConc: 2, unit: '%', notesEn: 'Add to ballast water at 2% concentration before ballasting.' },
    category: 'Ballast',
  },
  {
    id: '7', slug: 'hullbrite',
    name: { en: 'HullBrite', pl: 'HullBrite', de: 'HullBrite' },
    shortDesc: {
      en: 'Below-waterline hull cleaner', pl: 'Środek do czyszczenia podwodnej części kadłuba', de: 'Unterwasserrumpfreiniger',
    },
    description: {
      en: 'HullBrite removes barnacles, heavy marine growth, rust staining and calcareous deposits from ship hulls. Acid-based formula dissolves mineral deposits without mechanical scraping. Safe for anti-fouling coatings.',
      pl: 'HullBrite usuwa pąkle, porosty morskie, zabarwienia rdzą i osady wapieniowe z kadłubów statków. Formuła kwasowa bezpieczna dla powłok.',
      de: 'HullBrite entfernt Seepocken, Meeresablagerungen, Rostflecken vom Schiffsrumpf. Säurebasiert, sicher für Antifouling-Beschichtungen.',
    },
    zones: ['deck', 'bilge'],
    tags: ['hull', 'barnacle', 'acid', 'fouling', 'rust', 'marine growth', 'underwater'],
    isBiological: false,
    dosage: { baseConc: 10, unit: '%', notesEn: 'Apply undiluted with brush. Leave 15–30 min. Rinse with high-pressure water.' },
    category: 'Hull',
  },
  {
    id: '8', slug: 'galleypro-500',
    name: { en: 'GalleyPro 500', pl: 'GalleyPro 500', de: 'GalleyPro 500' },
    shortDesc: {
      en: 'Food-safe galley degreaser', pl: 'Bezpieczny dla żywności odtłuszczacz kuchenny', de: 'Lebensmittelsicherer Kombüsen-Entfetter',
    },
    description: {
      en: 'GalleyPro 500 is a food-contact safe degreaser for galley and messroom use. Removes cooking grease, fats and protein residues from all kitchen surfaces. NSF A1 certified. No rinsing required at standard dilution.',
      pl: 'GalleyPro 500 to bezpieczny dla kontaktu z żywnością odtłuszczacz do kambuz i jadalń. Usuwa tłuszcze kuchenne. Certyfikat NSF A1.',
      de: 'GalleyPro 500 ist ein lebensmittelsicherer Entfetter für Kombüse und Messe. Entfernt Kochfett und Proteinrückstände. NSF A1 zertifiziert.',
    },
    zones: ['galley'],
    tags: ['galley', 'kitchen', 'food safe', 'degreaser', 'NSF', 'messroom', 'cooking'],
    isBiological: false,
    dosage: { baseConc: 10, unit: 'ml/L', notesEn: 'Dilute 1:100 for daily cleaning. Use undiluted for heavy soiling.' },
    category: 'Galley',
  },
  {
    id: '9', slug: 'cabinsept',
    name: { en: 'CabinSept', pl: 'CabinSept', de: 'CabinSept' },
    shortDesc: {
      en: 'Broad-spectrum cabin disinfectant', pl: 'Szerokowidmowy dezynfektant do kabin', de: 'Breitspektrum-Kabinendesinfektionsmittel',
    },
    description: {
      en: 'CabinSept is a hospital-grade disinfectant for crew accommodation areas. Active against bacteria, viruses and fungi. Proven efficacy against norovirus and influenza. Pleasant fragrance — suitable for occupied spaces.',
      pl: 'CabinSept to dezynfektant klasy szpitalnej do pomieszczeń mieszkalnych załogi. Aktywny wobec bakterii, wirusów i grzybów. Miły zapach.',
      de: 'CabinSept ist ein Krankenhausqualitäts-Desinfektionsmittel für Besatzungsunterkünfte. Wirksam gegen Bakterien, Viren und Pilze.',
    },
    zones: ['accommodation'],
    tags: ['disinfectant', 'cabin', 'accommodation', 'virus', 'bacteria', 'hygiene', 'norovirus'],
    isBiological: false,
    dosage: { baseConc: 2, unit: 'ml/L', notesEn: 'Dilute 1:500 for routine disinfection. Use 1:100 for outbreak response.' },
    category: 'Accommodation',
  },
  {
    id: '10', slug: 'rustblock-mx',
    name: { en: 'RustBlock MX', pl: 'RustBlock MX', de: 'RustBlock MX' },
    shortDesc: {
      en: 'Multi-metal rust inhibitor', pl: 'Wielometalowy inhibitor rdzy', de: 'Multi-Metall-Rostschutz',
    },
    description: {
      en: 'RustBlock MX forms an invisible protective film on ferrous and non-ferrous metals. Ideal for engine room pipework, fittings and structural steel. Remains effective in wet, humid conditions for up to 12 months.',
      pl: 'RustBlock MX tworzy niewidoczny film ochronny na metalach żelaznych i nieżelaznych. Idealny dla rurociągów i konstrukcji stalowych w maszynowniach.',
      de: 'RustBlock MX bildet einen unsichtbaren Schutzfilm auf Eisen- und Nichteisenmetallen. Ideal für Maschinenraumrohrleitungen und Stahlkonstruktionen.',
    },
    zones: ['engine_room', 'ballast_tank', 'deck'],
    tags: ['rust', 'inhibitor', 'corrosion', 'metal', 'protection', 'pipeline', 'steel'],
    isBiological: false,
    dosage: { baseConc: 3, unit: '%', notesEn: 'Apply by spray, brush or immersion. Allow 10 min dwell time before wiping.' },
    category: 'Engine Room',
  },
  {
    id: '11', slug: 'steampure-hd',
    name: { en: 'SteamPure HD', pl: 'SteamPure HD', de: 'SteamPure HD' },
    shortDesc: {
      en: 'Boiler & steam system descaler', pl: 'Odkamieniacz do kotłów i systemów parowych', de: 'Kessel- & Dampfsystem-Entkalker',
    },
    description: {
      en: 'SteamPure HD removes scale, calcium and magnesium deposits from boilers, steam generators and associated pipework. Controlled chelation technology prevents over-etching of tube surfaces. Approved for use in all marine boiler types.',
      pl: 'SteamPure HD usuwa kamień, osady wapnia i magnezu z kotłów i generatorów pary. Technologia chelatacji zapobiega nadtrawieniu powierzchni.',
      de: 'SteamPure HD entfernt Kesselstein aus Boilern und Dampferzeugern. Chelatisierungstechnologie verhindert übermäßiges Ätzen.',
    },
    zones: ['engine_room', 'cooling'],
    tags: ['boiler', 'descaler', 'scale', 'steam', 'calcium', 'chelation', 'heat exchanger'],
    isBiological: false,
    dosage: { baseConc: 8, unit: '%', notesEn: 'Circulate 8% solution for 4–6 hours at 60°C. Flush thoroughly.' },
    category: 'Engine Room',
  },
  {
    id: '12', slug: 'cargofresh',
    name: { en: 'CargoFresh', pl: 'CargoFresh', de: 'CargoFresh' },
    shortDesc: {
      en: 'Cargo hold cleaner & deodoriser', pl: 'Środek do czyszczenia i dezodoryzacji ładowni', de: 'Laderaumreiniger & Duftstoff',
    },
    description: {
      en: 'CargoFresh removes contamination from previous cargo, neutralises odours and prepares holds for inspection. Approved for use before loading food-grade cargo. Removes grain dust, fertiliser residues and chemical staining.',
      pl: 'CargoFresh usuwa zanieczyszczenia po poprzednim ładunku i neutralizuje zapachy. Zatwierdzony przed załadunkiem towarów spożywczych.',
      de: 'CargoFresh beseitigt Verunreinigungen aus dem Vorladung und neutralisiert Gerüche. Für Lebensmittelladungen zugelassen.',
    },
    zones: ['cargo_hold'],
    tags: ['cargo hold', 'cleaning', 'deodorant', 'grain', 'fertiliser', 'food grade', 'hold prep'],
    isBiological: false,
    dosage: { baseConc: 20, unit: 'ml/L', notesEn: 'Apply at 1:50 dilution by high-pressure wash. Allow 30 min contact time.' },
    category: 'Cargo Hold',
  },
  {
    id: '13', slug: 'cargoshield-p',
    name: { en: 'CargoShield P', pl: 'CargoShield P', de: 'CargoShield P' },
    shortDesc: {
      en: 'Cargo hold coating & preservative', pl: 'Powłoka konserwująca do ładowni', de: 'Laderaumbeschichtung & Konservierungsmittel',
    },
    description: {
      en: 'CargoShield P is a water-based penetrating sealer that protects cargo hold steel from corrosion between voyages. Creates a thin barrier film that withstands cargo loading forces. Prevents pitting in ballast water contact areas.',
      pl: 'CargoShield P to penetrujący uszczelniacz ochronny chroniący stal ładowni przed korozją między rejsami.',
      de: 'CargoShield P ist ein wasserbasierter Eindringversiegler zum Korrosionsschutz von Laderaumstahl zwischen Reisen.',
    },
    zones: ['cargo_hold', 'ballast_tank'],
    tags: ['cargo hold', 'coating', 'corrosion', 'preservation', 'steel', 'sealer'],
    isBiological: false,
    dosage: { baseConc: 100, unit: 'ml/L', notesEn: 'Apply undiluted by roller or spray gun. One coat minimum.' },
    category: 'Cargo Hold',
  },
  {
    id: '14', slug: 'seawash-universal',
    name: { en: 'SeaWash Universal', pl: 'SeaWash Universal', de: 'SeaWash Universal' },
    shortDesc: {
      en: 'All-purpose marine surface cleaner', pl: 'Uniwersalny środek czyszczący do powierzchni morskich', de: 'Universeller Meeresflächenreiniger',
    },
    description: {
      en: 'SeaWash Universal is a concentrated all-round cleaner suitable for decks, accommodation, passageways and workshops. pH-neutral formula safe on all surfaces including painted, varnished, rubber and plastic. Biodegradable.',
      pl: 'SeaWash Universal to skoncentrowany wszechstronny środek czyszczący do pokładów, pomieszczeń i korytarzy. Neutralne pH.',
      de: 'SeaWash Universal ist ein konzentrierter Allzweckreiniger für Decks, Unterkunft und Werkstätten. pH-neutral, biologisch abbaubar.',
    },
    zones: ['deck', 'accommodation', 'galley'],
    tags: ['universal', 'cleaner', 'all purpose', 'pH neutral', 'biodegradable', 'safe', 'surface'],
    isBiological: false,
    dosage: { baseConc: 5, unit: 'ml/L', notesEn: 'Dilute 1:200 for light cleaning up to 1:20 for heavy soiling.' },
    category: 'General',
  },
  {
    id: '15', slug: 'biobilge-active',
    name: { en: 'BioBilge Active', pl: 'BioBilge Active', de: 'BioBilge Active' },
    shortDesc: {
      en: 'Biological bilge treatment', pl: 'Biologiczny środek do zęzy', de: 'Biologische Bilgenbehandlung',
    },
    description: {
      en: 'BioBilge Active uses a blend of naturally selected microorganisms to digest hydrocarbon contamination in bilge water. Produces no hazardous by-products. Enhances oil-water separator performance and reduces odour naturally.',
      pl: 'BioBilge Active wykorzystuje naturalnie wyselekcjonowane mikroorganizmy do rozkładu zanieczyszczeń węglowodorowych w wodzie zęzowej.',
      de: 'BioBilge Active nutzt natürlich selektierte Mikroorganismen zum Abbau von Kohlenwasserstoffkontaminationen im Bilgenwasser.',
    },
    zones: ['bilge', 'engine_room'],
    tags: ['biological', 'bilge', 'microorganisms', 'eco', 'hydrocarbon', 'natural', 'biodegradation'],
    isBiological: true,
    dosage: { baseConc: 5, unit: 'ml/L', notesEn: 'Add weekly. Best results at water temperature 15–35°C.' },
    category: 'Biological',
  },
  {
    id: '16', slug: 'biofresh-marine',
    name: { en: 'BioFresh Marine', pl: 'BioFresh Marine', de: 'BioFresh Marine' },
    shortDesc: {
      en: 'Biological drain & surface treatment', pl: 'Biologiczny środek do odpływów i powierzchni', de: 'Biologische Abfluss- & Oberflächenbehandlung',
    },
    description: {
      en: 'BioFresh Marine uses probiotic bacteria to break down organic waste in drains, grey water tanks and sewage treatment plants. Eliminates odour at the source. Safe for crew, sealife and all plumbing materials.',
      pl: 'BioFresh Marine używa bakterii probiotycznych do rozkładu odpadów organicznych w odpływach i zbiornikach szarych wód. Eliminuje nieprzyjemne zapachy.',
      de: 'BioFresh Marine nutzt probiotische Bakterien zum Abbau organischer Abfälle in Abflüssen und Abwasseranlagen. Geruchseliminierung an der Quelle.',
    },
    zones: ['accommodation', 'galley'],
    tags: ['biological', 'probiotic', 'drain', 'odour', 'grey water', 'sewage', 'organic', 'eco'],
    isBiological: true,
    dosage: { baseConc: 10, unit: 'ml/L', notesEn: 'Apply weekly to drains. Do not mix with chemical disinfectants.' },
    category: 'Biological',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.slug === slug)
}

export function getProductsByZone(zone: ZoneId): Product[] {
  return MOCK_PRODUCTS.filter(p => p.zones.includes(zone))
}

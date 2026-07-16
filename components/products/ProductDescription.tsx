import type { ReactNode } from 'react'

interface Props {
  text: string
  locale: string
}

// ── Sierotki fix ─────────────────────────────────────────────────────────────
// Insert NBSP after short Polish/English conjunctions so they don't end a line
const NBSP = ' '

function fixOrphans(str: string): string {
  return str
    .replace(/ ([aiouz]) /gi,     (_, w) => ` ${w}${NBSP}`)
    .replace(/ (do|od|po|na|za|we|ze|bo|co|to|by|ku|lub|czy|nie|ale|jak|gdy|oraz|nad|pod|ani|bez|dla|już|też|więc|lecz|albo) /gi, (_, w) => ` ${w}${NBSP}`)
    .replace(/ (in|is|it|of|on|or|to|an|at|as|if|by|be|no|up) /gi,           (_, w) => ` ${w}${NBSP}`)
}

// ── Section detection ─────────────────────────────────────────────────────────
const SECTION_MARKERS: { key: string; re: RegExp }[] = [
  { key: 'features', re: /Key features?:|Główne cechy:|Cechy:|Features:/i },
  { key: 'usage',    re: /How to use:|Sposób (użycia|stosowania):|Application:/i },
  { key: 'avail',   re: /Available (format|as):|Dostępn[ya] (format|w):/i },
]

interface Section { key: string; content: string }

function parseSections(text: string): { intro: string; sections: Section[] } {
  type Hit = { key: string; start: number; end: number }
  const hits: Hit[] = []
  for (const { key, re } of SECTION_MARKERS) {
    const m = re.exec(text)
    if (m) hits.push({ key, start: m.index, end: m.index + m[0].length })
  }
  hits.sort((a, b) => a.start - b.start)

  if (hits.length === 0) return { intro: text.trim(), sections: [] }

  const intro = text.slice(0, hits[0].start).trim()
  const sections: Section[] = hits.map((h, i) => ({
    key: h.key,
    content: text.slice(h.end, hits[i + 1]?.start ?? text.length).trim(),
  }))
  return { intro, sections }
}

// ── Feature items ─────────────────────────────────────────────────────────────
// Split run-on feature list (bullet points merged into plain text) into items.
// Items are not separated by periods — they start with a new capital word
// directly after a lowercase letter or comma.
function splitFeatures(text: string): string[] {
  return text
    .split(/(?<=[a-ząćęłńóśźżA-Z\d,.])\s+(?=[A-ZŁŚĆŃŹŻ][a-ząćęłńóśźż])/)
    .map(s => s.trim())
    .filter(Boolean)
}

// ── Labels ────────────────────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  features: { en: 'Key Features',  pl: 'Cechy produktu',     de: 'Produkteigenschaften' },
  usage:    { en: 'How to Use',    pl: 'Sposób stosowania',   de: 'Anwendung'            },
  avail:    { en: 'Availability',  pl: 'Dostępność',          de: 'Verfügbarkeit'        },
}
function label(key: string, locale: string) {
  return LABELS[key]?.[locale] ?? LABELS[key]?.en ?? key
}

// ── Styles ────────────────────────────────────────────────────────────────────
const paraStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--fg)',
  lineHeight: 1.75,
  fontSize: '.95rem',
  textAlign: 'justify',
  hyphens: 'auto',
  overflowWrap: 'break-word',
}

const headStyle: React.CSSProperties = {
  margin: '1.25rem 0 .6rem',
  fontSize: '.7rem',
  fontWeight: 700,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  borderBottom: '1px solid var(--border)',
  paddingBottom: '.35rem',
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '.45rem',
}

const itemStyle: React.CSSProperties = {
  color: 'var(--fg)',
  lineHeight: 1.65,
  fontSize: '.92rem',
  textAlign: 'justify',
  hyphens: 'auto',
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ProductDescription({ text, locale }: Props): ReactNode {
  const loc = locale as 'en' | 'pl' | 'de'
  const { intro, sections } = parseSections(text)

  return (
    <div>
      {intro && (
        <p lang={loc} style={paraStyle}>{fixOrphans(intro)}</p>
      )}

      {sections.map(({ key, content }) => {
        if (!content) return null
        const items = key === 'features' ? splitFeatures(content) : null

        return (
          <div key={key}>
            <p style={headStyle}>{label(key, loc)}</p>

            {items && items.length > 1 ? (
              <ul style={listStyle}>
                {items.map((item, i) => (
                  <li key={i} lang={loc} style={itemStyle}>{fixOrphans(item)}</li>
                ))}
              </ul>
            ) : (
              <p lang={loc} style={{ ...paraStyle, marginTop: 0 }}>{fixOrphans(content)}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

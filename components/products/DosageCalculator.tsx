'use client'

import { useState } from 'react'
import { calculateDosage } from '@/lib/dosage'
import type { Product } from '@/lib/mock-products'

interface Props {
  dosage: Product['dosage']
  ui: { title: string; tankVolume: string; result: string; concentration: string }
}

export function DosageCalculator({ dosage, ui }: Props) {
  const [volume, setVolume] = useState('')
  const numVol = parseFloat(volume) || 0
  const result = calculateDosage({ tankVolume: numVol, baseConc: dosage.baseConc, unit: dosage.unit })

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" width="18" height="18">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
        </svg>
        {ui.title}
      </h3>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--fg-muted)', marginBottom: '.35rem' }}>
            {ui.tankVolume}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={volume}
            onChange={e => setVolume(e.target.value)}
            placeholder="e.g. 1000"
            style={{ width: '100%', padding: '.55rem .75rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.9rem', color: 'var(--fg)', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--fg-muted)', marginBottom: '.35rem' }}>
            {ui.concentration}
          </label>
          <div style={{ padding: '.55rem .75rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.9rem', color: 'var(--fg-muted)' }}>
            {dosage.baseConc} {dosage.unit}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--fg-muted)', marginBottom: '.35rem' }}>
            {ui.result}
          </label>
          <div style={{ padding: '.55rem .75rem', background: numVol > 0 ? 'var(--accent)' : 'var(--bg-card2)', border: `1px solid ${numVol > 0 ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, fontSize: '.95rem', fontWeight: 700, color: numVol > 0 ? 'var(--accent-fg)' : 'var(--fg-muted)', transition: 'all .2s' }}>
            {numVol > 0 ? result.label : '—'}
          </div>
        </div>
      </div>

      {dosage.notesEn && (
        <p style={{ margin: '.85rem 0 0', fontSize: '.8rem', color: 'var(--fg-muted)', borderTop: '1px solid var(--border)', paddingTop: '.75rem' }}>
          {dosage.notesEn}
        </p>
      )}
    </div>
  )
}

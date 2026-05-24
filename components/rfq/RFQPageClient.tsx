'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRFQStore } from '@/lib/rfq-store'

interface UI {
  title: string
  empty: string
  portOfDelivery: string
  vesselName: string
  imoNumber: string
  email: string
  notes: string
  quantity: string
  send: string
  sending: string
  success: string
  error: string
  browseProducts: string
  remove: string
  clearAll: string
  product: string
  unit: string
  deliveryDetails: string
}

interface Props {
  ui: UI
  locale: string
  formspreeId: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.5rem .75rem',
  background: 'var(--bg-card2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: '.875rem',
  color: 'var(--fg)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '.78rem',
  fontWeight: 600,
  color: 'var(--fg-muted)',
  marginBottom: '.3rem',
  textTransform: 'uppercase',
  letterSpacing: '.04em',
}

export function RFQPageClient({ ui, locale, formspreeId }: Props) {
  const { items, portOfDelivery, vesselName, imoNumber, email, remove, update, setField, clear } = useRFQStore()
  const [globalNotes, setGlobalNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formspreeId || items.length === 0) return
    setStatus('sending')

    const body = {
      email,
      portOfDelivery,
      vesselName,
      imoNumber,
      notes: globalNotes,
      items: items.map(i => `${i.name} — qty: ${i.quantity} ${i.unit}${i.notes ? ` (${i.notes})` : ''}`).join('\n'),
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus('success')
        clear()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: 'var(--fg)', marginBottom: '.5rem' }}>{ui.success}</h2>
        <Link href={`/${locale}/products`} className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
          {ui.browseProducts}
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{ui.empty}</p>
        <Link href={`/${locale}/products`} className="btn-primary" style={{ display: 'inline-block' }}>
          {ui.browseProducts}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.25rem' }}>
            <span style={{ fontSize: '.8rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
              {items.length} {items.length === 1 ? ui.product : `${ui.product}s`}
            </span>
            <button type="button" onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.78rem', color: 'var(--fg-muted)', textDecoration: 'underline', padding: 0 }}>
              {ui.clearAll}
            </button>
          </div>

          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: '1rem', display: 'grid', gap: '.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                <Link href={`/${locale}/products/${item.slug}`} style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--fg)', textDecoration: 'none' }}>
                  {item.name}
                </Link>
                <button type="button" onClick={() => remove(item.id)} aria-label={ui.remove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '1rem', lineHeight: 1, padding: '2px 4px', borderRadius: 4, flexShrink: 0 }}>
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                <div>
                  <label style={labelStyle}>{ui.quantity}</label>
                  <div style={{ display: 'flex', gap: '.4rem' }}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={e => update(item.id, { quantity: e.target.value })}
                      style={{ ...inputStyle, width: '70%' }}
                    />
                    <select
                      value={item.unit}
                      onChange={e => update(item.id, { unit: e.target.value })}
                      style={{ ...inputStyle, width: '30%', padding: '.5rem .35rem' }}
                    >
                      {['L', 'kg', 'pcs', 'drum'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{ui.notes}</label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={e => update(item.id, { notes: e.target.value })}
                    placeholder="..."
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: delivery form */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>{ui.deliveryDetails}</h2>

          <div>
            <label style={labelStyle}>{ui.email} *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setField('email', e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>{ui.portOfDelivery}</label>
            <input
              type="text"
              value={portOfDelivery}
              onChange={e => setField('portOfDelivery', e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>{ui.vesselName}</label>
            <input
              type="text"
              value={vesselName}
              onChange={e => setField('vesselName', e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>{ui.imoNumber}</label>
            <input
              type="text"
              value={imoNumber}
              onChange={e => setField('imoNumber', e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div>
            <label style={labelStyle}>{ui.notes}</label>
            <textarea
              value={globalNotes}
              onChange={e => setGlobalNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {status === 'error' && (
            <p style={{ margin: 0, fontSize: '.82rem', color: '#ef4444', padding: '.5rem .75rem', background: '#ef444415', borderRadius: 8 }}>
              {ui.error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || !email}
            className="btn-primary"
            style={{ width: '100%', opacity: (status === 'sending' || !email) ? .6 : 1 }}
          >
            {status === 'sending' ? ui.sending : ui.send}
          </button>
        </div>
      </div>
    </form>
  )
}

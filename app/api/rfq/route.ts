import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { items, portOfDelivery, vesselName, imoNumber, email } = body

  if (!email || !items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const itemsHtml = items
    .map(
      (item: { name: string; quantity: string; unit: string; notes: string }) =>
        `<tr>
          <td style="padding:8px;border:1px solid #e2e8f0">${item.name}</td>
          <td style="padding:8px;border:1px solid #e2e8f0">${item.quantity} ${item.unit}</td>
          <td style="padding:8px;border:1px solid #e2e8f0">${item.notes || '—'}</td>
        </tr>`
    )
    .join('')

  const html = `
    <h2>New RFQ from DG Marine website</h2>
    <p><strong>Vessel:</strong> ${vesselName || '—'}</p>
    <p><strong>IMO:</strong> ${imoNumber || '—'}</p>
    <p><strong>Port of delivery:</strong> ${portOfDelivery || '—'}</p>
    <p><strong>Contact:</strong> ${email}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Product</th>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Qty</th>
          <th style="padding:8px;border:1px solid #e2e8f0;text-align:left">Notes</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
  `

  try {
    await resend.emails.send({
      from: 'noreply@dgmarine.pl',
      to: process.env.RFQ_TO_EMAIL!,
      replyTo: email,
      subject: `RFQ – ${vesselName || email}`,
      html,
    })

    await resend.emails.send({
      from: 'noreply@dgmarine.pl',
      to: email,
      subject: 'Your RFQ has been received – DG Marine',
      html: '<p>Thank you. We have received your request and will reply shortly.</p>',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

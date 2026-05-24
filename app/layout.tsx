import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { template: '%s | DG Marine', default: 'DG Marine' },
  description: 'Professional chemical solutions for the maritime industry',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

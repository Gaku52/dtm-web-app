import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DTM Web App',
  description: 'Web-based DTM composition application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

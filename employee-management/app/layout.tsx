import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmpTrack',
  description: 'my creation',
  generator: 'EmpTrack.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

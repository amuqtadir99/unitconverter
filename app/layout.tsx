import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const siteName = 'Convertly'
const description =
  'A modern, immersive unit converter for length, mass, volume, temperature, ' +
  'data, energy, speed and more. Fast, accurate and mobile-first.'

export const metadata: Metadata = {
  metadataBase: new URL('https://convertly.app'),
  title: {
    default: `${siteName} · Modern Unit Converter`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    'unit converter',
    'metric imperial converter',
    'length converter',
    'temperature converter',
    'data storage converter',
    'online converter',
  ],
  authors: [{ name: siteName }],
  openGraph: {
    type: 'website',
    siteName,
    title: `${siteName} · Modern Unit Converter`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} · Modern Unit Converter`,
    description,
  },
  robots: { index: true, follow: true },
  category: 'utilities',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ebeeff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a1e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable}`}>
        <div className="aurora" aria-hidden />
        <div className="aurora-grid" aria-hidden />
        {children}
      </body>
    </html>
  )
}

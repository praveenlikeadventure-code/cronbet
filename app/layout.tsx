import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Providers } from './providers'
import { type Locale, languages, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CRONBET - Best Betting Sites Comparison 2024',
    template: '%s | CRONBET',
  },
  description:
    'Compare the best online betting sites. Expert reviews of 1xBet, Melbet, 22Bet, LeonBet, Mostbet, Bet365 and more. Find the best bonuses and odds.',
  metadataBase: new URL('https://cronbet.com'),
  openGraph: {
    type: 'website',
    siteName: 'CRONBET',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const raw = cookieStore.get(LOCALE_COOKIE)?.value
  const locale: Locale = raw && SUPPORTED_LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE
  const { dir } = languages[locale]

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.className} bg-[#0a0e1a] text-white antialiased`}>
        <Providers initialLocale={locale}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

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
  metadataBase: new URL('https://www.cronbets.com'),
  title: {
    default: 'CronBets - Best Betting Sites Comparison 2026',
    template: '%s | CronBets',
  },
  description:
    'Compare the best betting sites in India 2026. Find top bonuses from 1xBet, Melbet, 22Bet and more. Expert reviews and exclusive welcome offers.',
  keywords: [
    'betting sites india',
    'best betting apps',
    '1xbet india',
    'melbet bonus',
    'cricket betting',
    'ipl betting sites',
    'online betting india 2026',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.cronbets.com',
    siteName: 'CronBets',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cronbets',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: 'PASTE_YOUR_GSC_CODE_HERE',
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

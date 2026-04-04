export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import GeoAwarePlatforms from '@/components/GeoAwarePlatforms'
import { Shield, Star, TrendingUp, Users } from 'lucide-react'
import { type Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, getTranslations } from '@/lib/i18n'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'

export const metadata: Metadata = {
  title: 'CRONBET - Best Betting Sites Comparison 2024',
  description:
    'Compare the best online betting sites. Expert reviews of 1xBet, Melbet, 22Bet and more. Find the biggest bonuses and best odds for 2024.',
}

export default async function HomePage() {
  const cookieStore = cookies()
  const raw = cookieStore.get(LOCALE_COOKIE)?.value
  const locale: Locale = raw && SUPPORTED_LOCALES.includes(raw as Locale) ? (raw as Locale) : DEFAULT_LOCALE
  const t = getTranslations(locale)

  const rawPlatforms = await prisma.bettingPlatform.findMany({ where: { isActive: true }, orderBy: { rank: 'asc' } })
  const parsedPlatforms = parsePlatforms(rawPlatforms as Record<string, unknown>[])

  // SSR: use DEFAULT offers — client will upgrade to geo-specific after detection
  const geoOffers = await getGeoOffersForPlatforms(parsedPlatforms.map((p) => p.id), 'DEFAULT')
  const platforms = parsedPlatforms.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))

  const featured = platforms.filter((p) => p.isFeatured)

  const faqs = [
    {
      q: 'How do we choose the best betting sites?',
      a: 'We evaluate each platform based on licensing, welcome bonus value, sports coverage, odds quality, payment methods, mobile experience, and customer support. Every review is conducted independently.',
    },
    {
      q: 'Are these betting sites safe to use?',
      a: 'All platforms we recommend hold valid gambling licenses. However, always verify your local laws before signing up. We recommend only betting what you can afford to lose.',
    },
    {
      q: 'How do affiliate links work?',
      a: 'We may earn a commission when you sign up through our links. This does not affect our ratings or recommendations — we always prioritize honest, independent reviews.',
    },
    {
      q: 'What is the best welcome bonus available?',
      a: '22Bet offers the highest welcome bonus at 100% up to $300. Mostbet follows with 125% up to $300. Always check wagering requirements before claiming any bonus.',
    },
    {
      q: 'Which betting site has the best mobile app?',
      a: 'Bet365 and 1xBet are widely considered to have the best mobile apps, with fast performance, live streaming, and full feature sets on iOS and Android.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1629] to-[#0a0e1a] py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 text-sm text-yellow-400">
            <Star size={14} fill="currentColor" />
            {t.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {t.hero.titleBefore}{' '}
            <span className="text-yellow-400">{t.hero.titleHighlight}</span>{' '}
            {t.hero.titleAfter}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              {t.hero.compareBtn}
            </Link>
            <Link
              href="/best-bonuses"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              {t.hero.bonusesBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-y border-white/5 bg-[#0d1225]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '100K+', label: t.stats.monthlyVisitors },
            { icon: Star, value: '8+', label: t.stats.sitesReviewed },
            { icon: TrendingUp, value: '$500+', label: t.stats.bestBonus },
            { icon: Shield, value: '100%', label: t.stats.independentReviews },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon size={24} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Geo-aware Featured + Comparison Table (client component upgrades offers after geo detection) */}
      <GeoAwarePlatforms
        initialPlatforms={platforms}
        initialFeatured={featured}
        featuredTitle={t.sections.top5Title}
        featuredSubtitle={t.sections.top5Subtitle}
        allTitle={t.sections.allSitesTitle}
        allSubtitle={t.sections.allSitesSubtitle}
        viewAllLabel={t.sections.viewAll}
      />

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">{t.sections.faqTitle}</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible Gambling Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#0f1629] border border-yellow-400/20 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <Shield size={40} className="text-yellow-400 shrink-0" />
          <div>
            <h3 className="text-white font-bold mb-1">{t.responsible.title}</h3>
            <p className="text-gray-400 text-sm">
              {t.responsible.description}{' '}
              <a href="https://www.gamblingtherapy.org" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                GamblingTherapy.org
              </a>
            </p>
          </div>
          <Link
            href="/responsible-gambling"
            className="shrink-0 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {t.responsible.learnMore}
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CRONBET',
            url: 'https://cronbet.com',
            description: 'Compare the best online betting sites',
          }),
        }}
      />
    </>
  )
}

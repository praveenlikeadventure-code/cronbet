export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'
import { Trophy, Shield, CheckCircle2 } from 'lucide-react'
import GeoAwareSportsPlatforms from '@/components/GeoAwareSportsPlatforms'
import GeoGuard from '@/components/GeoGuard'

export const metadata: Metadata = {
  title: 'Best Cricket Betting Sites in India 2026 | CronBets',
  description:
    'Compare the best cricket betting sites in India 2026. Top platforms for Test, ODI, T20, and IPL betting with huge welcome bonuses and live odds.',
  keywords: [
    'cricket betting sites',
    'cricket betting india',
    'best cricket betting app',
    'online cricket betting 2026',
    'cricket satta',
    'cricket betting tips india',
  ],
  openGraph: {
    title: 'Best Cricket Betting Sites in India 2026 | CronBets',
    description: 'Top platforms for cricket betting — Test, ODI, T20, and IPL with live in-play markets.',
    url: 'https://www.cronbets.com/cricket-betting',
  },
}

const betTypes = [
  { type: 'Match Winner', desc: 'Bet on which team wins the match — the most popular cricket market.' },
  { type: 'Top Batsman', desc: 'Which player will score the most runs in an innings or match.' },
  { type: 'Top Bowler', desc: 'Which player will take the most wickets in an innings or match.' },
  { type: 'Total Runs', desc: 'Will the total runs scored be over or under a specified line?' },
  { type: 'Man of the Match', desc: 'Predict which player will earn the Man of the Match award.' },
  { type: 'Live In-Play', desc: 'Bet on every delivery, over, and session during live matches.' },
]

const faqs = [
  {
    q: 'What are the best cricket betting sites in 2026?',
    a: '1xBet, Melbet, 22Bet, and Mostbet are among the best cricket betting sites globally in 2026. They all offer extensive cricket markets, live betting, and localised payment options for players worldwide.',
  },
  {
    q: 'Is cricket betting legal in India?',
    a: 'Online betting regulation in India is state-specific. Offshore platforms are widely used but operate in a legal grey area in most states. Goa, Daman, and Sikkim have licensed gambling. Always check your local laws.',
  },
  {
    q: 'How do I bet on cricket online?',
    a: 'Choose a platform from our list, register, deposit using your preferred local payment method, go to the Cricket section, select your match, and place your bet. It takes under 5 minutes to start.',
  },
  {
    q: 'Which cricket betting site has the best bonuses?',
    a: '22Bet offers up to 100% welcome bonus, Mostbet gives 125%, and 1xBet regularly runs cricket-specific promotions during major tournaments like the IPL and T20 World Cup. Geo-specific offers may vary.',
  },
  {
    q: 'Can I bet on cricket live (in-play)?',
    a: 'Yes, all top platforms offer live cricket betting. 1xBet and Bet365 are considered the best for live cricket markets with fast odds updates ball-by-ball.',
  },
]

export default async function CricketBettingPage() {
  const [rawPlatforms, geoRule] = await Promise.all([
    prisma.bettingPlatform.findMany({ where: { isActive: true }, orderBy: { rank: 'asc' }, take: 8 }),
    prisma.pageGeoRule.findUnique({ where: { pagePath: '/cricket-betting' } }),
  ])
  const parsedPlatforms = parsePlatforms(rawPlatforms as Record<string, unknown>[])

  // SSR: DEFAULT geo — GeoAwareSportsPlatforms upgrades client-side after detection
  const geoOffers = await getGeoOffersForPlatforms(parsedPlatforms.map((p) => p.id), 'DEFAULT')
  const platforms = parsedPlatforms.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))

  const allowedCountries: string[] =
    geoRule?.isRestricted ? JSON.parse(geoRule.allowedCountries || '[]') : []

  return (
    <GeoGuard allowedCountries={allowedCountries}>
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1629] to-[#0a0e1a] py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 text-sm text-yellow-400">
            <Trophy size={14} />
            Cricket Betting Guide 2026
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Best <span className="text-yellow-400">Cricket Betting</span> Sites 2026
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Reviewed and ranked: top platforms for Test, ODI, T20, and IPL betting with live in-play markets and local payment support worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ipl-betting"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              IPL Betting Sites
            </Link>
            <Link
              href="/best-bonuses"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              Best Cricket Bonuses
            </Link>
          </div>
        </div>
      </section>

      {/* Geo-aware platform list */}
      <GeoAwareSportsPlatforms
        initialPlatforms={platforms}
        listTitle="Top Cricket Betting Sites"
        listSubtitleBase="Ranked by cricket markets, live odds, and local payment options"
      />

      {/* Types of Cricket Bets */}
      <section className="bg-[#0d1225] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Types of Cricket Bets</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {betTypes.map(({ type, desc }) => (
              <div key={type} className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex gap-3">
                <CheckCircle2 size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">{type}</div>
                  <div className="text-gray-400 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Cricket Betting FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible gambling */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-[#0f1629] border border-yellow-400/20 rounded-xl p-6 flex items-start gap-4">
          <Shield size={32} className="text-yellow-400 shrink-0 mt-1" />
          <div>
            <p className="text-white font-bold mb-1">Gamble Responsibly</p>
            <p className="text-gray-400 text-sm">
              Betting should be entertainment. Set limits and never bet more than you can afford to lose. For support visit{' '}
              <a href="https://www.gamblingtherapy.org" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                GamblingTherapy.org
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.cronbets.com' },
                { '@type': 'ListItem', position: 2, name: 'Cricket Betting', item: 'https://www.cronbets.com/cricket-betting' },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            },
          ]),
        }}
      />
    </div>
    </GeoGuard>
  )
}

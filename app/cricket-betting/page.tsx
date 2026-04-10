export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'
import { Star, Trophy, Shield, CheckCircle2 } from 'lucide-react'

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
    description: 'Top platforms for cricket betting in India — Test, ODI, T20, and IPL with live in-play markets.',
    url: 'https://www.cronbets.com/cricket-betting',
  },
}

const features = [
  { icon: Trophy, title: 'IPL & T20 Coverage', desc: 'All IPL matches, BBL, PSL, T20 World Cup with live in-play betting.' },
  { icon: Star, title: 'Best Cricket Odds', desc: 'Compare odds across platforms — top sites offer 96–98% cricket payout rates.' },
  { icon: Shield, title: 'Secure INR Deposits', desc: 'UPI, Paytm, PhonePe, NetBanking — instant deposits, 24h withdrawals.' },
]

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
    q: 'What are the best cricket betting sites in India 2026?',
    a: '1xBet, Melbet, 22Bet, and Mostbet are among the best cricket betting sites for Indian users in 2026. They all offer extensive cricket markets, live betting, and INR payment options.',
  },
  {
    q: 'Is cricket betting legal in India?',
    a: 'Online betting regulation in India is state-specific. Offshore platforms are widely used but operate in a legal grey area in most states. Goa, Daman, and Sikkim have licensed gambling. Always check local laws.',
  },
  {
    q: 'How do I bet on cricket online in India?',
    a: 'Choose a platform from our list, register, deposit via UPI or NetBanking, go to the Cricket section, select your match, and place your bet. It takes under 5 minutes to start.',
  },
  {
    q: 'Which cricket betting site has the best bonuses?',
    a: '22Bet offers up to 100% welcome bonus, Mostbet gives 125%, and 1xBet regularly runs cricket-specific promotions during major tournaments like the IPL and T20 World Cup.',
  },
  {
    q: 'Can I bet on cricket live (in-play) in India?',
    a: 'Yes, all top platforms offer live cricket betting. 1xBet and Bet365 are considered the best for live cricket markets with fast odds updates ball-by-ball.',
  },
]

export default async function CricketBettingPage() {
  const rawPlatforms = await prisma.bettingPlatform.findMany({
    where: { isActive: true },
    orderBy: { rank: 'asc' },
    take: 5,
  })
  const parsedPlatforms = parsePlatforms(rawPlatforms as Record<string, unknown>[])
  const geoOffers = await getGeoOffersForPlatforms(parsedPlatforms.map((p) => p.id), 'DEFAULT')
  const platforms = parsedPlatforms.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))

  return (
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
            Best <span className="text-yellow-400">Cricket Betting</span> Sites in India 2026
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Reviewed and ranked: top platforms for Test, ODI, T20, and IPL betting with live in-play markets and INR support.
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

      {/* Features */}
      <section className="border-y border-white/5 bg-[#0d1225]">
        <div className="max-w-4xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <Icon size={28} className="text-yellow-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-1">{title}</div>
              <div className="text-gray-400 text-sm">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top 5 Platforms */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
          Top Cricket Betting Sites
        </h2>
        <p className="text-gray-400 text-center mb-10">Ranked by cricket markets, odds, and India-friendly payment options</p>

        <div className="space-y-4">
          {platforms.map((platform, i) => (
            <div
              key={platform.id}
              className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-yellow-400/30 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-2xl font-extrabold text-yellow-400 w-8 shrink-0">#{i + 1}</span>
                {platform.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={platform.logo} alt={platform.name} className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1" width={48} height={48} />
                )}
                <div className="min-w-0">
                  <div className="font-bold text-white text-lg">{platform.name}</div>
                  <div className="text-yellow-400 text-sm font-semibold">{platform.bonusText}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < Math.floor(platform.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">{platform.rating}/5</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/review/${platform.slug}`}
                className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Get Bonus
              </Link>
            </div>
          ))}
        </div>
      </section>

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
  )
}

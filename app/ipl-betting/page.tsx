export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'
import { Shield, Trophy, CheckCircle2 } from 'lucide-react'
import GeoAwareSportsPlatforms from '@/components/GeoAwareSportsPlatforms'
import GeoGuard from '@/components/GeoGuard'

export const metadata: Metadata = {
  title: 'Best IPL Betting Sites 2026 - Top Apps for IPL Season',
  description:
    'Find the best IPL betting sites in India for IPL 2026. Compare top apps for IPL match betting with exclusive welcome bonuses, live odds, and fast payouts.',
  keywords: [
    'IPL betting',
    'IPL betting sites India',
    'best app for IPL betting 2026',
    'IPL 2026 betting',
    'cricket betting IPL',
    'IPL match prediction',
  ],
  openGraph: {
    title: 'Best IPL Betting Sites 2026 | CronBets',
    description: 'Compare top IPL betting apps with exclusive bonuses for IPL 2026 season.',
    url: 'https://www.cronbets.com/ipl-betting',
  },
}

const faqs = [
  {
    q: 'Which is the best app for IPL betting in 2026?',
    a: '1xBet and Melbet are among the best apps for IPL betting in 2026. They offer live in-play betting, fast odds updates during matches, and dedicated cricket sections with pre-match and live markets.',
  },
  {
    q: 'Is IPL betting legal in India?',
    a: 'Online betting regulation varies by state in India. Offshore platforms like 1xBet and 22Bet are widely used by Indian bettors. Always check your local laws before placing bets.',
  },
  {
    q: 'What types of IPL bets can I place?',
    a: 'You can bet on match winner, top batsman, top bowler, total runs, sixes, man of the match, and live in-play markets during each IPL game.',
  },
  {
    q: 'How do I claim an IPL betting bonus?',
    a: 'Sign up through our links, make your first deposit, and the welcome bonus is credited automatically on most platforms. Check wagering requirements (typically 5-10x for sports) before withdrawing.',
  },
  {
    q: 'Which payment methods work for IPL betting?',
    a: 'UPI, Paytm, PhonePe, and NetBanking work well for Indian users. International users can use credit/debit cards, e-wallets (Skrill, Neteller), and cryptocurrency. Most platforms process deposits instantly.',
  },
  {
    q: 'Can I bet on IPL on mobile?',
    a: 'Yes, all top platforms have iOS and Android apps. 1xBet and Melbet both have highly rated mobile apps with full IPL betting features including live streaming on select matches.',
  },
  {
    q: 'What is the minimum deposit to start IPL betting?',
    a: 'Most platforms accept small deposits — 1xBet minimum is as low as $1. Exact minimums vary by country and payment method.',
  },
  {
    q: 'How do I withdraw IPL betting winnings?',
    a: 'Withdrawals are processed to your preferred payment method — bank transfer, e-wallet, or crypto. Most platforms process withdrawals within 24 hours after KYC verification.',
  },
  {
    q: 'Which IPL betting site has the best odds?',
    a: 'Bet365 and 1xBet consistently offer the best cricket odds with low margins. Compare odds across platforms before placing large bets to maximise returns.',
  },
  {
    q: 'Are winnings from IPL betting taxable?',
    a: 'Tax treatment of betting winnings varies by country. In India, winnings are taxable at 30% under "Income from other sources". Consult a local tax advisor for your specific situation.',
  },
]

const bettingTips = [
  { tip: 'Check pitch report', desc: 'Pitch conditions heavily influence IPL outcomes — look for pitch reports 24h before the match.' },
  { tip: 'Follow team news', desc: 'Player injuries and last-minute lineup changes can shift odds significantly.' },
  { tip: 'Bet in-play', desc: 'Live betting during powerplay overs often offers better value than pre-match markets.' },
  { tip: 'Compare odds', desc: 'Always compare odds across 2-3 platforms before placing. A 5% better price compounds over a season.' },
  { tip: 'Manage your bankroll', desc: 'Never bet more than 2-5% of your total bankroll on a single IPL match.' },
]

export default async function IPLBettingPage() {
  const rawPlatforms = await prisma.bettingPlatform.findMany({
    where: { isActive: true },
    orderBy: { rank: 'asc' },
    take: 8,
  })
  const parsedPlatforms = parsePlatforms(rawPlatforms as Record<string, unknown>[])

  // SSR: DEFAULT geo — GeoAwareSportsPlatforms upgrades client-side after detection
  // Defensive: PlatformGeoOffer table may not exist yet on first deploy after schema change
  let platforms = parsedPlatforms
  try {
    const geoOffers = await getGeoOffersForPlatforms(parsedPlatforms.map((p) => p.id), 'DEFAULT')
    platforms = parsedPlatforms.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))
  } catch {
    // Table not yet migrated — use platforms without geo offer overrides
  }

  // Defensive: PageGeoRule table may not exist yet on first deploy after schema change
  let allowedCountries: string[] = []
  try {
    const geoRule = await prisma.pageGeoRule.findUnique({ where: { pagePath: '/ipl-betting' } })
    if (geoRule?.isRestricted) {
      allowedCountries = JSON.parse(geoRule.allowedCountries || '[]')
    }
  } catch {
    // Table not yet migrated — show page to everyone
  }

  return (
    <GeoGuard allowedCountries={allowedCountries}>
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1629] to-[#0a0e1a] py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 text-sm text-yellow-400">
            <Trophy size={14} />
            IPL 2026 Season
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Best <span className="text-yellow-400">IPL Betting</span> Sites 2026
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Top apps for IPL match betting with exclusive welcome bonuses, live in-play odds, and fast local payouts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              Compare All Sites
            </Link>
            <Link
              href="/best-bonuses"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors"
            >
              View IPL Bonuses
            </Link>
          </div>
        </div>
      </section>

      {/* Geo-aware platform list + bonus cards */}
      <GeoAwareSportsPlatforms
        initialPlatforms={platforms}
        listTitle="Top IPL Betting Platforms"
        listSubtitleBase="Ranked by cricket coverage, live odds, and local payment options"
        showBonusCards={true}
        bonusSectionTitle="Best IPL Betting Bonuses"
      />

      {/* How to Bet on IPL */}
      <section className="bg-[#0d1225] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-8 text-center">How to Bet on IPL Matches</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { step: '1', title: 'Choose a platform', desc: 'Pick from our top-rated IPL betting sites above and click "Get Bonus".' },
              { step: '2', title: 'Register & verify', desc: 'Create your account. Most platforms require basic KYC for withdrawals.' },
              { step: '3', title: 'Make a deposit', desc: 'Fund your account using your preferred local payment method.' },
              { step: '4', title: 'Navigate to Cricket', desc: 'Find the IPL section under Cricket > Tournaments > IPL 2026.' },
              { step: '5', title: 'Place your bet', desc: 'Select match winner, player performance, or live in-play markets.' },
              { step: '6', title: 'Withdraw winnings', desc: 'Cash out to your preferred payment method — most platforms process in 24h.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-yellow-400 text-black font-extrabold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">{title}</div>
                  <div className="text-gray-400 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IPL Betting Tips */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">IPL Betting Tips 2026</h2>
        <div className="space-y-3">
          {bettingTips.map(({ tip, desc }) => (
            <div key={tip} className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex gap-4">
              <CheckCircle2 size={20} className="text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white mb-1">{tip}</div>
                <div className="text-gray-400 text-sm">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">IPL Betting FAQ</h2>
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
              Betting should be fun. Never chase losses or bet more than you can afford. For support visit{' '}
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
                { '@type': 'ListItem', position: 2, name: 'IPL Betting', item: 'https://www.cronbets.com/ipl-betting' },
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

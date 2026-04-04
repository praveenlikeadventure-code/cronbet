export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Gift } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import GeoAwareBonuses from '@/components/GeoAwareBonuses'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'

export const metadata: Metadata = {
  title: 'Best Betting Bonuses 2024 - Top Welcome Offers',
  description:
    'Compare the best betting welcome bonuses available in 2024. Find the biggest deposit bonuses, free bets, and exclusive offers from top platforms.',
}

export default async function BestBonusesPage() {
  const rawPlatforms = await prisma.bettingPlatform.findMany({ where: { isActive: true }, orderBy: { rank: 'asc' } })
  const parsed = parsePlatforms(rawPlatforms as Record<string, unknown>[])

  // SSR with DEFAULT — client upgrades to geo-specific after detection
  const geoOffers = await getGeoOffersForPlatforms(parsed.map((p) => p.id), 'DEFAULT')
  const platforms = parsed.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-yellow-400">Home</a></li>
          <li>/</li>
          <li className="text-gray-300">Best Bonuses</li>
        </ol>
      </nav>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-4 text-sm text-green-400">
          <Gift size={14} />
          Exclusive welcome offers updated daily
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Best Betting Bonuses</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Claim the biggest welcome bonuses from top-rated betting platforms. All offers have been verified and include our affiliate links.
        </p>
      </div>

      <GeoAwareBonuses initialPlatforms={platforms} />

      <div className="mt-10 bg-[#0f1629] border border-yellow-400/20 rounded-xl p-5 text-center">
        <p className="text-gray-400 text-sm">
          <strong className="text-yellow-400">Disclaimer:</strong> Bonus offers are subject to change. Always read the full terms and conditions before claiming any bonus.
          This website contains affiliate links and we may receive compensation for sign-ups.
        </p>
      </div>
    </div>
  )
}

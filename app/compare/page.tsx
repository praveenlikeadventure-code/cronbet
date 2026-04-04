export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'
import GeoAwareCompare from '@/components/GeoAwareCompare'
import { getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'

export const metadata: Metadata = {
  title: 'Compare Betting Sites 2024 - Full Table',
  description:
    'Full comparison of all top betting sites. Sort by bonus, rating, min deposit, payout speed, and more. Find your perfect betting platform.',
}

export default async function ComparePage() {
  const rawPlatforms = await prisma.bettingPlatform.findMany({ where: { isActive: true }, orderBy: { rank: 'asc' } })
  const parsed = parsePlatforms(rawPlatforms as Record<string, unknown>[])

  // SSR with DEFAULT — client upgrades to geo-specific after detection
  const geoOffers = await getGeoOffersForPlatforms(parsed.map((p) => p.id), 'DEFAULT')
  const platforms = parsed.map((p) => applyGeoOffer(p, geoOffers.get(p.id)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-yellow-400">Home</a></li>
          <li>/</li>
          <li className="text-gray-300">Compare</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-3">Compare Betting Sites</h1>
      <p className="text-gray-400 mb-10 max-w-2xl">
        We compare {platforms.length} top betting platforms across bonus size, ratings, sports coverage, payment methods, and more.
        All data is independently verified.
      </p>

      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-4 sm:p-6">
        <GeoAwareCompare initialPlatforms={platforms} />
      </div>

      <p className="text-gray-500 text-xs mt-4">
        * Ratings and bonus offers are subject to change. Always check the platform&apos;s official website for current terms.
        This site contains affiliate links.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cronbet.com' },
              { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://cronbet.com/compare' },
            ],
          }),
        }}
      />
    </div>
  )
}

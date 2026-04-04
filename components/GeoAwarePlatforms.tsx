'use client'

import type { BettingPlatform } from '@/lib/types'
import { useGeoCurrency } from '@/hooks/useGeoCurrency'
import GeoDebugBanner from '@/components/GeoDebugBanner'
import PlatformCard from '@/components/platform/PlatformCard'
import ComparisonTable from '@/components/platform/ComparisonTable'

interface GeoAwarePlatformsProps {
  initialPlatforms: BettingPlatform[]
  initialFeatured: BettingPlatform[]
  featuredTitle: string
  featuredSubtitle: string
  allTitle: string
  allSubtitle: string
  viewAllLabel: string
}

export default function GeoAwarePlatforms({
  initialPlatforms,
  initialFeatured,
  featuredTitle,
  featuredSubtitle,
  allTitle,
  allSubtitle,
  viewAllLabel,
}: GeoAwarePlatformsProps) {
  // Combine into one geo update call, then split back out
  const combined = [...initialFeatured, ...initialPlatforms.filter((p) => !initialFeatured.find((f) => f.id === p.id))]
  const { platforms: updatedCombined, geo } = useGeoCurrency(combined)

  const featuredIds = new Set(initialFeatured.map((p) => p.id))
  const featured = updatedCombined.filter((p) => featuredIds.has(p.id))
  const platforms = updatedCombined

  return (
    <>
      <GeoDebugBanner geo={geo} />

      {/* Featured Top 5 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">{featuredTitle}</h2>
            <p className="text-gray-400 mt-1">
              {featuredSubtitle} {new Date().getFullYear()}
            </p>
          </div>
          <a href="/compare" className="text-yellow-400 hover:underline text-sm hidden sm:block">
            {viewAllLabel}
          </a>
        </div>
        <div className="space-y-4">
          {featured.map((platform, i) => (
            <PlatformCard key={platform.id} platform={platform} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Full Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-extrabold text-white mb-3">{allTitle}</h2>
        <p className="text-gray-400 mb-8">{allSubtitle}</p>
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-4 sm:p-6">
          <ComparisonTable platforms={platforms} />
        </div>
      </section>
    </>
  )
}

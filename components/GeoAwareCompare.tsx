'use client'

import type { BettingPlatform } from '@/lib/types'
import { useGeoCurrency } from '@/hooks/useGeoCurrency'
import { filterPlatformsWithFallback } from '@/lib/filterPlatformsByGeo'
import GeoDebugBanner from '@/components/GeoDebugBanner'
import ComparisonTable from '@/components/platform/ComparisonTable'

export default function GeoAwareCompare({ initialPlatforms }: { initialPlatforms: BettingPlatform[] }) {
  const { platforms: geoPlatforms, geo } = useGeoCurrency(initialPlatforms)

  const { platforms, usingFallback } = (geo && !geo.isDefault)
    ? filterPlatformsWithFallback(geoPlatforms, geo.countryCode)
    : { platforms: geoPlatforms, usingFallback: false }

  return (
    <>
      <GeoDebugBanner geo={geo} />
      {usingFallback && (
        <p className="text-yellow-400/70 text-sm mb-4 bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-4 py-2">
          Betting platforms may not be available in your region. Showing global options.
        </p>
      )}
      <ComparisonTable platforms={platforms} />
    </>
  )
}

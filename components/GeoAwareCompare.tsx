'use client'

import type { BettingPlatform } from '@/lib/types'
import { useGeoCurrency } from '@/hooks/useGeoCurrency'
import GeoDebugBanner from '@/components/GeoDebugBanner'
import ComparisonTable from '@/components/platform/ComparisonTable'

export default function GeoAwareCompare({ initialPlatforms }: { initialPlatforms: BettingPlatform[] }) {
  const { platforms, geo } = useGeoCurrency(initialPlatforms)

  return (
    <>
      <GeoDebugBanner geo={geo} />
      <ComparisonTable platforms={platforms} />
    </>
  )
}

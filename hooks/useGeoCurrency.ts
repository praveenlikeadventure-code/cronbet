'use client'

import { useState, useEffect, useRef } from 'react'
import { useGeo, type GeoInfo } from '@/hooks/useGeo'
import type { BettingPlatform } from '@/lib/types'
import type { PlatformGeoData } from '@/app/api/platforms/geo-data/route'

function applyGeoData(
  platforms: BettingPlatform[],
  geoData: Record<string, PlatformGeoData>,
): BettingPlatform[] {
  return platforms.map((p) => {
    const d = geoData[p.id]
    if (!d) return p
    return {
      ...p,
      bonusText: d.bonusText || p.bonusText,
      minDeposit: d.minDeposit || p.minDeposit,
      affiliateUrl: d.affiliateUrl || p.affiliateUrl,
    }
  })
}

/**
 * Detects the user's country (via useGeo) and returns geo-updated platforms.
 * SSR renders with the passed initialPlatforms; client upgrades after detection.
 */
export function useGeoCurrency(initialPlatforms: BettingPlatform[]): {
  platforms: BettingPlatform[]
  geo: GeoInfo | null
  isLoading: boolean
} {
  const { geo, isLoading } = useGeo()
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const lastCountry = useRef<string | null>(null)

  useEffect(() => {
    if (!geo || geo.isDefault) return
    if (geo.countryCode === lastCountry.current) return
    lastCountry.current = geo.countryCode

    fetch(`/api/platforms/geo-data?country=${geo.countryCode}`)
      .then((r) => r.json())
      .then((geoData: Record<string, PlatformGeoData>) => {
        setPlatforms(applyGeoData(initialPlatforms, geoData))
      })
      .catch(() => {})
  }, [geo, initialPlatforms])

  return { platforms, geo, isLoading }
}

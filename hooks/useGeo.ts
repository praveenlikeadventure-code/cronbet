'use client'

import { useState, useEffect } from 'react'
import { COUNTRIES } from '@/lib/geo-data'
import { getGeoCountry } from '@/lib/client-geo-data'

export interface GeoInfo {
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  flag: string
  isDefault: boolean
}

function buildGeoInfo(countryCode: string): GeoInfo {
  const code = countryCode.toUpperCase()
  const country = COUNTRIES.find((c) => c.code === code) ?? COUNTRIES.find((c) => c.code === 'DEFAULT')!
  return {
    countryCode: country.code,
    countryName: country.name,
    currencyCode: country.currency,
    currencySymbol: country.symbol,
    flag: country.flag,
    isDefault: country.code === 'DEFAULT',
  }
}

/**
 * Detects the user's country via browser-side ipapi.co call (real user IP).
 * Caches result in cookie for 24h. Supports ?geo=XX URL override for testing.
 */
export function useGeo(): { geo: GeoInfo | null; isLoading: boolean } {
  const [geo, setGeo] = useState<GeoInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getGeoCountry()
      .then((code) => setGeo(buildGeoInfo(code)))
      .catch(() => setGeo(buildGeoInfo('DEFAULT')))
      .finally(() => setIsLoading(false))
  }, [])

  return { geo, isLoading }
}

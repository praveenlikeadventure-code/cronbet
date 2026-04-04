/**
 * Module-level geo-data cache for client components.
 * Deduplicates /api/platforms/geo-data fetches across all components on the page.
 * Import and use in 'use client' files only.
 */
import type { PlatformGeoData } from '@/app/api/platforms/geo-data/route'

type GeoDataMap = Record<string, PlatformGeoData>

let cache: { country: string; data: GeoDataMap } | null = null
let pending: Promise<GeoDataMap> | null = null

/** Fetch geo data for all platforms for the given country. Cached per-country. */
export async function fetchGeoData(country: string): Promise<GeoDataMap> {
  if (cache?.country === country) return cache.data
  if (pending) return pending

  pending = fetch(`/api/platforms/geo-data?country=${country}`)
    .then((r) => r.json() as Promise<GeoDataMap>)
    .then((data) => {
      cache = { country, data }
      pending = null
      return data
    })
    .catch(() => {
      pending = null
      return {} as GeoDataMap
    })

  return pending
}

/**
 * Read the effective country from URL (?geo=XX override) or cronbet_geo cookie.
 * Returns null if DEFAULT / not detected. Safe to call inside useEffect only.
 */
export function detectGeoCountry(): string | null {
  try {
    // URL override takes precedence (for testing)
    const urlOverride = new URLSearchParams(window.location.search).get('geo')?.toUpperCase()
    if (urlOverride && urlOverride !== 'DEFAULT') return urlOverride

    // Cookie set by useGeo hook
    const match = document.cookie.match(/cronbet_geo=([^;]+)/)
    if (!match) return null
    const geo = JSON.parse(decodeURIComponent(match[1])) as {
      countryCode?: string
      isDefault?: boolean
    }
    if (!geo.countryCode || geo.isDefault || geo.countryCode === 'DEFAULT') return null
    return geo.countryCode
  } catch {
    return null
  }
}

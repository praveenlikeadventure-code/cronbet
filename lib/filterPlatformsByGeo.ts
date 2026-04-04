import type { BettingPlatform } from '@/lib/types'

/**
 * Filter platforms based on visibility settings for a given country code.
 * Works on both server and client.
 */
export function filterPlatformsByGeo(
  platforms: BettingPlatform[],
  countryCode: string,
): BettingPlatform[] {
  const code = countryCode.toUpperCase()
  if (!code || code === 'DEFAULT') return platforms

  return platforms.filter((p) => {
    const vType = p.visibilityType ?? 'ALL_COUNTRIES'

    if (vType === 'ALL_COUNTRIES') return true

    if (vType === 'ALLOWED_ONLY') {
      return p.allowedCountries.includes(code)
    }

    if (vType === 'BLOCKED_ONLY') {
      return !p.blockedCountries.includes(code)
    }

    return true
  })
}

/**
 * Filter with fallback: if no platforms are visible for the country,
 * return only ALL_COUNTRIES platforms rather than an empty list.
 */
export function filterPlatformsWithFallback(
  platforms: BettingPlatform[],
  countryCode: string,
): { platforms: BettingPlatform[]; usingFallback: boolean } {
  const filtered = filterPlatformsByGeo(platforms, countryCode)
  if (filtered.length > 0) return { platforms: filtered, usingFallback: false }

  const fallback = platforms.filter((p) => !p.visibilityType || p.visibilityType === 'ALL_COUNTRIES')
  return { platforms: fallback, usingFallback: true }
}

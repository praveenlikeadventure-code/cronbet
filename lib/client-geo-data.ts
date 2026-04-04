/**
 * Client-side geo detection and platform geo-data cache.
 * All detection happens in the browser — ipapi.co sees the real user IP,
 * not Railway's server IP.
 *
 * Import only from 'use client' files.
 */
import { COUNTRIES } from '@/lib/geo-data'
import type { PlatformGeoData } from '@/app/api/platforms/geo-data/route'

// ─── Types ────────────────────────────────────────────────────────────────────

type GeoDataMap = Record<string, PlatformGeoData>

interface StoredGeo {
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  flag: string
  isDefault: boolean
}

// ─── Module-level caches ──────────────────────────────────────────────────────

/** Detected country code, or 'DEFAULT' if unknown. null = not yet resolved. */
let countryCache: string | null = null
let countryPending: Promise<string> | null = null

/** /api/platforms/geo-data cache keyed by country code */
let platformDataCache: { country: string; data: GeoDataMap } | null = null
let platformDataPending: Promise<GeoDataMap> | null = null

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function readGeoCookie(): StoredGeo | null {
  try {
    const parts = `; ${document.cookie}`.split(`; cronbet_geo=`)
    if (parts.length !== 2) return null
    return JSON.parse(decodeURIComponent(parts.pop()!.split(';').shift()!)) as StoredGeo
  } catch {
    return null
  }
}

function writeGeoCookie(info: StoredGeo) {
  document.cookie = `cronbet_geo=${encodeURIComponent(JSON.stringify(info))}; max-age=86400; path=/; SameSite=Lax`
}

// ─── Country info builder ─────────────────────────────────────────────────────

function buildStoredGeo(countryCode: string): StoredGeo {
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

// ─── Main geo detection ───────────────────────────────────────────────────────

/**
 * Detect the user's country. Resolution order:
 *   1. ?geo=XX URL param (testing override)
 *   2. cronbet_geo cookie (24h cache)
 *   3. https://ipapi.co/json/ called directly from browser (real user IP!)
 *
 * Returns 'DEFAULT' if detection fails.
 * Cached at module level — only one API call per page lifetime.
 */
export async function getGeoCountry(): Promise<string> {
  // 1. URL override — highest priority, bypass cache
  const urlOverride = new URLSearchParams(window.location.search).get('geo')?.toUpperCase()
  if (urlOverride && urlOverride !== 'DEFAULT') return urlOverride

  // 2. Module-level cache (already detected this page session)
  if (countryCache !== null) return countryCache

  // 3. In-flight detection — deduplicate concurrent calls
  if (countryPending) return countryPending

  // 4. Cookie (from a previous page visit)
  const cached = readGeoCookie()
  if (cached && !cached.isDefault && cached.countryCode !== 'DEFAULT') {
    countryCache = cached.countryCode
    return countryCache
  }

  // 5. Call ipapi.co directly from browser (Railway sees real user IP)
  countryPending = fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) })
    .then((r) => r.json() as Promise<{ country_code?: string; error?: boolean }>)
    .then((data) => {
      const raw = data.error || !data.country_code ? 'DEFAULT' : data.country_code.toUpperCase()
      // Only store country codes we have geo offers for; otherwise DEFAULT
      const known = COUNTRIES.find((c) => c.code === raw)
      const code = known ? raw : 'DEFAULT'

      countryCache = code
      countryPending = null

      // Persist to cookie so other pages don't need the API call
      writeGeoCookie(buildStoredGeo(code))
      return code
    })
    .catch(() => {
      countryCache = 'DEFAULT'
      countryPending = null
      return 'DEFAULT'
    })

  return countryPending
}

/**
 * Sync read of cookie/URL for components that run their own useEffect.
 * Returns null if country not yet known or is DEFAULT.
 * Use getGeoCountry() (async) when you need the definitive answer.
 */
export function detectGeoCountry(): string | null {
  try {
    const urlOverride = new URLSearchParams(window.location.search).get('geo')?.toUpperCase()
    if (urlOverride && urlOverride !== 'DEFAULT') return urlOverride

    if (countryCache && countryCache !== 'DEFAULT') return countryCache

    const cached = readGeoCookie()
    if (cached && !cached.isDefault && cached.countryCode !== 'DEFAULT') return cached.countryCode

    return null
  } catch {
    return null
  }
}

// ─── Platform geo-data cache ──────────────────────────────────────────────────

/**
 * Fetch geo offers for all platforms for the given country.
 * Cached at module level — deduplicates concurrent fetches from multiple components.
 */
export async function fetchGeoData(country: string): Promise<GeoDataMap> {
  if (platformDataCache?.country === country) return platformDataCache.data
  if (platformDataPending) return platformDataPending

  platformDataPending = fetch(`/api/platforms/geo-data?country=${country}`)
    .then((r) => r.json() as Promise<GeoDataMap>)
    .then((data) => {
      platformDataCache = { country, data }
      platformDataPending = null
      return data
    })
    .catch(() => {
      platformDataPending = null
      return {} as GeoDataMap
    })

  return platformDataPending
}

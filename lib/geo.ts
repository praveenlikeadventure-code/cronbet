// Server-only geo utilities (uses next/headers — cannot be imported by client components)
import { headers } from 'next/headers'

// Re-export client-safe data from geo-data
export { COUNTRIES, COUNTRY_FLAG, getFlagEmoji } from '@/lib/geo-data'
export type { CountryCode } from '@/lib/geo-data'

/** Read user's country from request headers (Vercel / Cloudflare). */
export function getCountryCodeFromHeaders(): string {
  try {
    const h = headers()
    const vercel = h.get('x-vercel-ip-country')
    if (vercel && vercel !== 'XX') return vercel.toUpperCase()

    const cf = h.get('cf-ipcountry')
    if (cf && cf !== 'XX') return cf.toUpperCase()
  } catch {
    // headers() may throw at build time
  }
  return 'DEFAULT'
}

/**
 * Resolve the effective country for a request.
 * Priority: ?geo=XX query param > request headers > 'DEFAULT'
 */
export function getEffectiveCountry(searchParams?: Record<string, string> | URLSearchParams): string {
  let override: string | null = null

  if (searchParams) {
    if (searchParams instanceof URLSearchParams) {
      override = searchParams.get('geo')
    } else {
      override = (searchParams as Record<string, string>)['geo'] ?? null
    }
  }

  if (override) return override.toUpperCase()
  return getCountryCodeFromHeaders()
}

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { COUNTRIES } from '@/lib/geo-data'

async function detectCountryFromIP(ip: string): Promise<string> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'cronbet/1.0' },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return 'DEFAULT'
    const data = await res.json() as { country_code?: string; error?: boolean }
    if (data.error) return 'DEFAULT'
    return data.country_code?.toUpperCase() ?? 'DEFAULT'
  } catch {
    return 'DEFAULT'
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const override = searchParams.get('geo')?.toUpperCase()

  let countryCode = 'DEFAULT'

  if (override) {
    countryCode = override
  } else {
    const h = headers()

    // Try platform-injected geo headers first (Vercel, Cloudflare)
    const vercel = h.get('x-vercel-ip-country')
    const cf = h.get('cf-ipcountry')

    if (vercel && vercel !== 'XX') {
      countryCode = vercel.toUpperCase()
    } else if (cf && cf !== 'XX') {
      countryCode = cf.toUpperCase()
    } else {
      // Railway fallback: extract real IP and call ipapi.co
      const xff = h.get('x-forwarded-for')
      const xri = h.get('x-real-ip')
      const ip = xff?.split(',')[0]?.trim() ?? xri ?? null

      if (ip && ip !== '127.0.0.1' && ip !== '::1') {
        countryCode = await detectCountryFromIP(ip)
      }
    }
  }

  const country =
    COUNTRIES.find((c) => c.code === countryCode) ??
    COUNTRIES.find((c) => c.code === 'DEFAULT')!

  const res = NextResponse.json({
    countryCode: country.code,
    countryName: country.name,
    currencyCode: country.currency,
    currencySymbol: country.symbol,
    flag: country.flag,
    isDefault: country.code === 'DEFAULT',
  })

  res.headers.set('Cache-Control', 'public, max-age=86400')
  return res
}

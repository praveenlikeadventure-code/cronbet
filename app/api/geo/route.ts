export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { COUNTRIES } from '@/lib/geo-data'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // Dev override via ?geo=XX
  const override = searchParams.get('geo')?.toUpperCase()

  let countryCode = override ?? 'DEFAULT'

  if (!override) {
    const h = headers()
    const vercel = h.get('x-vercel-ip-country')
    const cf = h.get('cf-ipcountry')
    const detected = vercel ?? cf
    if (detected && detected !== 'XX') countryCode = detected.toUpperCase()
  }

  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES.find((c) => c.code === 'DEFAULT')!

  const res = NextResponse.json({
    countryCode: country.code,
    countryName: country.name,
    currencyCode: country.currency,
    currencySymbol: country.symbol,
    flag: country.flag,
    isDefault: country.code === 'DEFAULT',
  })

  // Cache for 24 hours client-side
  res.headers.set('Cache-Control', 'public, max-age=86400')
  return res
}

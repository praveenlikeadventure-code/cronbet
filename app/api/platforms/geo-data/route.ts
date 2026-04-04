export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getFlagEmoji } from '@/lib/geo-data'

export interface PlatformGeoData {
  bonusText: string
  minDeposit: string
  affiliateUrl: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')?.toUpperCase() ?? 'DEFAULT'

  const codesToFetch = country === 'DEFAULT' ? ['DEFAULT'] : [country, 'DEFAULT']

  const allOffers = await prisma.platformGeoOffer.findMany({
    where: { isActive: true, countryCode: { in: codesToFetch } },
  })

  const platformIds = Array.from(new Set(allOffers.map((o) => o.platformId)))
  const result: Record<string, PlatformGeoData> = {}

  for (const pid of platformIds) {
    const specific = allOffers.find((o) => o.platformId === pid && o.countryCode === country)
    const fallback = allOffers.find((o) => o.platformId === pid && o.countryCode === 'DEFAULT')
    const best = specific ?? fallback
    if (!best) continue

    const isDefault = !specific
    const flag = getFlagEmoji(isDefault ? 'DEFAULT' : best.countryCode)
    result[pid] = {
      bonusText: `${flag} ${best.bonusText}`,
      minDeposit: best.minDeposit,
      affiliateUrl: best.affiliateUrl,
    }
  }

  return NextResponse.json(result)
}

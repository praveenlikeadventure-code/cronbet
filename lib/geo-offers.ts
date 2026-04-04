import { prisma } from '@/lib/prisma'
import { getFlagEmoji } from '@/lib/geo-data'
import type { BettingPlatform } from '@/lib/types'

export interface GeoOffer {
  id: string
  platformId: string
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  bonusText: string
  bonusAmount: string
  minDeposit: string
  affiliateUrl: string
  isActive: boolean
  isDefault: boolean   // true when falling back to DEFAULT offer
}

/**
 * Fetch the best geo offer for a single platform.
 * Falls back to DEFAULT if no country-specific offer exists.
 */
export async function getGeoOffer(
  platformId: string,
  countryCode: string,
): Promise<GeoOffer | null> {
  const code = countryCode.toUpperCase()

  const offers = await prisma.platformGeoOffer.findMany({
    where: {
      platformId,
      isActive: true,
      countryCode: code === 'DEFAULT' ? 'DEFAULT' : { in: [code, 'DEFAULT'] },
    },
  })

  const specific = offers.find((o) => o.countryCode === code)
  const fallback = offers.find((o) => o.countryCode === 'DEFAULT')
  const best = specific ?? fallback

  if (!best) return null
  return { ...best, isDefault: !specific }
}

/**
 * Batch fetch geo offers for many platforms in one query.
 * Returns a Map<platformId, GeoOffer>.
 */
export async function getGeoOffersForPlatforms(
  platformIds: string[],
  countryCode: string,
): Promise<Map<string, GeoOffer>> {
  if (platformIds.length === 0) return new Map()

  const code = countryCode.toUpperCase()
  const codesToFetch = code === 'DEFAULT' ? ['DEFAULT'] : [code, 'DEFAULT']

  const allOffers = await prisma.platformGeoOffer.findMany({
    where: {
      platformId: { in: platformIds },
      isActive: true,
      countryCode: { in: codesToFetch },
    },
  })

  const result = new Map<string, GeoOffer>()

  for (const pid of platformIds) {
    const specific = allOffers.find((o) => o.platformId === pid && o.countryCode === code)
    const fallback = allOffers.find((o) => o.platformId === pid && o.countryCode === 'DEFAULT')
    const best = specific ?? fallback
    if (best) result.set(pid, { ...best, isDefault: !specific })
  }

  return result
}

/**
 * Merge a geo offer into a BettingPlatform object.
 * Overrides bonusText (with flag prefix), minDeposit, affiliateUrl.
 */
export function applyGeoOffer(
  platform: BettingPlatform,
  geoOffer: GeoOffer | undefined,
  showFlag = true,
): BettingPlatform {
  if (!geoOffer) return platform

  const flag = showFlag ? getFlagEmoji(geoOffer.isDefault ? 'DEFAULT' : geoOffer.countryCode) : ''
  const bonusText = showFlag ? `${flag} ${geoOffer.bonusText}` : geoOffer.bonusText

  return {
    ...platform,
    bonusText,
    minDeposit: geoOffer.minDeposit || platform.minDeposit,
    affiliateUrl: geoOffer.affiliateUrl || platform.affiliateUrl,
  }
}

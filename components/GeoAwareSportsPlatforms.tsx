'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { useGeoCurrency } from '@/hooks/useGeoCurrency'
import { filterPlatformsWithFallback } from '@/lib/filterPlatformsByGeo'
import GeoDebugBanner from '@/components/GeoDebugBanner'
import type { BettingPlatform } from '@/lib/types'

interface Props {
  initialPlatforms: BettingPlatform[]
  listTitle: string
  listSubtitleBase: string
  showBonusCards?: boolean
  bonusSectionTitle?: string
}

export default function GeoAwareSportsPlatforms({
  initialPlatforms,
  listTitle,
  listSubtitleBase,
  showBonusCards = false,
  bonusSectionTitle = 'Top Betting Bonuses',
}: Props) {
  const { platforms: updated, geo } = useGeoCurrency(initialPlatforms)

  const { platforms } = geo && !geo.isDefault
    ? filterPlatformsWithFallback(updated, geo.countryCode)
    : { platforms: updated }

  const locationLabel = geo && !geo.isDefault ? geo.countryName : 'India'

  return (
    <>
      <GeoDebugBanner geo={geo} />

      {/* Ranked platform list */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">{listTitle}</h2>
        <p className="text-gray-400 text-center mb-10">
          {listSubtitleBase} — {locationLabel}
        </p>

        <div className="space-y-4">
          {platforms.map((platform, i) => (
            <div
              key={platform.id}
              className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-yellow-400/30 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-2xl font-extrabold text-yellow-400 w-8 shrink-0">
                  #{i + 1}
                </span>
                {platform.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1"
                    width={48}
                    height={48}
                  />
                )}
                <div className="min-w-0">
                  <div className="font-bold text-white text-lg">{platform.name}</div>
                  <div className="text-yellow-400 text-sm font-semibold">{platform.bonusText}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className={
                          j < Math.floor(platform.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }
                      />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">{platform.rating}/5</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/review/${platform.slug}`}
                className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Get Bonus
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus cards — optional, used on IPL page */}
      {showBonusCards && platforms.length > 0 && (
        <section className="bg-[#0d1225] py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
              {bonusSectionTitle}
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Best welcome offers available in {locationLabel}
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {platforms.slice(0, 3).map((platform) => (
                <div
                  key={platform.id}
                  className="bg-[#0f1629] border border-yellow-400/20 rounded-xl p-5 text-center"
                >
                  <div className="font-bold text-white text-lg mb-2">{platform.name}</div>
                  <div className="text-yellow-400 font-extrabold text-xl mb-3">
                    {platform.bonusText}
                  </div>
                  <Link
                    href={`/review/${platform.slug}`}
                    className="block bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Claim Bonus
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs text-center mt-6">
              18+. T&amp;Cs apply. Gamble responsibly.
            </p>
          </div>
        </section>
      )}
    </>
  )
}

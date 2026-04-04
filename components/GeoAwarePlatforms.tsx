'use client'

import { useState, useEffect, useRef } from 'react'
import { useGeo } from '@/hooks/useGeo'
import type { BettingPlatform } from '@/lib/types'
import type { PlatformGeoData } from '@/app/api/platforms/geo-data/route'
import PlatformCard from '@/components/platform/PlatformCard'
import ComparisonTable from '@/components/platform/ComparisonTable'

interface GeoAwarePlatformsProps {
  initialPlatforms: BettingPlatform[]
  initialFeatured: BettingPlatform[]
  featuredTitle: string
  featuredSubtitle: string
  allTitle: string
  allSubtitle: string
  viewAllLabel: string
}

function applyGeoData(
  platforms: BettingPlatform[],
  geoData: Record<string, PlatformGeoData>,
): BettingPlatform[] {
  return platforms.map((p) => {
    const d = geoData[p.id]
    if (!d) return p
    return {
      ...p,
      bonusText: d.bonusText || p.bonusText,
      minDeposit: d.minDeposit || p.minDeposit,
      affiliateUrl: d.affiliateUrl || p.affiliateUrl,
    }
  })
}

export default function GeoAwarePlatforms({
  initialPlatforms,
  initialFeatured,
  featuredTitle,
  featuredSubtitle,
  allTitle,
  allSubtitle,
  viewAllLabel,
}: GeoAwarePlatformsProps) {
  const { geo, isLoading } = useGeo()
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [featured, setFeatured] = useState(initialFeatured)
  const lastCountry = useRef<string | null>(null)

  useEffect(() => {
    if (!geo || geo.isDefault) return
    if (geo.countryCode === lastCountry.current) return
    lastCountry.current = geo.countryCode

    fetch(`/api/platforms/geo-data?country=${geo.countryCode}`)
      .then((r) => r.json())
      .then((geoData: Record<string, PlatformGeoData>) => {
        setPlatforms(applyGeoData(initialPlatforms, geoData))
        setFeatured(applyGeoData(initialFeatured, geoData))
      })
      .catch(() => {})
  }, [geo, initialPlatforms, initialFeatured])

  return (
    <>
      {/* Debug banner — remove once geo detection is confirmed working in production */}
      {!isLoading && geo && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 border border-white/20 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          {geo.flag} Detected: <strong>{geo.countryCode}</strong>
          {geo.isDefault ? ' (default)' : ''}
        </div>
      )}

      {/* Featured Top 5 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">{featuredTitle}</h2>
            <p className="text-gray-400 mt-1">
              {featuredSubtitle} {new Date().getFullYear()}
            </p>
          </div>
          <a href="/compare" className="text-yellow-400 hover:underline text-sm hidden sm:block">
            {viewAllLabel}
          </a>
        </div>
        <div className="space-y-4">
          {featured.map((platform, i) => (
            <PlatformCard key={platform.id} platform={platform} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Full Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-extrabold text-white mb-3">{allTitle}</h2>
        <p className="text-gray-400 mb-8">{allSubtitle}</p>
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-4 sm:p-6">
          <ComparisonTable platforms={platforms} />
        </div>
      </section>
    </>
  )
}

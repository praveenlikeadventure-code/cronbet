'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ExternalLink, Star } from 'lucide-react'
import { fetchGeoData, getGeoCountry } from '@/lib/client-geo-data'

interface Platform {
  id: string
  name: string
  slug: string
  logo: string | null
  bonusText: string | null
  affiliateUrl: string
  rating: number
  minDeposit: string | null
  visibilityType?: string
  allowedCountries?: string[]
  blockedCountries?: string[]
}

interface BlogPlatformWidgetProps {
  platform: Platform
  adId: string
  badge?: string | null
  highlightPoints?: string[]
  variant?: 'SIDEBAR' | 'BANNER' | 'MINI'
  position: string
  blogId?: string
  blogSlug?: string
}

function StarRatingRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function BadgePill({ badge }: { badge: string }) {
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 uppercase tracking-wide">
      {badge}
    </span>
  )
}

// ─── BANNER (horizontal, full-width) ─────────────────────────────────────────
function BannerWidget({
  platform,
  badge,
  highlightPoints,
  onClaim,
}: {
  platform: Platform
  badge?: string | null
  highlightPoints: string[]
  onClaim: (e: React.MouseEvent) => void
}) {
  return (
    <div className="group bg-[#1a1f2e] border border-white/10 rounded-xl p-4 hover:border-yellow-400/30 hover:shadow-lg hover:shadow-yellow-400/5 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Logo + name + rating */}
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {platform.logo ? (
              <Image src={platform.logo} alt={platform.name} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-white font-bold text-lg">{platform.name.slice(0, 2)}</span>
            )}
          </div>
          <div>
            {badge && <BadgePill badge={badge} />}
            <h4 className="text-white font-bold text-base mt-0.5">{platform.name}</h4>
            <StarRatingRow rating={platform.rating} />
          </div>
        </div>

        {/* Bonus */}
        <div className="flex-1">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Welcome Bonus</div>
          <div className="text-[#f5a623] font-extrabold text-lg leading-tight">{platform.bonusText || 'See Offer'}</div>
          {platform.minDeposit && (
            <div className="text-xs text-gray-500 mt-0.5">Min. deposit: {platform.minDeposit}</div>
          )}
        </div>

        {/* Highlight points */}
        {highlightPoints.length > 0 && (
          <div className="hidden md:flex flex-col gap-1.5 flex-1">
            {highlightPoints.slice(0, 2).map((pt, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle size={13} className="text-green-400 shrink-0" />
                {pt}
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 min-w-[150px]">
          <a
            href={platform.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            onClick={onClaim}
            className="bg-[#22c55e] hover:bg-green-400 text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink size={13} />
            Claim Bonus
          </a>
          <Link
            href={`/review/${platform.slug}`}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center transition-colors"
          >
            Read Review
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── SIDEBAR (vertical compact card) ─────────────────────────────────────────
function SidebarWidget({
  platform,
  badge,
  highlightPoints,
  onClaim,
}: {
  platform: Platform
  badge?: string | null
  highlightPoints: string[]
  onClaim: (e: React.MouseEvent) => void
}) {
  return (
    <div className="group bg-[#1a1f2e] border border-white/10 rounded-xl p-4 hover:border-yellow-400/30 hover:shadow-lg hover:shadow-yellow-400/5 transition-all">
      {/* Logo */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
          {platform.logo ? (
            <Image src={platform.logo} alt={platform.name} width={40} height={40} className="object-contain" />
          ) : (
            <span className="text-white font-bold">{platform.name.slice(0, 2)}</span>
          )}
        </div>
        {badge && <BadgePill badge={badge} />}
      </div>

      {/* Name + rating */}
      <h4 className="text-white font-bold text-sm mb-1">{platform.name}</h4>
      <StarRatingRow rating={platform.rating} />

      {/* Bonus */}
      <div className="mt-3 mb-2">
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Welcome Bonus</div>
        <div className="text-[#f5a623] font-extrabold text-base">{platform.bonusText || 'See Offer'}</div>
        {platform.minDeposit && (
          <div className="text-xs text-gray-500 mt-0.5">Min. deposit: {platform.minDeposit}</div>
        )}
      </div>

      {/* Highlight points */}
      {highlightPoints.length > 0 && (
        <div className="flex flex-col gap-1 mb-3">
          {highlightPoints.slice(0, 2).map((pt, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
              <CheckCircle size={11} className="text-green-400 shrink-0 mt-0.5" />
              {pt}
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      <a
        href={platform.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={onClaim}
        className="w-full bg-[#22c55e] hover:bg-green-400 text-white font-bold px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-colors mb-2"
      >
        <ExternalLink size={12} />
        Claim Bonus
      </a>
      <Link
        href={`/review/${platform.slug}`}
        className="block w-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-lg text-center transition-colors"
      >
        Read Review
      </Link>
    </div>
  )
}

// ─── MINI (tiny inline card) ──────────────────────────────────────────────────
function MiniWidget({
  platform,
  badge,
  onClaim,
}: {
  platform: Platform
  badge?: string | null
  onClaim: (e: React.MouseEvent) => void
}) {
  return (
    <div className="inline-flex items-center gap-3 bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-2 hover:border-yellow-400/30 transition-all">
      <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
        {platform.logo ? (
          <Image src={platform.logo} alt={platform.name} width={28} height={28} className="object-contain" />
        ) : (
          <span className="text-white font-bold text-xs">{platform.name.slice(0, 2)}</span>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold text-xs">{platform.name}</span>
          {badge && <span className="text-[9px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">{badge}</span>}
        </div>
        <div className="text-[#f5a623] text-xs font-semibold">{platform.bonusText || 'See Offer'}</div>
      </div>
      <a
        href={platform.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={onClaim}
        className="bg-[#22c55e] hover:bg-green-400 text-white font-bold px-2.5 py-1.5 rounded text-xs flex items-center gap-1 transition-colors shrink-0"
      >
        <ExternalLink size={10} />
        Claim
      </a>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BlogPlatformWidget({
  platform: initialPlatform,
  adId,
  badge,
  highlightPoints = [],
  variant = 'BANNER',
  position,
  blogId,
  blogSlug,
}: BlogPlatformWidgetProps) {
  const [platform, setPlatform] = useState(initialPlatform)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    getGeoCountry().then((country) => {
      if (!country || country === 'DEFAULT') return

      // Check visibility
      const v = initialPlatform.visibilityType
      if (v === 'ALLOWED_ONLY' && !initialPlatform.allowedCountries?.includes(country)) {
        setHidden(true)
        return
      }
      if (v === 'BLOCKED_ONLY' && initialPlatform.blockedCountries?.includes(country)) {
        setHidden(true)
        return
      }

      return fetchGeoData(country).then((data) => {
        const d = data[initialPlatform.id]
        if (!d) return
        setPlatform((prev) => ({
          ...prev,
          bonusText: d.bonusText || prev.bonusText,
          minDeposit: d.minDeposit || prev.minDeposit,
          affiliateUrl: d.affiliateUrl || prev.affiliateUrl,
        }))
      })
    })
  }, [initialPlatform])

  if (hidden) return null

  function handleClaimClick(e: React.MouseEvent) {
    e.stopPropagation()
    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, platformId: platform.id, blogId, blogSlug, position }),
    }).catch(() => {})
  }

  if (variant === 'MINI') {
    return <MiniWidget platform={platform} badge={badge} onClaim={handleClaimClick} />
  }
  if (variant === 'SIDEBAR') {
    return (
      <SidebarWidget
        platform={platform}
        badge={badge}
        highlightPoints={highlightPoints}
        onClaim={handleClaimClick}
      />
    )
  }
  return (
    <BannerWidget
      platform={platform}
      badge={badge}
      highlightPoints={highlightPoints}
      onClaim={handleClaimClick}
    />
  )
}

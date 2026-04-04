'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import type { BettingPlatform } from '@/lib/types'
import { useGeoCurrency } from '@/hooks/useGeoCurrency'
import GeoDebugBanner from '@/components/GeoDebugBanner'
import StarRating from '@/components/ui/StarRating'
import PlatformCard from '@/components/platform/PlatformCard'

const RATING_CATEGORIES = [
  { label: 'UI/UX', key: 'uiux' },
  { label: 'Bonuses', key: 'bonuses' },
  { label: 'Sports', key: 'sports' },
  { label: 'Payments', key: 'payments' },
]

interface GeoAwareReviewProps {
  initialPlatform: BettingPlatform
  initialRelated: BettingPlatform[]
}

export default function GeoAwareReview({ initialPlatform, initialRelated }: GeoAwareReviewProps) {
  const initialAll = useMemo(
    () => [initialPlatform, ...initialRelated],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { platforms: allUpdated, geo } = useGeoCurrency(initialAll)

  const platform = allUpdated[0]
  const related = allUpdated.slice(1)

  const ratingValues: Record<string, number> = {
    uiux: Math.min(5, platform.rating + 0.1),
    bonuses: Math.min(5, platform.rating + 0.2),
    sports: Math.min(5, platform.rating - 0.1),
    payments: Math.min(5, platform.rating),
  }

  return (
    <>
      <GeoDebugBanner geo={geo} />

      {/* Header */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
            {platform.logo ? (
              <Image src={platform.logo} alt={platform.name} width={64} height={64} className="object-contain" />
            ) : (
              <span className="text-white font-extrabold text-2xl">{platform.name.slice(0, 2)}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-1">{platform.name} Review</h1>
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={platform.rating} size="lg" />
              <span className="text-gray-400 text-sm">({platform.rating}/5.0)</span>
            </div>
            {platform.license && (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                ✓ Licensed: {platform.license}
              </span>
            )}
          </div>
          <div className="sm:text-right">
            <div className="text-sm text-gray-400 mb-1">Welcome Bonus</div>
            <div className="text-2xl font-extrabold text-yellow-400 mb-3">{platform.bonusText}</div>
            <a
              href={platform.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Claim Bonus
            </a>
          </div>
        </div>
      </div>

      {/* Overview */}
      {platform.description && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{platform.name} Overview</h2>
          <p className="text-gray-300 leading-relaxed">{platform.description}</p>
        </section>
      )}

      {/* Pros & Cons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0f1629] border border-green-500/20 rounded-xl p-5">
          <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={18} /> Pros
          </h3>
          <ul className="space-y-2">
            {platform.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0f1629] border border-red-500/20 rounded-xl p-5">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <XCircle size={18} /> Cons
          </h3>
          <ul className="space-y-2">
            {platform.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-bold text-white mb-5">Rating Breakdown</h2>
        <div className="space-y-4">
          {RATING_CATEGORIES.map(({ label, key }) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-400">{label}</div>
              <div className="flex-1 bg-white/5 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingValues[key] / 5) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right text-sm text-yellow-400 font-semibold">
                {ratingValues[key].toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Details */}
      <section className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-bold text-white mb-5">Key Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Min Deposit', value: platform.minDeposit },
            { label: 'Payout Speed', value: platform.payoutSpeed },
            { label: 'License', value: platform.license },
          ]
            .filter(({ value }) => value)
            .map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-white font-semibold text-sm">{value}</div>
              </div>
            ))}
        </div>

        {platform.sports.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Sports Covered</div>
            <div className="flex flex-wrap gap-2">
              {platform.sports.map((sport) => (
                <span
                  key={sport}
                  className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-white/10"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>
        )}

        {platform.payments.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Payment Methods</div>
            <div className="flex flex-wrap gap-2">
              {platform.payments.map((payment) => (
                <span
                  key={payment}
                  className="bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-white/10"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sticky CTA */}
      <div className="bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm text-gray-400">Ready to join {platform.name}?</div>
          <div className="text-xl font-bold text-white">
            Claim your bonus: <span className="text-yellow-400">{platform.bonusText}</span>
          </div>
        </div>
        <a
          href={platform.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <ExternalLink size={16} />
          Get Bonus Now
        </a>
      </div>

      {/* Related Platforms */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-5">Similar Platforms</h2>
        <div className="space-y-4">
          {related.map((p) => (
            <PlatformCard key={p.id} platform={p} showBadge={false} />
          ))}
        </div>
      </section>
    </>
  )
}

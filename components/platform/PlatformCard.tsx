import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, CheckCircle } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'
import { BettingPlatform } from '@/lib/types'

interface PlatformCardProps {
  platform: BettingPlatform
  rank?: number
  showBadge?: boolean
}

export default function PlatformCard({ platform, rank, showBadge = true }: PlatformCardProps) {
  return (
    <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 hover:border-yellow-400/40 transition-all hover:shadow-lg hover:shadow-yellow-400/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Rank + Logo */}
        <div className="flex items-center gap-3 min-w-[140px]">
          {rank && (
            <span className="text-2xl font-extrabold text-yellow-400/40 w-6 text-center">{rank}</span>
          )}
          <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
            {platform.logo ? (
              <Image src={platform.logo} alt={platform.name} width={56} height={56} className="object-contain" />
            ) : (
              <span className="text-white font-bold text-lg">{platform.name.slice(0, 2)}</span>
            )}
          </div>
          <div>
            {showBadge && rank === 1 && <Badge variant="top-pick" className="mb-1" />}
            {showBadge && rank === 2 && <Badge variant="editors-choice" className="mb-1" />}
            <h3 className="text-white font-bold text-lg">{platform.name}</h3>
            <StarRating rating={platform.rating} size="sm" />
          </div>
        </div>

        {/* Bonus */}
        <div className="flex-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Welcome Bonus</div>
          <div className="text-yellow-400 font-bold text-lg">{platform.bonusText || 'See Offer'}</div>
          {platform.minDeposit && (
            <div className="text-xs text-gray-500 mt-0.5">Min. deposit: {platform.minDeposit}</div>
          )}
        </div>

        {/* Pros preview */}
        <div className="hidden lg:block flex-1">
          {platform.pros.slice(0, 2).map((pro, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm text-gray-300 mb-1">
              <CheckCircle size={13} className="text-green-400 shrink-0" />
              {pro}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          <a
            href={platform.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink size={14} />
            Claim Bonus
          </a>
          <Link
            href={`/review/${platform.slug}`}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2 rounded-lg text-center text-sm transition-colors"
          >
            Read Review
          </Link>
        </div>
      </div>
    </div>
  )
}

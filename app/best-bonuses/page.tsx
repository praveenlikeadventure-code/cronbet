export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Gift, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import StarRating from '@/components/ui/StarRating'

export const metadata: Metadata = {
  title: 'Best Betting Bonuses 2024 - Top Welcome Offers',
  description:
    'Compare the best betting welcome bonuses available in 2024. Find the biggest deposit bonuses, free bets, and exclusive offers from top platforms.',
}

export default async function BestBonusesPage() {
  const platforms = await prisma.bettingPlatform.findMany({
    where: { isActive: true },
    orderBy: { rank: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-yellow-400">Home</a></li>
          <li>/</li>
          <li className="text-gray-300">Best Bonuses</li>
        </ol>
      </nav>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-4 text-sm text-green-400">
          <Gift size={14} />
          Exclusive welcome offers updated daily
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Best Betting Bonuses</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Claim the biggest welcome bonuses from top-rated betting platforms. All offers have been verified and include our affiliate links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {platforms.map((platform, i) => (
          <div
            key={platform.id}
            className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all hover:shadow-lg hover:shadow-yellow-400/5"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#131a2f] to-[#0f1629] p-5 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                    {platform.logo ? (
                      <Image src={platform.logo} alt={platform.name} width={40} height={40} className="object-contain" />
                    ) : (
                      <span className="text-white font-bold">{platform.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{platform.name}</h3>
                    <StarRating rating={platform.rating} size="sm" />
                  </div>
                </div>
                {i === 0 && (
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">#1 Pick</span>
                )}
              </div>
            </div>

            {/* Bonus */}
            <div className="p-5">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 text-center">
                <div className="text-xs text-green-400 uppercase tracking-wide mb-1">Welcome Bonus</div>
                <div className="text-2xl font-extrabold text-white">{platform.bonusText || 'See Offer'}</div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Clock size={12} />
                Min. deposit: {platform.minDeposit || 'See terms'}
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={platform.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={15} />
                  Claim Bonus
                </a>
                <Link
                  href={`/review/${platform.slug}`}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-2 rounded-lg text-center text-sm transition-colors"
                >
                  Full Review
                </Link>
              </div>

              <p className="text-xs text-gray-600 mt-3 text-center">T&Cs apply. 18+. Gamble Responsibly.</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#0f1629] border border-yellow-400/20 rounded-xl p-5 text-center">
        <p className="text-gray-400 text-sm">
          <strong className="text-yellow-400">Disclaimer:</strong> Bonus offers are subject to change. Always read the full terms and conditions before claiming any bonus.
          This website contains affiliate links and we may receive compensation for sign-ups.
        </p>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { parsePlatform, parsePlatforms } from '@/lib/types'
import GeoAwareReview from '@/components/GeoAwareReview'
import { getGeoOffer, getGeoOffersForPlatforms, applyGeoOffer } from '@/lib/geo-offers'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const platform = await prisma.bettingPlatform.findUnique({ where: { slug: params.slug } })
  if (!platform) return {}
  return {
    title: `${platform.name} Review ${new Date().getFullYear()} - Bonus, Pros & Cons`,
    description: `Read our full ${platform.name} review. Rating: ${platform.rating}/5. Bonus: ${platform.bonusText}. Find out pros, cons, payment methods and more.`,
    openGraph: {
      title: `${platform.name} Review | CRONBET`,
      description: platform.description || `Expert ${platform.name} review`,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ReviewPage({ params }: Props) {
  const _platform = await prisma.bettingPlatform.findUnique({
    where: { slug: params.slug, isActive: true },
  })

  if (!_platform) notFound()
  const basePlatform = parsePlatform(_platform as Record<string, unknown>)

  const relatedRaw = parsePlatforms(
    (await prisma.bettingPlatform.findMany({
      where: { isActive: true, id: { not: basePlatform.id } },
      orderBy: { rank: 'asc' },
      take: 3,
    })) as Record<string, unknown>[],
  )

  // SSR with DEFAULT — GeoAwareReview upgrades client-side after geo detection
  const [primaryGeo, relatedGeoOffers] = await Promise.all([
    getGeoOffer(basePlatform.id, 'DEFAULT'),
    getGeoOffersForPlatforms(relatedRaw.map((p) => p.id), 'DEFAULT'),
  ])
  const platform = applyGeoOffer(basePlatform, primaryGeo ?? undefined)
  const related = relatedRaw.map((p) => applyGeoOffer(p, relatedGeoOffers.get(p.id)))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li><Link href="/compare" className="hover:text-yellow-400">Reviews</Link></li>
          <li>/</li>
          <li className="text-gray-300">{platform.name}</li>
        </ol>
      </nav>

      <GeoAwareReview initialPlatform={platform} initialRelated={related} />

      {/* JSON-LD Review Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Review',
            name: `${platform.name} Review`,
            reviewBody: platform.description,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: platform.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: { '@type': 'Organization', name: 'CRONBET' },
            itemReviewed: { '@type': 'Organization', name: platform.name },
          }),
        }}
      />
    </div>
  )
}

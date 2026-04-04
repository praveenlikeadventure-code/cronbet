export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import BlogPlatformWidget from '@/components/BlogPlatformWidget'
import PopupWidgets from '@/components/blog/PopupWidgets'
import { getGeoOffersForPlatforms } from '@/lib/geo-offers'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    openGraph: { title: post.title, description: post.excerpt || '' },
  }
}

// Fetches active ads that apply to a given blog post, with optional geo overrides
async function getAdsForPost(blogId: string, countryCode = 'DEFAULT') {
  const allAds = await prisma.blogAd.findMany({
    where: { isActive: true },
    orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
  })

  const applicable = allAds.filter((ad) => {
    if (ad.displayOnAllBlogs) return true
    try {
      const ids: string[] = JSON.parse(ad.specificBlogIds || '[]')
      return ids.includes(blogId)
    } catch {
      return false
    }
  })

  if (applicable.length === 0) return []

  const platformIds = Array.from(new Set(applicable.map((a) => a.platformId)))
  const [platforms, geoOffers] = await Promise.all([
    prisma.bettingPlatform.findMany({ where: { id: { in: platformIds }, isActive: true } }),
    getGeoOffersForPlatforms(platformIds, countryCode),
  ])
  const platformMap = Object.fromEntries(platforms.map((p) => [p.id, p]))

  return applicable
    .filter((ad) => platformMap[ad.platformId])
    .map((ad) => {
      const base = platformMap[ad.platformId]
      const geo = geoOffers.get(ad.platformId)
      return {
        id: ad.id,
        platformId: ad.platformId,
        positions: (() => { try { return JSON.parse(ad.positions || '["ALL"]') } catch { return ['ALL'] } })() as string[],
        badge: ad.badge,
        highlightPoints: (() => { try { return JSON.parse(ad.highlightPoints || '[]') } catch { return [] } })() as string[],
        priority: ad.priority,
        // Apply geo offer: override bonusText, minDeposit, affiliateUrl
        platform: {
          ...base,
          bonusText: geo ? geo.bonusText : base.bonusText,
          minDeposit: geo?.minDeposit || base.minDeposit,
          affiliateUrl: geo?.affiliateUrl || base.affiliateUrl,
          // Pass visibility fields so BlogPlatformWidget can self-hide
          visibilityType: base.visibilityType,
          allowedCountries: (() => { try { return JSON.parse(base.allowedCountries || '[]') } catch { return [] } })(),
          blockedCountries: (() => { try { return JSON.parse(base.blockedCountries || '[]') } catch { return [] } })(),
        },
      }
    })
}

function getAdsForPosition(ads: Awaited<ReturnType<typeof getAdsForPost>>, position: string) {
  return ads.filter((ad) => ad.positions.includes(position) || ad.positions.includes('ALL'))
}

function AdSponsoredLabel({ label = 'Our Partners' }: { label?: string }) {
  return (
    <div className="text-[10px] text-gray-600 uppercase tracking-widest text-center mb-1.5">{label}</div>
  )
}

// Renders blog content with in-content ads injected after every 3rd paragraph
function renderContent(
  content: string,
  inContentAds: Awaited<ReturnType<typeof getAdsForPost>>,
  blogId: string,
  blogSlug: string,
) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let paragraphCount = 0
  let adInserted = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Inject ad after every 3rd content paragraph
    if (
      line !== '' &&
      !line.startsWith('#') &&
      !line.startsWith('-')
    ) {
      paragraphCount++

      if (paragraphCount > 0 && paragraphCount % 3 === 0 && inContentAds.length > 0) {
        const ad = inContentAds[adInserted % inContentAds.length]
        adInserted++
        elements.push(
          <div key={`incontent-${i}`} className="my-6 not-prose">
            <AdSponsoredLabel />
            <BlogPlatformWidget
              platform={ad.platform}
              adId={ad.id}
              badge={ad.badge}
              highlightPoints={ad.highlightPoints}
              variant="BANNER"
              position="IN_CONTENT"
              blogId={blogId}
              blogSlug={blogSlug}
            />
          </div>
        )
      }
    }

    if (line.startsWith('# '))
      elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-8 mb-3">{line.slice(2)}</h2>)
    else if (line.startsWith('## '))
      elements.push(<h3 key={i} className="text-xl font-bold text-white mt-6 mb-2">{line.slice(3)}</h3>)
    else if (line.startsWith('### '))
      elements.push(<h4 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(4)}</h4>)
    else if (line.startsWith('- '))
      elements.push(<li key={i} className="ml-4 text-gray-300">{line.slice(2)}</li>)
    else if (line === '')
      elements.push(<br key={i} />)
    else
      elements.push(<p key={i} className="text-gray-300 mb-3">{line}</p>)
  }

  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true },
  })

  if (!post) notFound()

  // SSR with DEFAULT geo — BlogPlatformWidget and PopupWidgets self-update client-side
  const [ads, popupSettingsRaw] = await Promise.all([
    getAdsForPost(post.id, 'DEFAULT'),
    prisma.popupSettings.findUnique({ where: { id: 'singleton' } }),
  ])

  const headerAds = getAdsForPosition(ads, 'HEADER')
  const footerAds = getAdsForPosition(ads, 'FOOTER')
  const leftAds = getAdsForPosition(ads, 'LEFT_SIDEBAR')
  const rightAds = getAdsForPosition(ads, 'RIGHT_SIDEBAR')
  const inContentAds = getAdsForPosition(ads, 'IN_CONTENT')

  // ── Popup platform resolution ──────────────────────────────────────────────
  // 1. If specific platform IDs are configured, use those
  // 2. Otherwise use top-rated active platforms
  // 3. Boost platforms mentioned in the blog content (smart auto-select)
  const popupSettings = {
    scrollEnabled:      popupSettingsRaw?.scrollEnabled      ?? true,
    exitEnabled:        popupSettingsRaw?.exitEnabled        ?? true,
    timeEnabled:        popupSettingsRaw?.timeEnabled        ?? true,
    scrollTriggerPct:   popupSettingsRaw?.scrollTriggerPct   ?? 50,
    timeTriggerSeconds: popupSettingsRaw?.timeTriggerSeconds ?? 60,
    maxExitPlatforms:   popupSettingsRaw?.maxExitPlatforms   ?? 3,
  }

  const configuredIds: string[] = popupSettingsRaw
    ? (() => { try { return JSON.parse(popupSettingsRaw.popupPlatformIds || '[]') } catch { return [] } })()
    : []

  let popupPlatformsRaw = configuredIds.length > 0
    ? await prisma.bettingPlatform.findMany({
        where: { id: { in: configuredIds }, isActive: true },
        orderBy: { rating: 'desc' },
      })
    : await prisma.bettingPlatform.findMany({
        where: { isActive: true },
        orderBy: { rating: 'desc' },
        take: 5,
      })

  // Smart: sort mentioned platforms first
  const contentLower = (post.title + ' ' + post.content).toLowerCase()
  popupPlatformsRaw = [
    ...popupPlatformsRaw.filter((p) => contentLower.includes(p.name.toLowerCase())),
    ...popupPlatformsRaw.filter((p) => !contentLower.includes(p.name.toLowerCase())),
  ]

  // Apply geo offers to popup platforms (batch)
  const popupGeoOffers = await getGeoOffersForPlatforms(popupPlatformsRaw.map((p) => p.id), 'DEFAULT')

  const popupPlatforms = popupPlatformsRaw.map((p) => {
    const geo = popupGeoOffers.get(p.id)
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      logo: p.logo,
      bonusText: geo ? geo.bonusText : p.bonusText,         // raw (no flag) for popup display
      affiliateUrl: geo?.affiliateUrl || p.affiliateUrl,
      rating: p.rating,
      minDeposit: geo?.minDeposit || p.minDeposit,
      pros: (() => { try { return JSON.parse(p.pros || '[]') as string[] } catch { return [] } })(),
      visibilityType: p.visibilityType,
      allowedCountries: (() => { try { return JSON.parse(p.allowedCountries || '[]') as string[] } catch { return [] } })(),
      blockedCountries: (() => { try { return JSON.parse(p.blockedCountries || '[]') as string[] } catch { return [] } })(),
    }
  })

  return (
    <div className="min-h-screen bg-[#060910]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-yellow-400">Blog</Link></li>
            <li>/</li>
            <li className="text-gray-300 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* ── HEADER AD ─────────────────────────────────────────────────── */}
        {headerAds.length > 0 && (
          <div className="mb-6">
            <AdSponsoredLabel label="Sponsored" />
            <div className="flex flex-col gap-3">
              {headerAds.map((ad) => (
                <BlogPlatformWidget
                  key={ad.id}
                  platform={ad.platform}
                  adId={ad.id}
                  badge={ad.badge}
                  highlightPoints={ad.highlightPoints}
                  variant="BANNER"
                  position="HEADER"
                  blogId={post.id}
                  blogSlug={post.slug}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── 3-COLUMN LAYOUT ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-6 items-start">

          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block">
            {leftAds.length > 0 && (
              <div className="sticky top-4 flex flex-col gap-4">
                <AdSponsoredLabel label="Our Partners" />
                {leftAds.slice(0, 3).map((ad) => (
                  <BlogPlatformWidget
                    key={ad.id}
                    platform={ad.platform}
                    adId={ad.id}
                    badge={ad.badge}
                    highlightPoints={ad.highlightPoints}
                    variant="SIDEBAR"
                    position="LEFT_SIDEBAR"
                    blogId={post.id}
                    blogSlug={post.slug}
                  />
                ))}
              </div>
            )}
          </aside>

          {/* MAIN CONTENT */}
          <main className="min-w-0">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-yellow-400 mb-5">
              <ArrowLeft size={14} />
              Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">
                <Tag size={11} />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={11} />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : ''}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed border-l-4 border-yellow-400 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Mobile sidebar strip (horizontal scroll) */}
            {(leftAds.length > 0 || rightAds.length > 0) && (
              <div className="lg:hidden mb-6 overflow-x-auto">
                <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                  {[...leftAds, ...rightAds].slice(0, 4).map((ad) => (
                    <div key={ad.id} className="w-64 shrink-0">
                      <BlogPlatformWidget
                        platform={ad.platform}
                        adId={ad.id}
                        badge={ad.badge}
                        highlightPoints={ad.highlightPoints}
                        variant="SIDEBAR"
                        position="LEFT_SIDEBAR"
                        blogId={post.id}
                        blogSlug={post.slug}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className="prose prose-invert prose-yellow max-w-none text-gray-300 leading-relaxed"
              style={{
                '--tw-prose-headings': 'white',
                '--tw-prose-bold': 'white',
              } as React.CSSProperties}
            >
              {renderContent(post.content, inContentAds, post.id, post.slug)}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <Link href="/blog" className="text-yellow-400 hover:underline text-sm">← More Articles</Link>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block">
            {rightAds.length > 0 && (
              <div className="sticky top-4 flex flex-col gap-4">
                <AdSponsoredLabel label="Our Partners" />
                {rightAds.slice(0, 3).map((ad) => (
                  <BlogPlatformWidget
                    key={ad.id}
                    platform={ad.platform}
                    adId={ad.id}
                    badge={ad.badge}
                    highlightPoints={ad.highlightPoints}
                    variant="SIDEBAR"
                    position="RIGHT_SIDEBAR"
                    blogId={post.id}
                    blogSlug={post.slug}
                  />
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* ── FOOTER AD ─────────────────────────────────────────────────── */}
        {footerAds.length > 0 && (
          <div className="mt-10">
            <AdSponsoredLabel label="Sponsored" />
            <div className="flex flex-col gap-3">
              {footerAds.map((ad) => (
                <BlogPlatformWidget
                  key={ad.id}
                  platform={ad.platform}
                  adId={ad.id}
                  badge={ad.badge}
                  highlightPoints={ad.highlightPoints}
                  variant="BANNER"
                  position="FOOTER"
                  blogId={post.id}
                  blogSlug={post.slug}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Organization', name: 'CRONBET' },
            publisher: { '@type': 'Organization', name: 'CRONBET' },
            datePublished: post.publishedAt,
          }),
        }}
      />

      {/* ── Popup Widgets (scroll / exit-intent / time) ──────────────── */}
      <PopupWidgets
        blogId={post.id}
        blogSlug={post.slug}
        platforms={popupPlatforms}
        settings={popupSettings}
      />
    </div>
  )
}

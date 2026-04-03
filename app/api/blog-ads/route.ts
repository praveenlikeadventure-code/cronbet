import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ads = await prisma.blogAd.findMany({
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    })

    // Fetch platforms for each ad
    const platformIds = Array.from(new Set(ads.map((a) => a.platformId)))
    const platforms = await prisma.bettingPlatform.findMany({
      where: { id: { in: platformIds } },
    })
    const platformMap = Object.fromEntries(platforms.map((p) => [p.id, p]))

    const result = ads.map((ad) => ({
      ...ad,
      positions: JSON.parse(ad.positions || '["ALL"]'),
      highlightPoints: JSON.parse(ad.highlightPoints || '[]'),
      specificBlogIds: JSON.parse(ad.specificBlogIds || '[]'),
      platform: platformMap[ad.platformId] ?? null,
    }))

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog ads' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      name,
      platformId,
      positions = ['ALL'],
      badge,
      highlightPoints = [],
      priority = 0,
      isActive = true,
      displayOnAllBlogs = true,
      specificBlogIds = [],
    } = body

    if (!name || !platformId) {
      return NextResponse.json({ error: 'name and platformId are required' }, { status: 400 })
    }

    const ad = await prisma.blogAd.create({
      data: {
        name,
        platformId,
        positions: JSON.stringify(positions),
        badge: badge || null,
        highlightPoints: JSON.stringify(highlightPoints),
        priority,
        isActive,
        displayOnAllBlogs,
        specificBlogIds: JSON.stringify(specificBlogIds),
      },
    })

    return NextResponse.json({
      ...ad,
      positions,
      highlightPoints,
      specificBlogIds,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create blog ad' }, { status: 500 })
  }
}

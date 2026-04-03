import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { adId, platformId, blogId, blogSlug, position, popupType, action } = body

    if (!platformId || !position) {
      return NextResponse.json({ error: 'platformId and position are required' }, { status: 400 })
    }

    await prisma.affiliateClick.create({
      data: {
        adId: adId || '',
        platformId,
        blogId: blogId || null,
        blogSlug: blogSlug || null,
        position,
        popupType: popupType || null,
        action: action || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30')
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  try {
    const clicks = await prisma.affiliateClick.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    })

    // Aggregate: clicks by platform + position
    const byPlatformPosition: Record<string, { platformId: string; position: string; count: number }> = {}
    for (const click of clicks) {
      const key = `${click.platformId}:${click.position}`
      if (!byPlatformPosition[key]) {
        byPlatformPosition[key] = { platformId: click.platformId, position: click.position, count: 0 }
      }
      byPlatformPosition[key].count++
    }

    // Popup stats: claimed vs dismissed vs auto_closed per popup type
    const popupClicks = clicks.filter((c) => c.popupType)
    const byPopupType: Record<string, { type: string; claimed: number; dismissed: number; auto_closed: number; total: number }> = {}
    for (const click of popupClicks) {
      const t = click.popupType!
      if (!byPopupType[t]) byPopupType[t] = { type: t, claimed: 0, dismissed: 0, auto_closed: 0, total: 0 }
      byPopupType[t].total++
      const act = click.action ?? 'claimed'
      if (act === 'claimed') byPopupType[t].claimed++
      else if (act === 'dismissed') byPopupType[t].dismissed++
      else if (act === 'auto_closed') byPopupType[t].auto_closed++
    }

    return NextResponse.json({
      total: clicks.length,
      byPlatformPosition: Object.values(byPlatformPosition).sort((a, b) => b.count - a.count),
      byPopupType: Object.values(byPopupType),
      recentClicks: clicks.slice(0, 50),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch clicks' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEFAULTS = {
  scrollEnabled: true,
  exitEnabled: true,
  timeEnabled: true,
  scrollTriggerPct: 50,
  timeTriggerSeconds: 60,
  maxExitPlatforms: 3,
  popupPlatformIds: '[]',
  displayOnAllBlogs: true,
  specificBlogIds: '[]',
}

export async function GET() {
  try {
    const settings = await prisma.popupSettings.findUnique({ where: { id: 'singleton' } })

    if (!settings) {
      // Return defaults without writing to DB (lazy creation)
      return NextResponse.json({
        ...DEFAULTS,
        popupPlatformIds: [],
        specificBlogIds: [],
      })
    }

    return NextResponse.json({
      ...settings,
      popupPlatformIds: JSON.parse(settings.popupPlatformIds || '[]'),
      specificBlogIds: JSON.parse(settings.specificBlogIds || '[]'),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch popup settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      scrollEnabled,
      exitEnabled,
      timeEnabled,
      scrollTriggerPct,
      timeTriggerSeconds,
      maxExitPlatforms,
      popupPlatformIds,
      displayOnAllBlogs,
      specificBlogIds,
    } = body

    const data: Record<string, unknown> = {}
    if (scrollEnabled !== undefined) data.scrollEnabled = scrollEnabled
    if (exitEnabled !== undefined) data.exitEnabled = exitEnabled
    if (timeEnabled !== undefined) data.timeEnabled = timeEnabled
    if (scrollTriggerPct !== undefined) data.scrollTriggerPct = scrollTriggerPct
    if (timeTriggerSeconds !== undefined) data.timeTriggerSeconds = timeTriggerSeconds
    if (maxExitPlatforms !== undefined) data.maxExitPlatforms = maxExitPlatforms
    if (popupPlatformIds !== undefined) data.popupPlatformIds = JSON.stringify(popupPlatformIds)
    if (displayOnAllBlogs !== undefined) data.displayOnAllBlogs = displayOnAllBlogs
    if (specificBlogIds !== undefined) data.specificBlogIds = JSON.stringify(specificBlogIds)

    const settings = await prisma.popupSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...DEFAULTS, ...data },
    })

    return NextResponse.json({
      ...settings,
      popupPlatformIds: JSON.parse(settings.popupPlatformIds || '[]'),
      specificBlogIds: JSON.parse(settings.specificBlogIds || '[]'),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to save popup settings' }, { status: 500 })
  }
}

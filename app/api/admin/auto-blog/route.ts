import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.autoBlogSettings.findUnique({ where: { id: 'singleton' } })
  if (!settings) {
    // Return defaults if not yet created
    return NextResponse.json({
      id: 'singleton',
      enabled: false,
      publishTime: '09:00',
      useRotation: true,
      topicIndex: 0,
      lastPublishedAt: null,
    })
  }
  return NextResponse.json(settings)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const settings = await prisma.autoBlogSettings.upsert({
    where: { id: 'singleton' },
    update: {
      enabled: data.enabled,
      publishTime: data.publishTime,
      useRotation: data.useRotation,
    },
    create: {
      id: 'singleton',
      enabled: data.enabled ?? false,
      publishTime: data.publishTime ?? '09:00',
      useRotation: data.useRotation ?? true,
    },
  })
  return NextResponse.json(settings)
}

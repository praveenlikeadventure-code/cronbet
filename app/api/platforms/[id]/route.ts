import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePlatform } from '@/lib/types'

function serializeArrayFields(data: Record<string, unknown>) {
  const result = { ...data }
  for (const field of ['pros', 'cons', 'sports', 'payments', 'allowedCountries', 'blockedCountries']) {
    if (Array.isArray(result[field])) result[field] = JSON.stringify(result[field])
  }
  return result
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const platform = await prisma.bettingPlatform.findUnique({ where: { id: params.id } })
  if (!platform) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(parsePlatform(platform as Record<string, unknown>))
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = serializeArrayFields(await req.json())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platform = await prisma.bettingPlatform.update({ where: { id: params.id }, data: data as any })
  return NextResponse.json(platform)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.bettingPlatform.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

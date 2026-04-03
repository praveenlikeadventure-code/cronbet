import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePlatforms } from '@/lib/types'

function serializeArrayFields(data: Record<string, unknown>) {
  const result = { ...data }
  for (const field of ['pros', 'cons', 'sports', 'payments']) {
    if (Array.isArray(result[field])) result[field] = JSON.stringify(result[field])
  }
  return result
}

export async function GET() {
  const platforms = await prisma.bettingPlatform.findMany({
    orderBy: { rank: 'asc' },
  })
  return NextResponse.json(parsePlatforms(platforms as Record<string, unknown>[]))
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = serializeArrayFields(await req.json())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platform = await prisma.bettingPlatform.create({ data: data as any })
  return NextResponse.json(platform, { status: 201 })
}

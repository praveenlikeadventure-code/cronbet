import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/page-geo          → all rules
// GET /api/page-geo?path=... → single rule for that path
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (path) {
    const rule = await prisma.pageGeoRule.findUnique({ where: { pagePath: path } })
    return NextResponse.json(rule ?? null)
  }

  const rules = await prisma.pageGeoRule.findMany({ orderBy: { pageLabel: 'asc' } })
  return NextResponse.json(rules)
}

// POST /api/page-geo  → upsert rule
export async function POST(request: Request) {
  try {
    const { pagePath, pageLabel, isRestricted, allowedCountries } = await request.json()
    if (!pagePath || !pageLabel) {
      return NextResponse.json({ error: 'pagePath and pageLabel are required' }, { status: 400 })
    }

    const rule = await prisma.pageGeoRule.upsert({
      where: { pagePath },
      update: {
        pageLabel,
        isRestricted: Boolean(isRestricted),
        allowedCountries: JSON.stringify(Array.isArray(allowedCountries) ? allowedCountries : []),
      },
      create: {
        pagePath,
        pageLabel,
        isRestricted: Boolean(isRestricted),
        allowedCountries: JSON.stringify(Array.isArray(allowedCountries) ? allowedCountries : []),
      },
    })

    return NextResponse.json(rule)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to save rule' }, { status: 500 })
  }
}

// DELETE /api/page-geo?path=... → remove rule
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 })

  try {
    await prisma.pageGeoRule.delete({ where: { pagePath: path } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Ctx = { params: { id: string } }

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const offers = await prisma.platformGeoOffer.findMany({
      where: { platformId: params.id },
      orderBy: [{ countryCode: 'asc' }],
    })
    return NextResponse.json(offers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch geo offers' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      countryCode, countryName, currencyCode, currencySymbol,
      bonusText, bonusAmount, minDeposit, affiliateUrl, isActive = true,
    } = body

    if (!countryCode || !bonusText) {
      return NextResponse.json({ error: 'countryCode and bonusText required' }, { status: 400 })
    }

    const offer = await prisma.platformGeoOffer.upsert({
      where: { platformId_countryCode: { platformId: params.id, countryCode: countryCode.toUpperCase() } },
      update: { countryName, currencyCode, currencySymbol, bonusText, bonusAmount: bonusAmount || '', minDeposit: minDeposit || '', affiliateUrl: affiliateUrl || '', isActive },
      create: {
        platformId: params.id,
        countryCode: countryCode.toUpperCase(),
        countryName, currencyCode, currencySymbol,
        bonusText, bonusAmount: bonusAmount || '', minDeposit: minDeposit || '',
        affiliateUrl: affiliateUrl || '', isActive,
      },
    })

    return NextResponse.json(offer)
  } catch {
    return NextResponse.json({ error: 'Failed to save geo offer' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const offerId = searchParams.get('offerId')
    if (!offerId) return NextResponse.json({ error: 'offerId required' }, { status: 400 })

    await prisma.platformGeoOffer.delete({ where: { id: offerId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete geo offer' }, { status: 500 })
  }
}

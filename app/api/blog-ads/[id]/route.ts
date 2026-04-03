import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ad = await prisma.blogAd.findUnique({ where: { id: params.id } })
    if (!ad) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({
      ...ad,
      positions: JSON.parse(ad.positions || '["ALL"]'),
      highlightPoints: JSON.parse(ad.highlightPoints || '[]'),
      specificBlogIds: JSON.parse(ad.specificBlogIds || '[]'),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog ad' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      name,
      platformId,
      positions,
      badge,
      highlightPoints,
      priority,
      isActive,
      displayOnAllBlogs,
      specificBlogIds,
    } = body

    const ad = await prisma.blogAd.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(platformId !== undefined && { platformId }),
        ...(positions !== undefined && { positions: JSON.stringify(positions) }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(highlightPoints !== undefined && { highlightPoints: JSON.stringify(highlightPoints) }),
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
        ...(displayOnAllBlogs !== undefined && { displayOnAllBlogs }),
        ...(specificBlogIds !== undefined && { specificBlogIds: JSON.stringify(specificBlogIds) }),
      },
    })

    return NextResponse.json({
      ...ad,
      positions: JSON.parse(ad.positions || '["ALL"]'),
      highlightPoints: JSON.parse(ad.highlightPoints || '[]'),
      specificBlogIds: JSON.parse(ad.specificBlogIds || '[]'),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to update blog ad' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.blogAd.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete blog ad' }, { status: 500 })
  }
}

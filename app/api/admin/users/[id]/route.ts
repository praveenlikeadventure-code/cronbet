import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { email, name, password, role } = await req.json()

  const data: Record<string, unknown> = { email, name: name || null, role }
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 12)
  }

  const user = await prisma.adminUser.update({
    where: { id: params.id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Prevent deleting yourself
  if (params.id === session.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  await prisma.adminUser.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

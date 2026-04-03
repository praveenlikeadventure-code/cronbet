import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import AdminNav from '../../AdminNav'
import { prisma } from '@/lib/prisma'
import UserForm from '@/components/admin/UserForm'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role !== 'SUPER_ADMIN') redirect('/admin')

  const user = await prisma.adminUser.findUnique({
    where: { id: params.id },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) notFound()

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/users" className="text-gray-400 hover:text-yellow-400 text-sm">← Team</Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-2xl font-extrabold text-white">Edit: {user.name ?? user.email}</h1>
        </div>
        <UserForm user={user} isEdit />
      </div>
    </div>
  )
}

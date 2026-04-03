import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminNav from '../AdminNav'
import { PlusCircle, Edit } from 'lucide-react'
import DeleteUserButton from './DeleteUserButton'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role !== 'SUPER_ADMIN') redirect('/admin')

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    BLOG_EDITOR: 'Blog Editor',
    PLATFORM_EDITOR: 'Platform Editor',
  }

  const roleBadge: Record<string, string> = {
    SUPER_ADMIN: 'bg-yellow-400/20 text-yellow-400',
    BLOG_EDITOR: 'bg-blue-400/20 text-blue-400',
    PLATFORM_EDITOR: 'bg-purple-400/20 text-purple-400',
  }

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Team Members</h1>
            <p className="text-gray-400 text-sm mt-1">Manage admin access and roles</p>
          </div>
          <Link
            href="/admin/users/new"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
          >
            <PlusCircle size={15} /> Add Member
          </Link>
        </div>

        <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/3">
                <th className="text-left py-3 px-4 text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-gray-400">Role</th>
                <th className="text-left py-3 px-4 text-gray-400 hidden md:table-cell">Added</th>
                <th className="text-left py-3 px-4 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 px-4 text-white font-medium">{u.name || '—'}</td>
                  <td className="py-3 px-4 text-gray-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[u.role] ?? 'bg-white/10 text-gray-300'}`}>
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded flex items-center gap-1"
                      >
                        <Edit size={11} /> Edit
                      </Link>
                      {u.id !== session.user.id && (
                        <DeleteUserButton id={u.id} name={u.name ?? u.email} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-[#0f1629] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">Role Permissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400">
            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
              <span className="text-yellow-400 font-bold block mb-1">Super Admin</span>
              Full access — platforms, blog, team management
            </div>
            <div className="bg-blue-400/5 border border-blue-400/20 rounded-lg p-3">
              <span className="text-blue-400 font-bold block mb-1">Blog Editor</span>
              Can create and manage blog posts only
            </div>
            <div className="bg-purple-400/5 border border-purple-400/20 rounded-lg p-3">
              <span className="text-purple-400 font-bold block mb-1">Platform Editor</span>
              Can create and manage betting platforms only
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

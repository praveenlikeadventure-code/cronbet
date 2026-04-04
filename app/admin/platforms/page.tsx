import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminNav from '../AdminNav'
import { PlusCircle, Edit, ExternalLink } from 'lucide-react'
import DeletePlatformButton from './DeletePlatformButton'

export default async function AdminPlatformsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role === 'BLOG_EDITOR') redirect('/admin/blog')

  const platforms = await prisma.bettingPlatform.findMany({ orderBy: { rank: 'asc' } })

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-white">Betting Platforms</h1>
          <Link href="/admin/platforms/new" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
            <PlusCircle size={15} /> Add Platform
          </Link>
        </div>

        <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/3">
                <th className="text-left py-3 px-4 text-gray-400">Rank</th>
                <th className="text-left py-3 px-4 text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-gray-400 hidden md:table-cell">Bonus</th>
                <th className="text-left py-3 px-4 text-gray-400">Rating</th>
                <th className="text-left py-3 px-4 text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 hidden lg:table-cell">Visibility</th>
                <th className="text-left py-3 px-4 text-gray-400">Featured</th>
                <th className="text-left py-3 px-4 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 px-4 text-gray-400">{p.rank}</td>
                  <td className="py-3 px-4 text-white font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-yellow-400 hidden md:table-cell">{p.bonusText || '—'}</td>
                  <td className="py-3 px-4 text-white">{p.rating}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {(() => {
                      const vType = p.visibilityType || 'ALL_COUNTRIES'
                      if (vType === 'ALL_COUNTRIES') {
                        return <span className="text-xs text-gray-400">🌍 All</span>
                      }
                      if (vType === 'ALLOWED_ONLY') {
                        const count = (() => { try { return JSON.parse(p.allowedCountries || '[]').length } catch { return 0 } })()
                        return <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">🎯 {count} allowed</span>
                      }
                      if (vType === 'BLOCKED_ONLY') {
                        const count = (() => { try { return JSON.parse(p.blockedCountries || '[]').length } catch { return 0 } })()
                        return <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">🚫 {count} blocked</span>
                      }
                    })()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isFeatured ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-500'}`}>
                      {p.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/platforms/${p.id}`} className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded flex items-center gap-1">
                        <Edit size={11} /> Edit
                      </Link>
                      <Link href={`/review/${p.slug}`} target="_blank" className="text-xs text-gray-500 hover:text-yellow-400">
                        <ExternalLink size={13} />
                      </Link>
                      <DeletePlatformButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

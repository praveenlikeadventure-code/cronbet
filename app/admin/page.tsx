import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminNav from './AdminNav'
import { Star, FileText, TrendingUp, PlusCircle, Users } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role === 'BLOG_EDITOR') redirect('/admin/blog')
  if (session.user.role === 'PLATFORM_EDITOR') redirect('/admin/platforms')

  const [totalPlatforms, activePlatforms, totalPosts, publishedPosts, totalUsers] = await Promise.all([
    prisma.bettingPlatform.count(),
    prisma.bettingPlatform.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.adminUser.count(),
  ])

  const recentPlatforms = await prisma.bettingPlatform.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <div className="flex gap-3">
            <Link href="/admin/platforms/new" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
              <PlusCircle size={15} /> Add Platform
            </Link>
            <Link href="/admin/blog/new" className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-1.5">
              <PlusCircle size={15} /> New Post
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Star, label: 'Total Platforms', value: totalPlatforms, sub: `${activePlatforms} active` },
            { icon: TrendingUp, label: 'Active Platforms', value: activePlatforms, sub: 'Shown on site' },
            { icon: FileText, label: 'Blog Posts', value: totalPosts, sub: `${publishedPosts} published` },
            { icon: Users, label: 'Team Members', value: totalUsers, sub: 'Admin users' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
              <Icon size={20} className="text-yellow-400 mb-2" />
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-sm text-gray-300">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Platforms</h2>
              <Link href="/admin/platforms" className="text-yellow-400 text-sm hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentPlatforms.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-white text-sm font-medium">{p.name}</span>
                    <span className="text-xs text-gray-500">#{p.rank}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-sm">{p.rating}</span>
                    <Link href={`/admin/platforms/${p.id}`} className="text-xs text-gray-400 hover:text-yellow-400">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { href: '/admin/platforms', label: 'Manage Betting Platforms', icon: Star },
                { href: '/admin/platforms/new', label: 'Add New Platform', icon: PlusCircle },
                { href: '/admin/blog', label: 'Manage Blog Posts', icon: FileText },
                { href: '/admin/blog/new', label: 'Write New Article', icon: PlusCircle },
                { href: '/admin/users', label: 'Manage Team Members', icon: Users },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <Icon size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-300">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

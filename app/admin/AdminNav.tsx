'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Crown, LayoutDashboard, Star, FileText, LogOut, Users, Settings, Megaphone } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  BLOG_EDITOR: 'Blog Editor',
  PLATFORM_EDITOR: 'Platform Editor',
  CONTRIBUTOR: 'Contributor',
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-yellow-400/20 text-yellow-400',
  BLOG_EDITOR: 'bg-blue-400/20 text-blue-400',
  PLATFORM_EDITOR: 'bg-purple-400/20 text-purple-400',
  CONTRIBUTOR: 'bg-green-400/20 text-green-400',
}

export default function AdminNav() {
  const { data: session } = useSession()
  const role = session?.user?.role ?? 'SUPER_ADMIN'

  const canSeeDashboard = role === 'SUPER_ADMIN'
  const canSeePlatforms = role === 'SUPER_ADMIN' || role === 'PLATFORM_EDITOR'
  const canSeeBlog = role === 'SUPER_ADMIN' || role === 'BLOG_EDITOR' || role === 'CONTRIBUTOR'
  const canSeeBlogAds = role === 'SUPER_ADMIN' || role === 'CONTRIBUTOR'
  const canSeeTeam = role === 'SUPER_ADMIN'
  const canSeeSettings = role === 'SUPER_ADMIN'

  return (
    <nav className="bg-[#0f1629] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Crown className="text-yellow-400 w-5 h-5" />
            <span className="font-extrabold text-white">CRON<span className="text-yellow-400">BET</span></span>
            <span className="text-xs bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded">Admin</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            {canSeeDashboard && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            )}
            {canSeePlatforms && (
              <Link href="/admin/platforms" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Star size={15} /> Platforms
              </Link>
            )}
            {canSeeBlog && (
              <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <FileText size={15} /> Blog
              </Link>
            )}
            {canSeeBlogAds && (
              <Link href="/admin/blog-ads" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Megaphone size={15} /> Blog Ads
              </Link>
            )}
            {canSeeTeam && (
              <Link href="/admin/users" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Users size={15} /> Team
              </Link>
            )}
            {canSeeSettings && (
              <Link href="/admin/settings" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Settings size={15} /> Settings
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.name && (
            <span className="text-xs text-gray-500 hidden sm:block">{session.user.name}</span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:block ${ROLE_COLORS[role] ?? 'bg-white/10 text-gray-300'}`}>
            {ROLE_LABELS[role] ?? role}
          </span>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">View Site</Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}

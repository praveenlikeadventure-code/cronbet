'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Crown, LayoutDashboard, Star, FileText, LogOut, Users, Settings } from 'lucide-react'

export default function AdminNav() {
  const { data: session } = useSession()
  const role = session?.user?.role ?? 'SUPER_ADMIN'

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
            {(role === 'SUPER_ADMIN') && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            )}
            {(role === 'SUPER_ADMIN' || role === 'PLATFORM_EDITOR') && (
              <Link href="/admin/platforms" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Star size={15} /> Platforms
              </Link>
            )}
            {(role === 'SUPER_ADMIN' || role === 'BLOG_EDITOR') && (
              <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <FileText size={15} /> Blog
              </Link>
            )}
            {role === 'SUPER_ADMIN' && (
              <Link href="/admin/users" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400">
                <Users size={15} /> Team
              </Link>
            )}
            {role === 'SUPER_ADMIN' && (
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
          <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:block ${
            role === 'SUPER_ADMIN' ? 'bg-yellow-400/20 text-yellow-400' :
            role === 'BLOG_EDITOR' ? 'bg-blue-400/20 text-blue-400' :
            'bg-purple-400/20 text-purple-400'
          }`}>
            {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'BLOG_EDITOR' ? 'Blog Editor' : 'Platform Editor'}
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

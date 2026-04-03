import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import AdminNav from '../../AdminNav'
import PlatformForm from '@/components/platform/PlatformForm'

export default async function NewPlatformPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role === 'BLOG_EDITOR') redirect('/admin/blog')

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/platforms" className="text-gray-400 hover:text-yellow-400 text-sm">← Platforms</Link>
          <span className="text-gray-600">/</span>
          <h1 className="text-2xl font-extrabold text-white">Add New Platform</h1>
        </div>
        <PlatformForm />
      </div>
    </div>
  )
}

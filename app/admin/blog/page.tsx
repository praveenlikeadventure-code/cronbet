import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminNav from '../AdminNav'
import { PlusCircle, Edit, Sparkles, Eye } from 'lucide-react'
import DeleteBlogButton from './DeleteBlogButton'
import PublishBlogButton from './PublishBlogButton'

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')
  if (session.user.role === 'PLATFORM_EDITOR') redirect('/admin/platforms')

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-white">Blog Posts</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/blog/generate"
              className="bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
            >
              <Sparkles size={15} /> Generate with AI
            </Link>
            <Link
              href="/admin/blog/new"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
            >
              <PlusCircle size={15} /> New Post
            </Link>
          </div>
        </div>

        <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Words</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <p className="mb-2">No blog posts yet.</p>
                    <div className="flex items-center justify-center gap-3">
                      <Link href="/admin/blog/generate" className="text-yellow-400 hover:underline text-sm">
                        Generate with AI
                      </Link>
                      <span className="text-gray-700">or</span>
                      <Link href="/admin/blog/new" className="text-yellow-400 hover:underline text-sm">
                        Write manually
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((p) => {
                  const wordCount = p.content.split(/\s+/).filter(Boolean).length
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-white font-medium max-w-[240px]">
                        <span className="block truncate">{p.title}</span>
                        <span className="text-xs text-gray-600 truncate block">/blog/{p.slug}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
                        {wordCount.toLocaleString()} w
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">
                        {p.publishedAt
                          ? new Date(p.publishedAt).toLocaleDateString()
                          : new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/blog/${p.id}`}
                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded flex items-center gap-1"
                          >
                            <Edit size={11} /> Edit
                          </Link>
                          <PublishBlogButton id={p.id} isPublished={p.isPublished} />
                          <Link
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-2 py-1.5 rounded flex items-center gap-1"
                          >
                            <Eye size={11} />
                          </Link>
                          <DeleteBlogButton id={p.id} title={p.title} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

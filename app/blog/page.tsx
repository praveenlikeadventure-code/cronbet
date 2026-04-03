export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Betting Guides',
  description: 'Expert betting tips, platform reviews, and bonus guides. Everything you need to bet smarter.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })

  const categories = ['All', 'Betting Tips', 'Platform Reviews', 'Bonus Guides', 'General']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">Blog</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-3">Blog & Betting Guides</h1>
      <p className="text-gray-400 mb-8">Expert tips, reviews, and guides to help you bet smarter.</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer border transition-colors
              ${cat === 'All' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 text-gray-300 border-white/10 hover:border-yellow-400/40'}`}
          >
            {cat}
          </span>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No posts published yet.</p>
          <p className="text-sm mt-2">Check back soon for expert betting guides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all group"
            >
              <div className="h-40 bg-gradient-to-br from-[#131a2f] to-[#0a0e1a] flex items-center justify-center">
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={12} className="text-yellow-400" />
                  <span className="text-xs text-yellow-400">{post.category}</span>
                </div>
                <h2 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={11} />
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Recently published'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

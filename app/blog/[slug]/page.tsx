export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return {}
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || '',
    openGraph: { title: post.title, description: post.excerpt || '' },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true },
  })

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:text-yellow-400">Blog</Link></li>
          <li>/</li>
          <li className="text-gray-300 truncate max-w-[200px]">{post.title}</li>
        </ol>
      </nav>

      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-yellow-400 mb-6">
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">
          <Tag size={11} />
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={11} />
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : ''}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>

      {post.excerpt && (
        <p className="text-xl text-gray-300 mb-8 leading-relaxed border-l-4 border-yellow-400 pl-4">
          {post.excerpt}
        </p>
      )}

      <div
        className="prose prose-invert prose-yellow max-w-none text-gray-300 leading-relaxed"
        style={{
          '--tw-prose-headings': 'white',
          '--tw-prose-bold': 'white',
        } as React.CSSProperties}
      >
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-3">{line.slice(2)}</h2>
          if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-2">{line.slice(3)}</h3>
          if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(4)}</h4>
          if (line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-300">{line.slice(2)}</li>
          if (line === '') return <br key={i} />
          return <p key={i} className="text-gray-300 mb-3">{line}</p>
        })}
      </div>

      <div className="mt-10 pt-8 border-t border-white/10">
        <Link href="/blog" className="text-yellow-400 hover:underline text-sm">← More Articles</Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Organization', name: 'CRONBET' },
            publisher: { '@type': 'Organization', name: 'CRONBET' },
            datePublished: post.publishedAt,
          }),
        }}
      />
    </div>
  )
}

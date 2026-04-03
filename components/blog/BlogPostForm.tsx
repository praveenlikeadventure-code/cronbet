'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPost } from '@/lib/types'

interface BlogPostFormProps {
  post?: Partial<BlogPost>
  isEdit?: boolean
}

const CATEGORIES = ['Betting Tips', 'Platform Reviews', 'Bonus Guides', 'General']

export default function BlogPostForm({ post, isEdit = false }: BlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    category: post?.category || 'General',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    isPublished: post?.isPublished || false,
  })

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))
  const autoSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      publishedAt: form.isPublished ? new Date().toISOString() : null,
    }

    const url = isEdit ? `/api/blog/${post?.id}` : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/blog')
      router.refresh()
    } else {
      alert('Error saving post')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Post Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => {
                update('title', e.target.value)
                if (!isEdit) update('slug', autoSlug(e.target.value))
              }}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="Post title..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0f1629]">{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
              placeholder="Brief summary for SEO and card previews..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Content (Markdown supported) *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              rows={16}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 font-mono resize-y"
              placeholder="# Heading&#10;&#10;Write your article content here..."
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Meta Title</label>
            <input
              value={form.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="SEO title (defaults to post title)"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Meta Description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              rows={2}
              maxLength={160}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
              placeholder="SEO description (max 160 characters)"
            />
            <span className="text-xs text-gray-500">{form.metaDescription.length}/160</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update('isPublished', e.target.checked)}
            className="w-4 h-4 accent-yellow-400"
          />
          <span className="text-sm text-gray-300">Publish immediately</span>
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-xl transition-colors"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </form>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { Globe, EyeOff } from 'lucide-react'

export default function PublishBlogButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter()

  const handleToggle = async () => {
    await fetch(`/api/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isPublished: !isPublished,
        publishedAt: !isPublished ? new Date().toISOString() : null,
      }),
    })
    router.refresh()
  }

  return (
    <button
      onClick={handleToggle}
      title={isPublished ? 'Unpublish' : 'Publish'}
      className={`text-xs px-2 py-1.5 rounded flex items-center gap-1 ${
        isPublished
          ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
          : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
      }`}
    >
      {isPublished ? <EyeOff size={11} /> : <Globe size={11} />}
    </button>
  )
}

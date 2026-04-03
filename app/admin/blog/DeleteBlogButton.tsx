'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 px-1.5 py-1.5 rounded">
      <Trash2 size={13} />
    </button>
  )
}

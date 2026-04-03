'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeletePlatformButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    await fetch(`/api/platforms/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-300 px-1.5 py-1.5 rounded"
      title="Delete"
    >
      <Trash2 size={13} />
    </button>
  )
}

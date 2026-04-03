'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserFormProps {
  user?: { id: string; email: string; name: string | null; role: string }
  isEdit?: boolean
}

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full access — platforms, blog, team management' },
  { value: 'BLOG_EDITOR', label: 'Blog Editor', desc: 'Can create and manage blog posts only' },
  { value: 'PLATFORM_EDITOR', label: 'Platform Editor', desc: 'Can create and manage betting platforms only' },
]

export default function UserForm({ user, isEdit = false }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    role: user?.role ?? 'BLOG_EDITOR',
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = isEdit ? `/api/admin/users/${user?.id}` : '/api/admin/users'
    const method = isEdit ? 'PUT' : 'POST'

    const payload: Record<string, string> = { email: form.email, name: form.name, role: form.role }
    if (form.password) payload.password = form.password

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/users')
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || 'Error saving user')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Account Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">
              Password {isEdit && <span className="text-gray-600">(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder={isEdit ? 'Leave blank to keep unchanged' : 'Min 8 characters'}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Role & Permissions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => update('role', r.value)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                form.role === r.value
                  ? r.value === 'SUPER_ADMIN'
                    ? 'bg-yellow-400/10 border-yellow-400 text-white'
                    : r.value === 'BLOG_EDITOR'
                    ? 'bg-blue-400/10 border-blue-400 text-white'
                    : 'bg-purple-400/10 border-purple-400 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${
                form.role === r.value
                  ? r.value === 'SUPER_ADMIN' ? 'text-yellow-400'
                  : r.value === 'BLOG_EDITOR' ? 'text-blue-400'
                  : 'text-purple-400'
                  : 'text-gray-300'
              }`}>
                {r.label}
              </div>
              <div className="text-xs leading-relaxed">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

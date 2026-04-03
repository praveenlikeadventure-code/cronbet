'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, X } from 'lucide-react'
import { BettingPlatform } from '@/lib/types'

interface PlatformFormProps {
  platform?: Partial<BettingPlatform>
  isEdit?: boolean
}

const SPORTS_OPTIONS = ['Football', 'Cricket', 'eSports', 'Crypto-Friendly', 'Basketball', 'Tennis', 'Hockey', 'Baseball', 'Rugby', 'Boxing', 'MMA', 'Golf', 'Volleyball', 'Kabaddi', 'Horse Racing']
const PAYMENT_OPTIONS = ['Visa', 'Mastercard', 'PayPal', 'Bitcoin', 'Ethereum', 'Litecoin', 'Skrill', 'Neteller', 'WebMoney', 'UPI', 'Bank Transfer']

export default function PlatformForm({ platform, isEdit = false }: PlatformFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: platform?.name || '',
    slug: platform?.slug || '',
    logo: platform?.logo || '',
    bonusText: platform?.bonusText || '',
    affiliateUrl: platform?.affiliateUrl || '#',
    rating: platform?.rating || 4.0,
    minDeposit: platform?.minDeposit || '',
    payoutSpeed: platform?.payoutSpeed || '',
    license: platform?.license || '',
    isFeatured: platform?.isFeatured || false,
    rank: platform?.rank || 999,
    isActive: platform?.isActive ?? true,
    description: platform?.description || '',
    pros: platform?.pros || [''],
    cons: platform?.cons || [''],
    sports: platform?.sports || [],
    payments: platform?.payments || [],
  })

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleList = (key: 'pros' | 'cons', idx: number, value: string) => {
    const arr = [...form[key]]
    arr[idx] = value
    update(key, arr)
  }

  const addListItem = (key: 'pros' | 'cons') => update(key, [...form[key], ''])
  const removeListItem = (key: 'pros' | 'cons', idx: number) =>
    update(key, form[key].filter((_, i) => i !== idx))

  const toggleArray = (key: 'sports' | 'payments', value: string) => {
    const arr = form[key]
    update(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      pros: form.pros.filter(Boolean),
      cons: form.cons.filter(Boolean),
    }

    const url = isEdit ? `/api/platforms/${platform?.id}` : '/api/platforms'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/platforms')
      router.refresh()
    } else {
      alert('Error saving platform')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Platform Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                update('name', e.target.value)
                if (!isEdit) update('slug', autoSlug(e.target.value))
              }}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
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
            <label className="block text-sm text-gray-400 mb-1.5">Logo URL</label>
            <input
              value={form.logo}
              onChange={(e) => update('logo', e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Affiliate URL *</label>
            <input
              value={form.affiliateUrl}
              onChange={(e) => update('affiliateUrl', e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">Welcome Bonus Text</label>
            <input
              value={form.bonusText}
              onChange={(e) => update('bonusText', e.target.value)}
              placeholder="100% up to $200"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Ratings & Settings */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Ratings & Settings</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Rating (1-5)</label>
            <input
              type="number"
              min="1" max="5" step="0.1"
              value={form.rating}
              onChange={(e) => update('rating', parseFloat(e.target.value))}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Rank</label>
            <input
              type="number"
              min="1"
              value={form.rank}
              onChange={(e) => update('rank', parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Min Deposit</label>
            <input
              value={form.minDeposit}
              onChange={(e) => update('minDeposit', e.target.value)}
              placeholder="$10"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Payout Speed</label>
            <input
              value={form.payoutSpeed}
              onChange={(e) => update('payoutSpeed', e.target.value)}
              placeholder="1-3 days"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">License</label>
            <input
              value={form.license}
              onChange={(e) => update('license', e.target.value)}
              placeholder="Curaçao"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update('isActive', e.target.checked)}
                className="w-4 h-4 accent-yellow-400"
              />
              <span className="text-sm text-gray-300">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-yellow-400"
              />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['pros', 'cons'] as const).map((key) => (
          <div key={key} className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 capitalize">{key}</h2>
            {form[key].map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={item}
                  onChange={(e) => handleList(key, i, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  placeholder={`${key === 'pros' ? 'Advantage' : 'Disadvantage'}...`}
                />
                <button
                  type="button"
                  onClick={() => removeListItem(key, i)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(key)}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 mt-2"
            >
              <PlusCircle size={13} /> Add {key === 'pros' ? 'Pro' : 'Con'}
            </button>
          </div>
        ))}
      </div>

      {/* Sports */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Sports Covered</h2>
        <div className="flex flex-wrap gap-2">
          {SPORTS_OPTIONS.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => toggleArray('sports', sport)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                form.sports.includes(sport)
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-yellow-400/40'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Payments */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">Payment Methods</h2>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_OPTIONS.map((payment) => (
            <button
              key={payment}
              type="button"
              onClick={() => toggleArray('payments', payment)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                form.payments.includes(payment)
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-yellow-400/40'
              }`}
            >
              {payment}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Platform' : 'Create Platform'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/platforms')}
          className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

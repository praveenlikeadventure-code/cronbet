'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, X, Globe, Target, Ban, Upload, Sparkles, Image } from 'lucide-react'
import { BettingPlatform, VisibilityType } from '@/lib/types'
import { ALL_COUNTRIES_LIST } from '@/lib/geo-data'

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
    visibilityType: (platform?.visibilityType || 'ALL_COUNTRIES') as VisibilityType,
    allowedCountries: platform?.allowedCountries || [] as string[],
    blockedCountries: platform?.blockedCountries || [] as string[],
  })
  const [countrySearch, setCountrySearch] = useState('')
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoGenerating, setLogoGenerating] = useState(false)
  const [logoError, setLogoError] = useState('')
  // FIX 4: track suggestion banners
  const [geoSuggestion, setGeoSuggestion] = useState<string | null>(null)   // country code suggestion from visibility
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const visibilityCountryKey = form.visibilityType === 'BLOCKED_ONLY' ? 'blockedCountries' : 'allowedCountries'

  // FIX 4: when adding to ALLOWED_ONLY, suggest geo offer
  const toggleCountry = (code: string) => {
    const arr = form[visibilityCountryKey] as string[]
    const willAdd = !arr.includes(code)
    update(visibilityCountryKey, willAdd ? [...arr, code] : arr.filter((c) => c !== code))
    if (willAdd && form.visibilityType === 'ALLOWED_ONLY') {
      const country = ALL_COUNTRIES_LIST.find((c) => c.code === code)
      setGeoSuggestion(country ? `${country.flag} ${country.name}` : code)
      setTimeout(() => setGeoSuggestion(null), 6000)
    }
  }

  const filteredCountries = ALL_COUNTRIES_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  // --- Logo upload ---
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError('')
    setLogoUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/logos/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (res.ok) {
        update('logo', json.url)
      } else {
        setLogoError(json.error || 'Upload failed')
      }
    } catch {
      setLogoError('Upload failed')
    } finally {
      setLogoUploading(false)
    }
  }

  // --- Logo AI generate ---
  async function handleLogoGenerate() {
    if (!form.name) {
      setLogoError('Enter the platform name first')
      return
    }
    setLogoError('')
    setLogoGenerating(true)
    try {
      const res = await fetch('/api/logos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformName: form.name }),
      })
      const json = await res.json()
      if (res.ok) {
        update('logo', json.url)
      } else {
        setLogoError(json.error || 'Generation failed')
      }
    } catch {
      setLogoError('Generation failed')
    } finally {
      setLogoGenerating(false)
    }
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

          {/* FIX 1: Logo upload widget — full-width */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-400 mb-1.5">Platform Logo</label>
            <div className="bg-white/3 border border-white/10 rounded-xl p-4 space-y-3">
              {/* Preview */}
              {form.logo && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-lg object-contain bg-white/5 border border-white/10 p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="text-xs text-gray-500 break-all flex-1">{form.logo}</span>
                  <button
                    type="button"
                    onClick={() => update('logo', '')}
                    className="text-red-400 hover:text-red-300 p-1 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {!form.logo && (
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/5 border border-dashed border-white/20">
                  <Image size={22} className="text-gray-600" />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoUploading}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                >
                  <Upload size={14} />
                  {logoUploading ? 'Uploading...' : 'Upload Logo'}
                </button>
                <button
                  type="button"
                  onClick={handleLogoGenerate}
                  disabled={logoGenerating}
                  className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-300 border border-purple-500/30 text-sm px-3 py-2 rounded-lg transition-colors"
                >
                  <Sparkles size={14} />
                  {logoGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>

              {/* Manual URL fallback */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Or paste URL directly</label>
                <input
                  value={form.logo}
                  onChange={(e) => update('logo', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              {logoError && <p className="text-red-400 text-xs">{logoError}</p>}
            </div>
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

      {/* Country Visibility */}
      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Globe size={18} className="text-yellow-400" /> Country Visibility
        </h2>
        <p className="text-sm text-gray-500 mb-4">Control which countries can see this platform</p>

        {/* Mode selector */}
        <div className="space-y-2 mb-5">
          {([
            { value: 'ALL_COUNTRIES', icon: Globe,  label: 'Show to all countries (default)' },
            { value: 'ALLOWED_ONLY',  icon: Target, label: 'Show ONLY to selected countries' },
            { value: 'BLOCKED_ONLY',  icon: Ban,    label: 'Show to all EXCEPT selected countries' },
          ] as { value: VisibilityType; icon: typeof Globe; label: string }[]).map(({ value, icon: Icon, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="visibilityType"
                checked={form.visibilityType === value}
                onChange={() => update('visibilityType', value)}
                className="accent-yellow-400 w-4 h-4"
              />
              <Icon size={15} className={form.visibilityType === value ? 'text-yellow-400' : 'text-gray-500'} />
              <span className={`text-sm ${form.visibilityType === value ? 'text-white' : 'text-gray-400'}`}>{label}</span>
            </label>
          ))}
        </div>

        {/* FIX 4: suggestion banner when a country is added to ALLOWED_ONLY */}
        {geoSuggestion && (
          <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2.5 mb-4 text-sm text-blue-300">
            <span className="mt-0.5">💡</span>
            <span>
              <strong>{geoSuggestion}</strong> added to allowed countries.{' '}
              Would you like to add a geo-specific offer for this country?{' '}
              <span className="text-gray-400">(Scroll down to Geo-Specific Offers after saving)</span>
            </span>
            <button type="button" onClick={() => setGeoSuggestion(null)} className="ml-auto text-gray-500 hover:text-white shrink-0">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Country selector — shown when ALLOWED_ONLY or BLOCKED_ONLY */}
        {form.visibilityType !== 'ALL_COUNTRIES' && (
          <div>
            <div className="text-sm text-gray-400 mb-3 font-medium">
              {form.visibilityType === 'ALLOWED_ONLY' ? 'Allowed Countries' : 'Blocked Countries'}
            </div>

            {/* Selected chips */}
            {(form[visibilityCountryKey] as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {(form[visibilityCountryKey] as string[]).map((code) => {
                  const c = ALL_COUNTRIES_LIST.find((x) => x.code === code)
                  return (
                    <span key={code} className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs px-2.5 py-1 rounded-full">
                      {c?.flag} {c?.name ?? code}
                      <button type="button" onClick={() => toggleCountry(code)} className="hover:text-red-400 transition-colors">
                        <X size={11} />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            {/* Search + dropdown */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-400 mb-1"
              />
              <div className="max-h-48 overflow-y-auto border border-white/10 rounded-lg bg-[#0a0e1a] divide-y divide-white/5">
                {filteredCountries.map((c) => {
                  const selected = (form[visibilityCountryKey] as string[]).includes(c.code)
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => toggleCountry(c.code)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
                        selected
                          ? 'bg-yellow-400/10 text-yellow-300'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span className="flex-1">{c.name}</span>
                      <span className="text-gray-600 text-xs">{c.code}</span>
                      {selected && <span className="text-yellow-400 text-xs">✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
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

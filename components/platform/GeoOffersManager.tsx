'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, PlusCircle, Trash2, Save, CheckCircle, Edit, X } from 'lucide-react'
import { COUNTRIES } from '@/lib/geo-data'

interface GeoOffer {
  id: string
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  bonusText: string
  bonusAmount: string
  minDeposit: string
  affiliateUrl: string
  isActive: boolean
}

const COUNTRY_META = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, { flag: c.flag, currency: c.currency, symbol: c.symbol, name: c.name }])
)

const blank: Omit<GeoOffer, 'id'> = {
  countryCode: 'IN',
  countryName: 'India',
  currencyCode: 'INR',
  currencySymbol: '₹',
  bonusText: '',
  bonusAmount: '',
  minDeposit: '',
  affiliateUrl: '',
  isActive: true,
}

export default function GeoOffersManager({ platformId, platformAffiliateUrl }: { platformId: string; platformAffiliateUrl: string }) {
  const [offers, setOffers] = useState<GeoOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/platforms/${platformId}/geo-offers`)
    if (res.ok) setOffers(await res.json())
    setLoading(false)
  }, [platformId])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm({ ...blank, affiliateUrl: platformAffiliateUrl })
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(o: GeoOffer) {
    setForm({ ...o })
    setEditingId(o.id)
    setShowForm(true)
  }

  function applyCountryMeta(code: string) {
    const meta = COUNTRY_META[code]
    if (meta) {
      setForm((f) => ({
        ...f,
        countryCode: code,
        countryName: meta.name,
        currencyCode: meta.currency,
        currencySymbol: meta.symbol,
      }))
    }
  }

  async function handleSave() {
    if (!form.bonusText) return
    setSaving(true)
    try {
      const res = await fetch(`/api/platforms/${platformId}/geo-offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        setShowForm(false)
        await load()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(offerId: string) {
    if (!confirm('Delete this geo offer?')) return
    await fetch(`/api/platforms/${platformId}/geo-offers?offerId=${offerId}`, { method: 'DELETE' })
    await load()
  }

  async function toggleActive(o: GeoOffer) {
    await fetch(`/api/platforms/${platformId}/geo-offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...o, isActive: !o.isActive }),
    })
    await load()
  }

  const countryOpts = COUNTRIES.filter((c) => c.code !== 'DEFAULT')
  const defaultOpts = COUNTRIES.filter((c) => c.code === 'DEFAULT')
  const allOpts = [...defaultOpts, ...countryOpts]

  return (
    <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Globe size={16} className="text-yellow-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Geo-Specific Offers</h2>
            <p className="text-xs text-gray-500">Show localised bonus amounts & currencies per country</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
        >
          <PlusCircle size={13} /> Add Country Offer
        </button>
      </div>

      {/* Offers table */}
      {loading ? (
        <p className="text-gray-500 text-sm text-center py-4">Loading...</p>
      ) : offers.length === 0 ? (
        <div className="text-center py-6 text-gray-600 text-sm">
          No geo offers yet. Add a <strong className="text-gray-400">DEFAULT</strong> offer first, then add country-specific ones.
        </div>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-gray-400">Country</th>
                <th className="text-left py-2 px-3 text-gray-400">Bonus</th>
                <th className="text-left py-2 px-3 text-gray-400 hidden sm:table-cell">Min Deposit</th>
                <th className="text-left py-2 px-3 text-gray-400 hidden md:table-cell">Currency</th>
                <th className="text-left py-2 px-3 text-gray-400">Active</th>
                <th className="text-left py-2 px-3 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* DEFAULT first */}
              {[...offers].sort((a, b) => (a.countryCode === 'DEFAULT' ? -1 : b.countryCode === 'DEFAULT' ? 1 : 0)).map((o) => {
                const meta = COUNTRY_META[o.countryCode]
                const flag = meta?.flag ?? '🌍'
                return (
                  <tr key={o.id} className={`border-b border-white/5 hover:bg-white/2 ${o.countryCode === 'DEFAULT' ? 'bg-yellow-400/3' : ''}`}>
                    <td className="py-2 px-3 text-white font-medium">
                      <span className="mr-1">{flag}</span>
                      {o.countryCode === 'DEFAULT' ? 'Default (USD)' : o.countryName}
                    </td>
                    <td className="py-2 px-3 text-yellow-400 font-semibold">{o.bonusText}</td>
                    <td className="py-2 px-3 text-gray-400 hidden sm:table-cell">{o.minDeposit || '—'}</td>
                    <td className="py-2 px-3 text-gray-400 hidden md:table-cell">{o.currencyCode} {o.currencySymbol}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => toggleActive(o)}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${o.isActive ? 'bg-green-500' : 'bg-white/10'}`}
                      >
                        <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow transition-transform ${o.isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(o)} className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded flex items-center gap-0.5">
                          <Edit size={9} /> Edit
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded flex items-center gap-0.5">
                          <Trash2 size={9} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="border border-white/10 rounded-xl p-4 bg-white/2 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">{editingId ? 'Edit Offer' : 'Add Geo Offer'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Country */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Country</label>
              <select
                value={form.countryCode}
                onChange={(e) => applyCountryMeta(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              >
                {allOpts.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code}) — {c.currency}</option>
                ))}
              </select>
            </div>

            {/* Bonus text */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Bonus Text *</label>
              <input
                value={form.bonusText}
                onChange={(e) => setForm((f) => ({ ...f, bonusText: e.target.value }))}
                placeholder={`e.g. 100% up to ${form.currencySymbol}8,500`}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Currency code + symbol */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Currency Code</label>
              <input
                value={form.currencyCode}
                onChange={(e) => setForm((f) => ({ ...f, currencyCode: e.target.value }))}
                placeholder="INR"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Currency Symbol</label>
              <input
                value={form.currencySymbol}
                onChange={(e) => setForm((f) => ({ ...f, currencySymbol: e.target.value }))}
                placeholder="₹"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Bonus amount (raw number) */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Bonus Amount (number only)</label>
              <input
                value={form.bonusAmount}
                onChange={(e) => setForm((f) => ({ ...f, bonusAmount: e.target.value }))}
                placeholder="8500"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Min deposit */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min Deposit</label>
              <input
                value={form.minDeposit}
                onChange={(e) => setForm((f) => ({ ...f, minDeposit: e.target.value }))}
                placeholder={`${form.currencySymbol}100`}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Affiliate URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Affiliate URL (leave blank to use platform default)</label>
              <input
                value={form.affiliateUrl}
                onChange={(e) => setForm((f) => ({ ...f, affiliateUrl: e.target.value }))}
                placeholder={platformAffiliateUrl}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400">Active</label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !form.bonusText}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm"
            >
              <Save size={13} />
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Offer'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm">
              Cancel
            </button>
            {saved && <span className="text-green-400 text-sm flex items-center gap-1"><CheckCircle size={13} /> Saved</span>}
          </div>
        </div>
      )}
    </div>
  )
}

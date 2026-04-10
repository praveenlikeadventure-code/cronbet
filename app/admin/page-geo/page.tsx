'use client'

import { useState, useEffect } from 'react'
import AdminNav from '../AdminNav'
import { Globe, Plus, Save, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { ALL_COUNTRIES_LIST } from '@/lib/geo-data'

interface PageGeoRule {
  id?: string
  pagePath: string
  pageLabel: string
  isRestricted: boolean
  allowedCountries: string // JSON
}

interface EditState {
  pagePath: string
  pageLabel: string
  isRestricted: boolean
  allowedCountries: string[]
}

const PREDEFINED_PAGES = [
  { path: '/ipl-betting', label: 'IPL Betting' },
  { path: '/cricket-betting', label: 'Cricket Betting' },
  { path: '/compare', label: 'Compare' },
  { path: '/best-bonuses', label: 'Best Bonuses' },
  { path: '/blog', label: 'Blog' },
]

export default function PageGeoPage() {
  const [rules, setRules] = useState<PageGeoRule[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPath, setNewPath] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [countrySearch, setCountrySearch] = useState('')

  useEffect(() => {
    fetch('/api/page-geo')
      .then((r) => r.json())
      .then((data) => { setRules(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function parseCountries(json: string): string[] {
    try { return JSON.parse(json) } catch { return [] }
  }

  function startEdit(rule: PageGeoRule) {
    setEditing({
      pagePath: rule.pagePath,
      pageLabel: rule.pageLabel,
      isRestricted: rule.isRestricted,
      allowedCountries: parseCountries(rule.allowedCountries),
    })
    setCountrySearch('')
  }

  function startNew(path = '', label = '') {
    setEditing({ pagePath: path, pageLabel: label, isRestricted: true, allowedCountries: [] })
    setShowAddForm(false)
    setCountrySearch('')
  }

  function toggleCountry(code: string) {
    if (!editing) return
    setEditing((e) => {
      if (!e) return e
      const has = e.allowedCountries.includes(code)
      return {
        ...e,
        allowedCountries: has
          ? e.allowedCountries.filter((c) => c !== code)
          : [...e.allowedCountries, code],
      }
    })
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch('/api/page-geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath: editing.pagePath,
          pageLabel: editing.pageLabel,
          isRestricted: editing.isRestricted,
          allowedCountries: editing.allowedCountries,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      const updated: PageGeoRule = await res.json()

      setRules((prev) => {
        const idx = prev.findIndex((r) => r.pagePath === updated.pagePath)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = updated
          return next
        }
        return [...prev, updated]
      })

      setEditing(null)
      setFlash({ type: 'success', msg: 'Rule saved.' })
      setTimeout(() => setFlash(null), 3000)
    } catch {
      setFlash({ type: 'error', msg: 'Failed to save.' })
      setTimeout(() => setFlash(null), 4000)
    } finally {
      setSaving(false)
    }
  }

  async function deleteRule(pagePath: string) {
    if (!confirm(`Remove geo rule for ${pagePath}?`)) return
    try {
      const res = await fetch(`/api/page-geo?path=${encodeURIComponent(pagePath)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setRules((prev) => prev.filter((r) => r.pagePath !== pagePath))
      if (editing?.pagePath === pagePath) setEditing(null)
      setFlash({ type: 'success', msg: 'Rule removed.' })
      setTimeout(() => setFlash(null), 3000)
    } catch {
      setFlash({ type: 'error', msg: 'Failed to delete.' })
      setTimeout(() => setFlash(null), 4000)
    }
  }

  const filteredCountries = ALL_COUNTRIES_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  const unconfiguredPages = PREDEFINED_PAGES.filter(
    (p) => !rules.find((r) => r.pagePath === p.path),
  )

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Globe className="text-gray-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Page Visibility</h1>
              <p className="text-gray-500 text-sm">Restrict pages to specific countries</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} /> Add Rule
          </button>
        </div>

        {/* Flash */}
        {flash && (
          <div className={`mb-6 flex items-center gap-2 text-sm px-4 py-3 rounded-lg border ${
            flash.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {flash.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {flash.msg}
          </div>
        )}

        {/* Quick-add predefined pages */}
        {unconfiguredPages.length > 0 && !showAddForm && !editing && (
          <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-4 mb-6">
            <p className="text-xs text-yellow-400/70 mb-3">Suggested pages without a rule:</p>
            <div className="flex flex-wrap gap-2">
              {unconfiguredPages.map((p) => (
                <button
                  key={p.path}
                  onClick={() => startNew(p.path, p.label)}
                  className="text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Plus size={11} /> {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add custom path form */}
        {showAddForm && (
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-white font-semibold mb-4">Add Custom Page Rule</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Page path</label>
                <input
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="/my-page"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Display label</label>
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="My Page"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { if (newPath && newLabel) startNew(newPath, newLabel) }}
                disabled={!newPath || !newLabel}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-bold px-4 py-2 rounded-lg text-sm"
              >
                Configure
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewPath(''); setNewLabel('') }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Rules list */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Configured Rules</h2>
            {loading ? (
              <div className="bg-[#0f1629] border border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                Loading rules...
              </div>
            ) : rules.length === 0 ? (
              <div className="bg-[#0f1629] border border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                No rules configured yet. Add one above.
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => {
                  const countries = parseCountries(rule.allowedCountries)
                  const isActive = editing?.pagePath === rule.pagePath
                  return (
                    <div
                      key={rule.pagePath}
                      className={`bg-[#0f1629] border rounded-xl p-4 cursor-pointer transition-colors ${
                        isActive ? 'border-yellow-400/50' : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => startEdit(rule)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-white text-sm">{rule.pageLabel}</span>
                          <span className="ml-2 text-xs text-gray-600">{rule.pagePath}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            rule.isRestricted
                              ? 'bg-yellow-400/15 text-yellow-400'
                              : 'bg-green-400/15 text-green-400'
                          }`}>
                            {rule.isRestricted ? 'Restricted' : 'Global'}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteRule(rule.pagePath) }}
                            className="text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      {rule.isRestricted && countries.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {countries.map((c) => {
                            const country = ALL_COUNTRIES_LIST.find((x) => x.code === c)
                            return (
                              <span key={c} className="text-xs bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                                {country?.flag} {c}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      {rule.isRestricted && countries.length === 0 && (
                        <p className="text-xs text-orange-400/70 mt-1">⚠ Restricted but no countries allowed — everyone blocked</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Edit panel */}
          {editing && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Edit: {editing.pageLabel}
              </h2>
              <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 space-y-5">

                {/* Restriction toggle */}
                <div className="flex items-center justify-between p-3 bg-white/3 rounded-lg border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">Restrict by country</p>
                    <p className="text-xs text-gray-500 mt-0.5">Off = visible globally</p>
                  </div>
                  <button
                    onClick={() => setEditing((e) => e ? { ...e, isRestricted: !e.isRestricted } : e)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editing.isRestricted ? 'bg-yellow-400' : 'bg-white/10'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      editing.isRestricted ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Country selector */}
                {editing.isRestricted && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-400">Allowed countries</label>
                      {editing.allowedCountries.length > 0 && (
                        <button
                          onClick={() => setEditing((e) => e ? { ...e, allowedCountries: [] } : e)}
                          className="text-xs text-gray-600 hover:text-red-400 flex items-center gap-1"
                        >
                          <X size={10} /> Clear all
                        </button>
                      )}
                    </div>

                    {/* Selected tags */}
                    {editing.allowedCountries.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-white/3 rounded-lg border border-white/5 min-h-[44px]">
                        {editing.allowedCountries.map((code) => {
                          const c = ALL_COUNTRIES_LIST.find((x) => x.code === code)
                          return (
                            <button
                              key={code}
                              onClick={() => toggleCountry(code)}
                              className="flex items-center gap-1 text-xs bg-yellow-400/15 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full hover:bg-red-400/15 hover:text-red-400 hover:border-red-400/20 transition-colors"
                            >
                              {c?.flag} {code} <X size={9} />
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Search */}
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50 mb-2"
                    />

                    {/* Country list */}
                    <div className="max-h-56 overflow-y-auto space-y-0.5 rounded-lg border border-white/10 bg-white/3 p-1">
                      {filteredCountries.map((c) => {
                        const selected = editing.allowedCountries.includes(c.code)
                        return (
                          <button
                            key={c.code}
                            onClick={() => toggleCountry(c.code)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-left transition-colors ${
                              selected
                                ? 'bg-yellow-400/15 text-yellow-400'
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="text-base leading-none">{c.flag}</span>
                            <span className="flex-1">{c.name}</span>
                            <span className="text-xs text-gray-600">{c.code}</span>
                            {selected && <CheckCircle size={12} className="text-yellow-400 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>

                    {editing.allowedCountries.length === 0 && (
                      <p className="text-xs text-orange-400/70 mt-2">⚠ No countries selected — everyone will be blocked</p>
                    )}
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg text-sm"
                  >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Rule'}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 bg-white/3 border border-white/5 rounded-xl p-5 text-sm text-gray-500 space-y-1.5">
          <p><strong className="text-gray-400">How it works:</strong></p>
          <p>• <strong className="text-gray-400">Restricted + countries selected</strong> — only those countries can view the page</p>
          <p>• <strong className="text-gray-400">Restricted + no countries</strong> — page is blocked for everyone</p>
          <p>• <strong className="text-gray-400">Not restricted</strong> — page is visible globally</p>
          <p>• Undetected / DEFAULT country always sees the page (benefit of the doubt)</p>
          <p>• Restricted pages are also hidden from the site navigation for blocked users</p>
        </div>
      </div>
    </div>
  )
}

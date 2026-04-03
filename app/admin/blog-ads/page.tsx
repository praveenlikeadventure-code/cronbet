'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminNav from '../AdminNav'
import Image from 'next/image'
import {
  LayoutDashboard,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  TrendingUp,
  BarChart2,
  Bell,
  MousePointer,
  Clock,
  Scroll,
} from 'lucide-react'

const POSITIONS = ['HEADER', 'FOOTER', 'LEFT_SIDEBAR', 'RIGHT_SIDEBAR', 'IN_CONTENT', 'ALL'] as const

const BADGES = ['Top Pick', "Editor's Choice", 'Hot', 'New']

interface Platform {
  id: string
  name: string
  logo: string | null
  bonusText: string | null
  rating: number
  isActive: boolean
}

interface BlogAd {
  id: string
  name: string
  platformId: string
  positions: string[]
  badge: string | null
  highlightPoints: string[]
  priority: number
  isActive: boolean
  displayOnAllBlogs: boolean
  specificBlogIds: string[]
  platform: Platform | null
  createdAt: string
}

interface ClickStat {
  platformId: string
  position: string
  count: number
}

interface PopupStat {
  type: string
  claimed: number
  dismissed: number
  auto_closed: number
  total: number
}

interface PopupSettingsForm {
  scrollEnabled: boolean
  exitEnabled: boolean
  timeEnabled: boolean
  scrollTriggerPct: number
  timeTriggerSeconds: number
  maxExitPlatforms: number
  popupPlatformIds: string[]
}

const defaultForm = {
  name: '',
  platformId: '',
  positions: ['ALL'] as string[],
  badge: '',
  highlightPoints: ['', ''],
  priority: 0,
  isActive: true,
  displayOnAllBlogs: true,
  specificBlogIds: [] as string[],
}

export default function BlogAdsPage() {
  const [ads, setAds] = useState<BlogAd[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [clickStats, setClickStats] = useState<{ total: number; byPlatformPosition: ClickStat[]; byPopupType?: PopupStat[] } | null>(null)
  const [popupForm, setPopupForm] = useState<PopupSettingsForm>({
    scrollEnabled: true,
    exitEnabled: true,
    timeEnabled: true,
    scrollTriggerPct: 50,
    timeTriggerSeconds: 60,
    maxExitPlatforms: 3,
    popupPlatformIds: [],
  })
  const [popupSaving, setPopupSaving] = useState(false)
  const [popupSaved, setPopupSaved] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [adsRes, platformsRes, clicksRes, popupRes] = await Promise.all([
        fetch('/api/blog-ads'),
        fetch('/api/platforms'),
        fetch('/api/affiliate-click?days=30'),
        fetch('/api/popup-settings'),
      ])
      if (adsRes.ok) setAds(await adsRes.json())
      if (platformsRes.ok) setPlatforms(await platformsRes.json())
      if (clicksRes.ok) setClickStats(await clicksRes.json())
      if (popupRes.ok) {
        const ps = await popupRes.json()
        setPopupForm({
          scrollEnabled: ps.scrollEnabled ?? true,
          exitEnabled: ps.exitEnabled ?? true,
          timeEnabled: ps.timeEnabled ?? true,
          scrollTriggerPct: ps.scrollTriggerPct ?? 50,
          timeTriggerSeconds: ps.timeTriggerSeconds ?? 60,
          maxExitPlatforms: ps.maxExitPlatforms ?? 3,
          popupPlatformIds: ps.popupPlatformIds ?? [],
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  async function savePopupSettings() {
    setPopupSaving(true)
    try {
      const res = await fetch('/api/popup-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popupForm),
      })
      if (res.ok) {
        setPopupSaved(true)
        setTimeout(() => setPopupSaved(false), 3000)
      }
    } finally {
      setPopupSaving(false)
    }
  }

  function togglePopupPlatform(id: string) {
    setPopupForm((f) => ({
      ...f,
      popupPlatformIds: f.popupPlatformIds.includes(id)
        ? f.popupPlatformIds.filter((x) => x !== id)
        : [...f.popupPlatformIds, id],
    }))
  }

  useEffect(() => { loadData() }, [loadData])

  function openAdd() {
    setForm(defaultForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(ad: BlogAd) {
    setForm({
      name: ad.name,
      platformId: ad.platformId,
      positions: ad.positions,
      badge: ad.badge || '',
      highlightPoints: [ad.highlightPoints[0] || '', ad.highlightPoints[1] || ''],
      priority: ad.priority,
      isActive: ad.isActive,
      displayOnAllBlogs: ad.displayOnAllBlogs,
      specificBlogIds: ad.specificBlogIds,
    })
    setEditingId(ad.id)
    setShowForm(true)
    setError('')
  }

  function togglePosition(pos: string) {
    if (pos === 'ALL') {
      setForm((f) => ({ ...f, positions: ['ALL'] }))
      return
    }
    setForm((f) => {
      const current = f.positions.filter((p) => p !== 'ALL')
      if (current.includes(pos)) {
        const next = current.filter((p) => p !== pos)
        return { ...f, positions: next.length ? next : ['ALL'] }
      }
      return { ...f, positions: [...current, pos] }
    })
  }

  async function handleSave() {
    if (!form.name || !form.platformId) {
      setError('Name and Platform are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        badge: form.badge || null,
        highlightPoints: form.highlightPoints.filter(Boolean),
      }
      const res = editingId
        ? await fetch(`/api/blog-ads/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/blog-ads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      setShowForm(false)
      setEditingId(null)
      await loadData()
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ad?')) return
    await fetch(`/api/blog-ads/${id}`, { method: 'DELETE' })
    await loadData()
  }

  async function toggleActive(ad: BlogAd) {
    await fetch(`/api/blog-ads/${ad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !ad.isActive }),
    })
    await loadData()
  }

  const positionLabel: Record<string, string> = {
    HEADER: 'Header',
    FOOTER: 'Footer',
    LEFT_SIDEBAR: 'Left Sidebar',
    RIGHT_SIDEBAR: 'Right Sidebar',
    IN_CONTENT: 'In-Content',
    ALL: 'All Positions',
  }

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Blog Ad Manager</h1>
            <p className="text-gray-400 text-sm mt-1">Control affiliate platform widgets on blog posts</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
          >
            <PlusCircle size={15} /> Add Widget
          </button>
        </div>

        {/* ── SECTION 1: Platform Widget Table ────────────────────────── */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <LayoutDashboard size={16} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Platform Widgets</h2>
            <span className="text-xs text-gray-500">({ads.length} configured)</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">Loading...</div>
          ) : ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm gap-2">
              <LayoutDashboard size={24} className="opacity-30" />
              No widgets configured yet. Click &quot;Add Widget&quot; to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3">
                    <th className="text-left py-3 px-4 text-gray-400">Platform</th>
                    <th className="text-left py-3 px-4 text-gray-400 hidden md:table-cell">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 hidden lg:table-cell">Positions</th>
                    <th className="text-left py-3 px-4 text-gray-400 hidden md:table-cell">Blogs</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-white/5 hover:bg-white/2">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {ad.platform?.logo ? (
                              <Image src={ad.platform.logo} alt={ad.platform.name} width={28} height={28} className="object-contain" />
                            ) : (
                              <span className="text-white text-xs font-bold">{ad.platform?.name?.slice(0, 2) ?? '?'}</span>
                            )}
                          </div>
                          <span className="text-white font-medium text-xs">{ad.platform?.name ?? 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 hidden md:table-cell">{ad.name}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {ad.positions.map((p) => (
                            <span key={p} className="text-[10px] px-1.5 py-0.5 bg-white/10 text-gray-300 rounded">
                              {positionLabel[p] ?? p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">
                        {ad.displayOnAllBlogs ? 'All posts' : `${ad.specificBlogIds.length} posts`}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleActive(ad)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${ad.isActive ? 'bg-green-500' : 'bg-white/10'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${ad.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(ad)}
                            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded flex items-center gap-1"
                          >
                            <Edit size={10} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id)}
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded flex items-center gap-1"
                          >
                            <Trash2 size={10} /> Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Add/Edit Form ─────────────────────────────────── */}
        {showForm && (
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Widget' : 'Add New Widget'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                {/* Widget name */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Widget Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. 1xBet Header Banner"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                  />
                </div>

                {/* Select platform */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Select Platform</label>
                  <select
                    value={form.platformId}
                    onChange={(e) => setForm((f) => ({ ...f, platformId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                  >
                    <option value="">— Choose a platform —</option>
                    {platforms.filter((p) => p.isActive).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Badge</label>
                  <div className="flex flex-wrap gap-2">
                    {['', ...BADGES].map((b) => (
                      <button
                        key={b || 'none'}
                        onClick={() => setForm((f) => ({ ...f, badge: b }))}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          form.badge === b
                            ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {b || 'None'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Highlight points */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Highlight Points (shown as green checkmarks)</label>
                  <div className="flex flex-col gap-2">
                    {[0, 1].map((i) => (
                      <input
                        key={i}
                        type="text"
                        value={form.highlightPoints[i] || ''}
                        onChange={(e) => {
                          const pts = [...form.highlightPoints]
                          pts[i] = e.target.value
                          setForm((f) => ({ ...f, highlightPoints: pts }))
                        }}
                        placeholder={i === 0 ? 'e.g. Huge sports selection' : 'e.g. Live streaming'}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                      />
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Priority (lower = shown first)</label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                    className="w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Positions */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Show At Positions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {POSITIONS.map((pos) => {
                      const checked = form.positions.includes(pos)
                      return (
                        <label key={pos} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePosition(pos)}
                            className="accent-yellow-400"
                          />
                          <span className="text-sm text-gray-300">{positionLabel[pos]}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Display on */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Display On</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={form.displayOnAllBlogs}
                        onChange={() => setForm((f) => ({ ...f, displayOnAllBlogs: true, specificBlogIds: [] }))}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-gray-300">All blog posts</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!form.displayOnAllBlogs}
                        onChange={() => setForm((f) => ({ ...f, displayOnAllBlogs: false }))}
                        className="accent-yellow-400"
                      />
                      <span className="text-sm text-gray-300">Specific blog posts only</span>
                    </label>
                  </div>
                  {!form.displayOnAllBlogs && (
                    <p className="text-xs text-gray-500 mt-2">
                      Configure specific posts from the blog editor (Affiliate Widgets section).
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className={`text-sm ${form.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                      {form.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
              >
                <Save size={14} />
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Widget'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
              >
                Cancel
              </button>
              {saved && (
                <span className="text-sm text-green-400 flex items-center gap-1.5">
                  <CheckCircle size={14} /> Saved!
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── SECTION 3: Click Performance ─────────────────────────────── */}
        {clickStats && clickStats.total > 0 && (
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={16} className="text-yellow-400" />
              <h2 className="text-lg font-bold text-white">Click Performance</h2>
              <span className="text-xs text-gray-500">Last 30 days · {clickStats.total} total clicks</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-gray-400 text-xs">Platform</th>
                    <th className="text-left py-2 px-3 text-gray-400 text-xs">Position</th>
                    <th className="text-left py-2 px-3 text-gray-400 text-xs">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {clickStats.byPlatformPosition.slice(0, 10).map((stat, i) => {
                    const platform = platforms.find((p) => p.id === stat.platformId)
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/2">
                        <td className="py-2 px-3 text-gray-300">
                          {platform?.name ?? stat.platformId.slice(0, 8)}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-gray-400 rounded">
                            {positionLabel[stat.position] ?? stat.position}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-yellow-400 font-bold">{stat.count}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {clickStats && clickStats.total === 0 && (
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 flex items-center gap-3 text-gray-500 text-sm">
            <BarChart2 size={16} />
            Click tracking will appear here once users start clicking affiliate links.
          </div>
        )}

        {/* ── SECTION 4: Popup Stats ──────────────────────────────────── */}
        {clickStats?.byPopupType && clickStats.byPopupType.length > 0 && (
          <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={16} className="text-blue-400" />
              <h2 className="text-lg font-bold text-white">Popup Performance</h2>
              <span className="text-xs text-gray-500">Last 30 days</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {clickStats.byPopupType.map((stat) => {
                const convRate = stat.total > 0 ? Math.round((stat.claimed / stat.total) * 100) : 0
                const iconMap: Record<string, React.ReactNode> = {
                  SCROLL: <Scroll size={14} className="text-yellow-400" />,
                  EXIT_INTENT: <MousePointer size={14} className="text-red-400" />,
                  TIME: <Clock size={14} className="text-blue-400" />,
                }
                const labelMap: Record<string, string> = {
                  SCROLL: 'Scroll Popup',
                  EXIT_INTENT: 'Exit Intent',
                  TIME: 'Time Popup',
                }
                return (
                  <div key={stat.type} className="bg-white/3 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {iconMap[stat.type] ?? <Bell size={14} />}
                      <span className="text-sm font-bold text-white">{labelMap[stat.type] ?? stat.type}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-1">{convRate}%</div>
                    <div className="text-xs text-gray-500 mb-2">conversion rate</div>
                    <div className="grid grid-cols-3 gap-1 text-center text-xs">
                      <div>
                        <div className="text-green-400 font-bold">{stat.claimed}</div>
                        <div className="text-gray-600">claimed</div>
                      </div>
                      <div>
                        <div className="text-red-400 font-bold">{stat.dismissed}</div>
                        <div className="text-gray-600">dismissed</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-bold">{stat.auto_closed}</div>
                        <div className="text-gray-600">auto-closed</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── SECTION 5: Popup Settings ───────────────────────────────── */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={16} className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Popup Settings</h2>
            <span className="text-xs text-gray-500">Controls scroll, exit-intent & time-based popups on blog posts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: toggles + triggers */}
            <div className="space-y-5">
              {/* Scroll popup */}
              <div className="flex items-start justify-between p-4 bg-white/3 rounded-lg border border-white/5">
                <div className="flex items-start gap-3">
                  <Scroll size={14} className="text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Scroll Popup</p>
                    <p className="text-xs text-gray-500 mt-0.5">Slides up from bottom-right after scrolling</p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs text-gray-400">Trigger at:</label>
                      <input
                        type="number"
                        min={10} max={90}
                        value={popupForm.scrollTriggerPct}
                        onChange={(e) => setPopupForm((f) => ({ ...f, scrollTriggerPct: parseInt(e.target.value) || 50 }))}
                        className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-yellow-400/50"
                      />
                      <span className="text-xs text-gray-500">% scrolled</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPopupForm((f) => ({ ...f, scrollEnabled: !f.scrollEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-0.5 ${popupForm.scrollEnabled ? 'bg-yellow-400' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${popupForm.scrollEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Exit intent */}
              <div className="flex items-start justify-between p-4 bg-white/3 rounded-lg border border-white/5">
                <div className="flex items-start gap-3">
                  <MousePointer size={14} className="text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Exit Intent Popup</p>
                    <p className="text-xs text-gray-500 mt-0.5">Full modal when mouse moves to top (desktop only)</p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs text-gray-400">Max platforms:</label>
                      <select
                        value={popupForm.maxExitPlatforms}
                        onChange={(e) => setPopupForm((f) => ({ ...f, maxExitPlatforms: parseInt(e.target.value) }))}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPopupForm((f) => ({ ...f, exitEnabled: !f.exitEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-0.5 ${popupForm.exitEnabled ? 'bg-red-400' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${popupForm.exitEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Time popup */}
              <div className="flex items-start justify-between p-4 bg-white/3 rounded-lg border border-white/5">
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Time-Based Popup</p>
                    <p className="text-xs text-gray-500 mt-0.5">Slides in from right after time on page</p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs text-gray-400">Trigger after:</label>
                      <input
                        type="number"
                        min={10} max={300}
                        value={popupForm.timeTriggerSeconds}
                        onChange={(e) => setPopupForm((f) => ({ ...f, timeTriggerSeconds: parseInt(e.target.value) || 60 }))}
                        className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-yellow-400/50"
                      />
                      <span className="text-xs text-gray-500">seconds</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPopupForm((f) => ({ ...f, timeEnabled: !f.timeEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-0.5 ${popupForm.timeEnabled ? 'bg-blue-400' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${popupForm.timeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Right: platform selection */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Platforms to show in popups{' '}
                <span className="text-gray-600">(empty = auto top-rated)</span>
              </label>
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {platforms.filter((p) => p.isActive).map((p) => {
                  const checked = popupForm.popupPlatformIds.includes(p.id)
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checked ? 'bg-yellow-400/5 border-yellow-400/30' : 'bg-white/3 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePopupPlatform(p.id)}
                        className="accent-yellow-400"
                      />
                      <div className="w-7 h-7 bg-white/5 rounded border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {p.logo ? (
                          <Image src={p.logo} alt={p.name} width={24} height={24} className="object-contain" />
                        ) : (
                          <span className="text-white text-[9px] font-bold">{p.name.slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium">{p.name}</div>
                        {p.bonusText && <div className="text-xs text-yellow-400 truncate">{p.bonusText}</div>}
                      </div>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Smart selection: platforms mentioned in the blog content are shown first automatically.
              </p>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10">
            <button
              onClick={savePopupSettings}
              disabled={popupSaving}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
            >
              <Save size={14} />
              {popupSaving ? 'Saving...' : 'Save Popup Settings'}
            </button>
            {popupSaved && (
              <span className="text-sm text-green-400 flex items-center gap-1.5">
                <CheckCircle size={14} /> Saved!
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

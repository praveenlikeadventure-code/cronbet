'use client'

import { useState, useEffect } from 'react'
import AdminNav from '../AdminNav'
import { Settings, Zap, Clock, RotateCcw, Save, CheckCircle } from 'lucide-react'

interface AutoBlogSettings {
  enabled: boolean
  publishTime: string
  useRotation: boolean
  lastPublishedAt: string | null
  topicIndex: number
}

const ROTATION_TOPICS = [
  'Is 1xBet safe to use in India in 2025?',
  'Top 5 cricket betting sites in India 2025',
  '1xBet vs Melbet: Which is better for Indian bettors?',
  'How to claim Melbet welcome bonus step by step',
  'Best betting apps for Android in India',
  'How to withdraw money from 22Bet — complete guide',
  'Best IPL betting sites 2025: Where to bet on cricket',
  "How to win at sports betting: honest guide (no BS)",
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AutoBlogSettings>({
    enabled: false,
    publishTime: '09:00',
    useRotation: true,
    lastPublishedAt: null,
    topicIndex: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/auto-blog')
      .then(r => r.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auto-blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const nextTopic = ROTATION_TOPICS[(settings.topicIndex ?? 0) % ROTATION_TOPICS.length]

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <Settings className="text-gray-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Settings</h1>
            <p className="text-gray-500 text-sm">Admin configuration and automation</p>
          </div>
        </div>

        {/* Auto Blog Publisher */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Zap className="text-yellow-400 w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Auto Blog Publisher</h2>
              <p className="text-xs text-gray-500">Automatically generate and publish 1 blog post per day using AI</p>
            </div>
          </div>

          {loading ? (
            <div className="h-20 flex items-center justify-center text-gray-500 text-sm">Loading settings...</div>
          ) : (
            <div className="space-y-5">

              {/* Enable toggle */}
              <div className="flex items-center justify-between p-4 bg-white/3 rounded-lg border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Publish 1 blog automatically every day</p>
                  <p className="text-xs text-gray-500 mt-0.5">Uses GPT-4o to write and publish a full blog post</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enabled ? 'bg-yellow-400' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Publish time */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 w-40 shrink-0">
                  <Clock size={14} />
                  Publish time
                </div>
                <input
                  type="time"
                  value={settings.publishTime}
                  onChange={e => setSettings(s => ({ ...s, publishTime: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                />
                <span className="text-xs text-gray-600">Server local time</span>
              </div>

              {/* Topic rotation */}
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 w-40 shrink-0 pt-0.5">
                  <RotateCcw size={14} />
                  Topic rotation
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.useRotation}
                      onChange={e => setSettings(s => ({ ...s, useRotation: e.target.checked }))}
                      className="accent-yellow-400"
                    />
                    <span className="text-sm text-white">Use suggestion topics in rotation</span>
                  </label>
                  <p className="text-xs text-gray-600 mt-1.5">Cycles through 8 pre-written topic ideas automatically</p>
                </div>
              </div>

              {/* Next topic preview */}
              {settings.useRotation && (
                <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Next topic in queue:</p>
                  <p className="text-sm text-yellow-400 font-medium">{nextTopic}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Topic {((settings.topicIndex ?? 0) % ROTATION_TOPICS.length) + 1} of {ROTATION_TOPICS.length}
                  </p>
                </div>
              )}

              {/* Last published */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500 w-40 shrink-0">Last published:</span>
                <span className="text-white">
                  {settings.lastPublishedAt
                    ? new Date(settings.lastPublishedAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>

              {/* Status indicator */}
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${settings.enabled ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                {settings.enabled
                  ? `Scheduler active — next post at ${settings.publishTime} daily`
                  : 'Scheduler is off'}
              </div>

            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-400 flex items-center gap-1.5">
              <CheckCircle size={14} />
              Settings saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Megaphone, CheckCircle, Globe, Lock } from 'lucide-react'

interface Platform {
  id: string
  name: string
  logo: string | null
}

interface BlogAd {
  id: string
  name: string
  platformId: string
  positions: string[]
  badge: string | null
  isActive: boolean
  displayOnAllBlogs: boolean
  specificBlogIds: string[]
  platform: Platform | null
}

interface Props {
  blogId: string
}

export default function BlogAffiliateWidgets({ blogId }: Props) {
  const [ads, setAds] = useState<BlogAd[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [useGlobal, setUseGlobal] = useState(true)

  const loadAds = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/blog-ads')
      if (res.ok) {
        const data: BlogAd[] = await res.json()
        setAds(data.filter((a) => a.isActive))
        // If any ad has this blog in specificBlogIds and !displayOnAllBlogs, we have custom overrides
        const hasCustom = data.some(
          (a) => !a.displayOnAllBlogs && a.specificBlogIds.includes(blogId)
        )
        setUseGlobal(!hasCustom)
      }
    } finally {
      setLoading(false)
    }
  }, [blogId])

  useEffect(() => { loadAds() }, [loadAds])

  async function toggleAdForBlog(ad: BlogAd, enable: boolean) {
    setSaving(ad.id)
    try {
      const currentIds: string[] = ad.specificBlogIds ?? []
      let newIds: string[]
      if (enable) {
        newIds = Array.from(new Set([...currentIds, blogId]))
      } else {
        newIds = currentIds.filter((id) => id !== blogId)
      }
      await fetch(`/api/blog-ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayOnAllBlogs: false,
          specificBlogIds: newIds,
        }),
      })
      await loadAds()
    } finally {
      setSaving(null)
    }
  }

  async function resetToGlobal() {
    // Remove this blog from all specificBlogIds (revert to global settings)
    setSaving('global')
    try {
      await Promise.all(
        ads
          .filter((a) => !a.displayOnAllBlogs && a.specificBlogIds.includes(blogId))
          .map((ad) =>
            fetch(`/api/blog-ads/${ad.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                specificBlogIds: ad.specificBlogIds.filter((id) => id !== blogId),
              }),
            })
          )
      )
      setUseGlobal(true)
      await loadAds()
    } finally {
      setSaving(null)
    }
  }

  const positionLabel: Record<string, string> = {
    HEADER: 'Header',
    FOOTER: 'Footer',
    LEFT_SIDEBAR: 'Left',
    RIGHT_SIDEBAR: 'Right',
    IN_CONTENT: 'In-Content',
    ALL: 'All',
  }

  const globalAds = ads.filter((a) => a.displayOnAllBlogs)
  const specificAds = ads.filter((a) => !a.displayOnAllBlogs)

  return (
    <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone size={16} className="text-yellow-400" />
        <h2 className="text-lg font-bold text-white">Affiliate Widgets</h2>
        <span className="text-xs text-gray-500">Controls which platform widgets appear on this post</span>
      </div>

      {/* Use global toggle */}
      <div className="flex items-center justify-between p-4 bg-white/3 rounded-lg border border-white/5 mb-4">
        <div className="flex items-center gap-2">
          {useGlobal ? <Globe size={14} className="text-green-400" /> : <Lock size={14} className="text-yellow-400" />}
          <div>
            <p className="text-sm font-medium text-white">
              {useGlobal ? 'Using global ad settings' : 'Custom overrides active for this post'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {useGlobal
                ? 'Widgets shown are controlled globally via Blog Ad Manager'
                : 'This post has custom widget selections — toggle to reset to global'}
            </p>
          </div>
        </div>
        <button
          onClick={useGlobal ? () => setUseGlobal(false) : resetToGlobal}
          disabled={saving === 'global'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${useGlobal ? 'bg-green-500' : 'bg-yellow-400'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${useGlobal ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">Loading widgets...</p>
      ) : (
        <>
          {/* Global ads (always shown) */}
          {globalAds.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Globe size={10} /> Shown on all posts (global)
              </p>
              <div className="flex flex-col gap-2">
                {globalAds.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between bg-green-500/5 border border-green-500/10 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/5 rounded border border-white/10 flex items-center justify-center overflow-hidden">
                        {ad.platform?.logo ? (
                          <Image src={ad.platform.logo} alt={ad.platform.name ?? ''} width={20} height={20} className="object-contain" />
                        ) : (
                          <span className="text-white text-[9px] font-bold">{ad.platform?.name?.slice(0, 2) ?? '?'}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-300">{ad.platform?.name ?? 'Unknown'}</span>
                      <div className="flex gap-1">
                        {ad.positions.map((p) => (
                          <span key={p} className="text-[9px] px-1 py-0.5 bg-white/10 text-gray-500 rounded">
                            {positionLabel[p] ?? p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CheckCircle size={14} className="text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specific-blog ads (can be toggled for this post) */}
          {!useGlobal && specificAds.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Add to this post specifically:</p>
              <div className="flex flex-col gap-2">
                {specificAds.map((ad) => {
                  const isEnabled = ad.specificBlogIds.includes(blogId)
                  return (
                    <div key={ad.id} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/5 rounded border border-white/10 flex items-center justify-center overflow-hidden">
                          {ad.platform?.logo ? (
                            <Image src={ad.platform.logo} alt={ad.platform.name ?? ''} width={20} height={20} className="object-contain" />
                          ) : (
                            <span className="text-white text-[9px] font-bold">{ad.platform?.name?.slice(0, 2) ?? '?'}</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-300">{ad.platform?.name ?? 'Unknown'}</span>
                        <span className="text-xs text-gray-600">{ad.name}</span>
                      </div>
                      <button
                        onClick={() => toggleAdForBlog(ad, !isEnabled)}
                        disabled={saving === ad.id}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${isEnabled ? 'bg-green-500' : 'bg-white/10'}`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {ads.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-2">
              No active widgets configured.{' '}
              <a href="/admin/blog-ads" className="text-yellow-400 hover:underline">Add one in Blog Ads →</a>
            </p>
          )}
        </>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { fetchGeoData, getGeoCountry } from '@/lib/client-geo-data'
import Image from 'next/image'
import Link from 'next/link'
import { X, Star, CheckCircle, ExternalLink, Trophy, Gift, Clock } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PopupPlatform {
  id: string
  name: string
  slug: string
  logo: string | null
  bonusText: string | null
  affiliateUrl: string
  rating: number
  minDeposit: string | null
  pros: string[]
  visibilityType?: string
  allowedCountries?: string[]
  blockedCountries?: string[]
}

export interface PopupSettingsData {
  scrollEnabled: boolean
  exitEnabled: boolean
  timeEnabled: boolean
  scrollTriggerPct: number
  timeTriggerSeconds: number
  maxExitPlatforms: number
}

interface Props {
  blogId: string
  blogSlug: string
  platforms: PopupPlatform[]   // sorted: mentioned-first, then by rating
  settings: PopupSettingsData
}

type PopupType = 'scroll' | 'exit' | 'time' | null

// ─── SessionStorage helpers ───────────────────────────────────────────────────

function getPopupState(slug: string): Record<string, boolean> {
  try {
    return JSON.parse(sessionStorage.getItem(`cronbet_popup_${slug}`) || '{}')
  } catch { return {} }
}

function markPopupShown(slug: string, type: string) {
  try {
    const current = getPopupState(slug)
    sessionStorage.setItem(`cronbet_popup_${slug}`, JSON.stringify({ ...current, [type]: true }))
  } catch {}
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Compact platform card (used in exit intent) ──────────────────────────────

function CompactCard({
  platform,
  onClaim,
}: {
  platform: PopupPlatform
  onClaim: () => void
}) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:border-yellow-400/30 transition-all">
      <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
        {platform.logo ? (
          <Image src={platform.logo} alt={platform.name} width={36} height={36} className="object-contain" />
        ) : (
          <span className="text-white font-bold text-sm">{platform.name.slice(0, 2)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-sm">{platform.name}</div>
        <Stars rating={platform.rating} />
        <div className="text-[#f5a623] font-semibold text-xs mt-0.5 truncate">{platform.bonusText || 'See Offer'}</div>
      </div>
      <a
        href={platform.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        onClick={(e) => { e.stopPropagation(); onClaim(); }}
        className="bg-[#22c55e] hover:bg-green-400 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 transition-colors shrink-0"
      >
        <ExternalLink size={11} />
        Claim
      </a>
    </div>
  )
}

// ─── Responsible gambling footer ─────────────────────────────────────────────

function RgFooter() {
  return (
    <p className="text-[10px] text-gray-600 text-center mt-2">
      T&Cs apply.{' '}
      <Link href="/responsible-gambling" className="hover:text-gray-400 underline">
        18+ | Gamble Responsibly
      </Link>
    </p>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PopupWidgets({ blogId, blogSlug, platforms: initialPlatforms, settings }: Props) {
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [activePopup, setActivePopup] = useState<PopupType>(null)
  const [visible, setVisible] = useState(false)      // drives CSS transition
  const [isMobile, setIsMobile] = useState(false)
  const [countdown, setCountdown] = useState(15)     // auto-dismiss for scroll popup
  const scrollListenerAdded = useRef(false)
  const dismissed = useRef(false)

  // Geo update: upgrade platform bonuses + filter by visibility after country detection
  useEffect(() => {
    getGeoCountry().then((country) => {
      if (!country || country === 'DEFAULT') return
      return fetchGeoData(country).then((geoData) => {
        setPlatforms((prev) =>
          prev
            .filter((p) => {
              const v = p.visibilityType
              if (!v || v === 'ALL_COUNTRIES') return true
              if (v === 'ALLOWED_ONLY') return p.allowedCountries?.includes(country) ?? false
              if (v === 'BLOCKED_ONLY') return !p.blockedCountries?.includes(country)
              return true
            })
            .map((p) => {
              const d = geoData[p.id]
              if (!d) return p
              return {
                ...p,
                bonusText: d.bonusText || p.bonusText,
                minDeposit: d.minDeposit || p.minDeposit,
                affiliateUrl: d.affiliateUrl || p.affiliateUrl,
              }
            }),
        )
      })
    })
  }, [])

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Animate in after mount when activePopup changes
  useEffect(() => {
    if (activePopup) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      setCountdown(15)
    } else {
      setVisible(false)
    }
  }, [activePopup])

  // Try to show a popup (respects frequency capping rules)
  const tryShow = useCallback((type: PopupType) => {
    if (!type || dismissed.current) return
    const state = getPopupState(blogSlug)
    if (state[type]) return  // already shown this session

    // Scroll + time are mutually exclusive (only one per session)
    if ((type === 'scroll' || type === 'time') && (state.scroll || state.time)) return

    setActivePopup(type)
    markPopupShown(blogSlug, type)
  }, [blogSlug])

  // ── Scroll trigger ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!settings.scrollEnabled || scrollListenerAdded.current) return
    scrollListenerAdded.current = true

    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (scrolled / total) * 100
      if (pct >= settings.scrollTriggerPct) {
        tryShow('scroll')
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [settings.scrollEnabled, settings.scrollTriggerPct, tryShow])

  // ── Exit intent trigger (desktop only) ─────────────────────────────────────
  useEffect(() => {
    if (!settings.exitEnabled || isMobile) return

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        tryShow('exit')
      }
    }

    document.addEventListener('mouseleave', onMouseLeave)
    return () => document.removeEventListener('mouseleave', onMouseLeave)
  }, [settings.exitEnabled, isMobile, tryShow])

  // ── Time trigger ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!settings.timeEnabled) return
    const timer = setTimeout(() => tryShow('time'), settings.timeTriggerSeconds * 1000)
    return () => clearTimeout(timer)
  }, [settings.timeEnabled, settings.timeTriggerSeconds, tryShow])

  // ── Auto-dismiss scroll popup after 15 s ────────────────────────────────────
  useEffect(() => {
    if (activePopup !== 'scroll') return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          trackAction(null, platforms[0], 'auto_closed', activePopup)
          closePopup()
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePopup])

  function closePopup() {
    setVisible(false)
    setTimeout(() => setActivePopup(null), 300)
  }

  function handleDismiss(platform: PopupPlatform | null) {
    if (platform) trackAction(null, platform, 'dismissed', activePopup)
    closePopup()
  }

  function trackAction(
    adId: string | null,
    platform: PopupPlatform | null,
    action: string,
    popupType: PopupType,
  ) {
    if (!platform) return
    fetch('/api/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adId: adId || '',
        platformId: platform.id,
        blogId,
        blogSlug,
        position: `POPUP_${(popupType ?? 'UNKNOWN').toUpperCase()}`,
        popupType: popupType?.toUpperCase(),
        action,
      }),
    }).catch(() => {})
  }

  function handleClaim(platform: PopupPlatform) {
    trackAction(null, platform, 'claimed', activePopup)
    closePopup()
  }

  if (platforms.length === 0 || !activePopup) return null

  const primaryPlatform = platforms[0]
  const exitPlatforms = platforms.slice(0, settings.maxExitPlatforms)

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL POPUP — bottom-right slide-up
  // ═══════════════════════════════════════════════════════════════════════════
  if (activePopup === 'scroll') {
    return (
      <div
        className={`fixed bottom-4 right-4 z-50 w-72 transition-all duration-300 ease-out
          ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          ${isMobile ? 'right-2 left-2 w-auto' : ''}
        `}
      >
        <div className="bg-[#1a1f2e] border border-white/15 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-yellow-400/5">
            <div className="flex items-center gap-2">
              <Gift size={14} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Exclusive Offer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">{countdown}s</span>
              <button
                onClick={() => handleDismiss(primaryPlatform)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            {/* Platform info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {primaryPlatform.logo ? (
                  <Image src={primaryPlatform.logo} alt={primaryPlatform.name} width={40} height={40} className="object-contain" />
                ) : (
                  <span className="text-white font-bold">{primaryPlatform.name.slice(0, 2)}</span>
                )}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{primaryPlatform.name}</div>
                <Stars rating={primaryPlatform.rating} />
              </div>
            </div>

            {/* Bonus */}
            <div className="text-[#f5a623] font-extrabold text-base mb-2">
              {primaryPlatform.bonusText || 'Welcome Bonus'}
            </div>
            {primaryPlatform.minDeposit && (
              <div className="text-[10px] text-gray-500 mb-3">Min. deposit: {primaryPlatform.minDeposit}</div>
            )}

            {/* Pros */}
            {primaryPlatform.pros.slice(0, 2).map((pro, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
                <CheckCircle size={11} className="text-green-400 shrink-0" />
                {pro}
              </div>
            ))}

            {/* CTA */}
            <a
              href={primaryPlatform.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={(e) => { e.stopPropagation(); handleClaim(primaryPlatform); }}
              className="w-full mt-3 bg-[#22c55e] hover:bg-green-400 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Gift size={14} />
              Claim Bonus Now
            </a>
          </div>

          {/* Footer */}
          <div className="px-4 pb-3">
            <RgFooter />
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXIT INTENT POPUP — center modal with dark overlay
  // ═══════════════════════════════════════════════════════════════════════════
  if (activePopup === 'exit') {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
          ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => handleDismiss(exitPlatforms[0])}
        />

        {/* Modal */}
        <div
          className={`relative bg-[#1a1f2e] border border-white/15 rounded-2xl shadow-2xl shadow-black/80 w-full max-w-lg mx-4 transition-all duration-300
            ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          `}
        >
          {/* Close */}
          <button
            onClick={() => handleDismiss(exitPlatforms[0])}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={20} className="text-yellow-400" />
              <span className="text-lg font-extrabold text-white">Wait! Before you go...</span>
            </div>
            <p className="text-sm text-gray-400">You&apos;re missing out on these exclusive betting offers:</p>
          </div>

          {/* Platform cards */}
          <div className="px-6 py-4 flex flex-col gap-3">
            {exitPlatforms.map((platform) => (
              <CompactCard
                key={platform.id}
                platform={platform}
                onClaim={() => handleClaim(platform)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <Link
              href="/compare"
              className="text-sm text-yellow-400 hover:underline"
              onClick={() => handleDismiss(exitPlatforms[0])}
            >
              Compare All Platforms →
            </Link>
            <RgFooter />
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME POPUP — slide in from right side
  // ═══════════════════════════════════════════════════════════════════════════
  if (activePopup === 'time') {
    return (
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 w-72 transition-all duration-300 ease-out
          ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          ${isMobile ? 'right-0 left-0 top-auto bottom-0 w-full translate-y-0 -translate-y-0' : ''}
        `}
      >
        <div className={`bg-[#1a1f2e] border border-white/15 shadow-2xl shadow-black/60 overflow-hidden
          ${isMobile ? 'rounded-t-2xl' : 'rounded-l-2xl'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-blue-400/5">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Limited Time Offer</span>
            </div>
            <button
              onClick={() => handleDismiss(primaryPlatform)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {primaryPlatform.logo ? (
                  <Image src={primaryPlatform.logo} alt={primaryPlatform.name} width={36} height={36} className="object-contain" />
                ) : (
                  <span className="text-white font-bold text-sm">{primaryPlatform.name.slice(0, 2)}</span>
                )}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{primaryPlatform.name}</div>
                <Stars rating={primaryPlatform.rating} />
              </div>
            </div>

            <div className="text-[#f5a623] font-extrabold text-sm mb-3">
              {primaryPlatform.bonusText || 'Welcome Bonus'}
            </div>

            {primaryPlatform.pros.slice(0, 2).map((pro, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-300 mb-1.5">
                <CheckCircle size={10} className="text-green-400 shrink-0" />
                {pro}
              </div>
            ))}

            <a
              href={primaryPlatform.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={(e) => { e.stopPropagation(); handleClaim(primaryPlatform); }}
              className="w-full mt-3 bg-[#22c55e] hover:bg-green-400 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink size={13} />
              Claim Bonus
            </a>
          </div>

          <div className="px-4 pb-3">
            <RgFooter />
          </div>
        </div>
      </div>
    )
  }

  return null
}

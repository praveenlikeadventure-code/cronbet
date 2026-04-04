'use client'

import type { GeoInfo } from '@/hooks/useGeo'

/** Temporary debug banner — remove once geo detection is confirmed working in production */
export default function GeoDebugBanner({ geo }: { geo: GeoInfo | null }) {
  if (!geo) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 border border-white/20 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      {geo.flag} Detected: <strong>{geo.countryCode}</strong>
      {geo.isDefault ? ' (default)' : ''}
    </div>
  )
}

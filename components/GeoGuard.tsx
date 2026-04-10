'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useGeo } from '@/hooks/useGeo'

interface Props {
  /** Country codes that can see this page. Empty array = visible globally. */
  allowedCountries: string[]
  children: React.ReactNode
}

/**
 * Wraps a page and hides it from users whose geo is not in allowedCountries.
 * - While geo is loading: shows a minimal skeleton (avoids content flash)
 * - DEFAULT / undetected geo: always shows content (benefit of the doubt)
 * - Allowed country: shows children
 * - Blocked country: shows "not available in your region" message
 */
export default function GeoGuard({ allowedCountries, children }: Props) {
  const { geo, isLoading } = useGeo()

  // No restriction configured — always show
  if (allowedCountries.length === 0) return <>{children}</>

  // Still detecting geo — show a quiet placeholder to avoid content flash
  if (isLoading || !geo) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    )
  }

  // DEFAULT / unknown country → show content (don't block)
  if (geo.isDefault) return <>{children}</>

  // Allowed country → show content
  if (allowedCountries.includes(geo.countryCode)) return <>{children}</>

  // Blocked — show region message
  return (
    <div className="min-h-screen bg-[#060910] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-6">{geo.flag}</div>
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 text-sm text-gray-400">
          <Globe size={13} />
          {geo.countryName}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Not Available in Your Region
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          This page is not available in <strong className="text-white">{geo.countryName}</strong>.
          Browse our other guides or compare the best platforms available in your region.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/compare"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Compare Platforms
          </Link>
          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

export interface GeoInfo {
  countryCode: string
  countryName: string
  currencyCode: string
  currencySymbol: string
  flag: string
  isDefault: boolean
}

const COOKIE_NAME = 'cronbet_geo'
const COOKIE_MAX_AGE = 86400 // 24 hours

function readGeoCookie(): GeoInfo | null {
  try {
    const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
    if (!match) return null
    return JSON.parse(decodeURIComponent(match[1])) as GeoInfo
  } catch {
    return null
  }
}

function writeGeoCookie(info: GeoInfo) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(info))}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

export function useGeo(): { geo: GeoInfo | null; isLoading: boolean } {
  const [geo, setGeo] = useState<GeoInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for ?geo=XX override in the URL
    const params = new URLSearchParams(window.location.search)
    const override = params.get('geo')?.toUpperCase()

    // Use cookie cache unless there's an override
    if (!override) {
      const cached = readGeoCookie()
      if (cached) {
        setGeo(cached)
        setIsLoading(false)
        return
      }
    }

    const url = override ? `/api/geo?geo=${override}` : '/api/geo'

    fetch(url)
      .then((r) => r.json())
      .then((data: GeoInfo) => {
        setGeo(data)
        if (!override) writeGeoCookie(data)
      })
      .catch(() => {
        // Stay with null geo (DEFAULT offers already rendered)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { geo, isLoading }
}

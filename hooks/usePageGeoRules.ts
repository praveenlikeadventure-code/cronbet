'use client'

import { useState, useEffect } from 'react'

interface PageGeoRule {
  pagePath: string
  isRestricted: boolean
  allowedCountries: string // JSON
}

// Module-level cache — fetched once per browser session across all components
let rulesCache: PageGeoRule[] | null = null
let rulesPending: Promise<PageGeoRule[]> | null = null

async function fetchRules(): Promise<PageGeoRule[]> {
  if (rulesCache) return rulesCache
  if (rulesPending) return rulesPending

  rulesPending = fetch('/api/page-geo')
    .then((r) => r.json() as Promise<PageGeoRule[]>)
    .then((data) => {
      rulesCache = data
      rulesPending = null
      return data
    })
    .catch(() => {
      rulesPending = null
      return []
    })

  return rulesPending
}

/**
 * Returns the set of page paths that are blocked for the given country code.
 * Pass null while geo is still loading — returns empty set (show all links).
 */
export function usePageGeoRules(countryCode: string | null | undefined): Set<string> {
  const [rules, setRules] = useState<PageGeoRule[]>(rulesCache ?? [])

  useEffect(() => {
    if (rulesCache) return
    fetchRules().then(setRules).catch(() => {})
  }, [])

  const blocked = new Set<string>()
  // While loading or DEFAULT, don't hide anything
  if (!countryCode || countryCode === 'DEFAULT') return blocked

  for (const rule of rules) {
    if (!rule.isRestricted) continue
    try {
      const allowed: string[] = JSON.parse(rule.allowedCountries)
      if (allowed.length > 0 && !allowed.includes(countryCode)) {
        blocked.add(rule.pagePath)
      }
    } catch {
      // malformed JSON — skip
    }
  }

  return blocked
}

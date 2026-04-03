'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Locale, LOCALE_COOKIE, SUPPORTED_LOCALES, DEFAULT_LOCALE, getTranslations } from '@/lib/i18n'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslations>
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: getTranslations(DEFAULT_LOCALE),
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function Providers({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return
    // Persist in cookie (read by middleware + server components on next request)
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=lax`
    setLocaleState(newLocale)
    // Reload so server components re-render with the new locale
    window.location.reload()
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getTranslations(locale) }}>
      {children}
    </LanguageContext.Provider>
  )
}

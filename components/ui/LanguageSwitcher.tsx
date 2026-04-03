'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { languages, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { useLanguage } from '@/app/providers'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = languages[locale]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-white/5"
        aria-label={t.language.select}
      >
        <Globe size={15} className="shrink-0" />
        <span className="hidden sm:inline">{current.flag} {current.nativeName}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#0f1629] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="py-1">
            {SUPPORTED_LOCALES.map((l) => {
              const lang = languages[l]
              return (
                <button
                  key={l}
                  onClick={() => {
                    setLocale(l as Locale)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                    l === locale ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.nativeName}</span>
                  {l === locale && <Check size={13} className="text-yellow-400 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

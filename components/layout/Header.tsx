'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Crown } from 'lucide-react'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useLanguage } from '@/app/providers'
import { useGeo } from '@/hooks/useGeo'
import { usePageGeoRules } from '@/hooks/usePageGeoRules'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()
  const { geo } = useGeo()
  const blockedPaths = usePageGeoRules(geo?.countryCode)

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/compare', label: t.nav.compare },
    { href: '/ipl-betting', label: 'IPL Betting' },
    { href: '/cricket-betting', label: 'Cricket' },
    { href: '/best-bonuses', label: t.nav.bestBonuses },
    { href: '/blog', label: t.nav.blog },
  ].filter((link) => !blockedPaths.has(link.href))

  return (
    <header className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur border-b border-yellow-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="text-yellow-400 w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-extrabold tracking-tight text-white">
              CRON<span className="text-yellow-400">BET</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-yellow-400 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/compare"
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2 rounded-lg transition-colors"
            >
              {t.nav.compareSites}
            </Link>
          </div>

          {/* Mobile: Language + menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0e1a] border-t border-yellow-400/20">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 font-medium py-2 border-b border-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/compare"
              onClick={() => setMenuOpen(false)}
              className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg text-center mt-2"
            >
              {t.nav.compareSites}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

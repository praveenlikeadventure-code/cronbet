'use client'

import Link from 'next/link'
import { Crown, Shield } from 'lucide-react'
import { useLanguage } from '@/app/providers'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#060910] border-t border-yellow-400/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="text-yellow-400 w-6 h-6" />
              <span className="text-xl font-extrabold text-white">
                CRON<span className="text-yellow-400">BET</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: t.nav.home },
                { href: '/compare', label: t.nav.compareSites },
                { href: '/best-bonuses', label: t.nav.bestBonuses },
                { href: '/blog', label: t.nav.blog },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/responsible-gambling', label: t.footer.responsibleGambling },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.safeGambling}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield size={16} className="text-green-400 shrink-0" />
                <span>{t.footer.ageOnly}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield size={16} className="text-green-400 shrink-0" />
                <span>{t.footer.responsibleGambling}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield size={16} className="text-green-400 shrink-0" />
                <span>{t.footer.independentReviews}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 font-semibold text-sm mb-1">⚠️ {t.footer.responsibleGambling}</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              {t.footer.disclaimer}{' '}
              <a href="https://www.gamblingtherapy.org" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">
                GamblingTherapy.org
              </a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} CRONBET. {t.footer.copyright}
            </p>
            <p className="text-gray-500 text-xs">{t.footer.affiliateNotice}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

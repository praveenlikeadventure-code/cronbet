import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Star, Users, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About CRONBET - Independent Betting Site Reviews',
  description: 'Learn about CRONBET, our mission, methodology, and how we independently compare and review online betting platforms.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">About</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-4">About CRONBET</h1>
      <p className="text-xl text-gray-300 mb-10">Your trusted, independent guide to the best online betting platforms.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {[
          { icon: Target, title: 'Our Mission', desc: 'Help bettors find the best, safest, and most rewarding platforms through honest, independent comparisons.' },
          { icon: Shield, title: 'Independence', desc: 'Our reviews are never influenced by affiliate commissions. We always put the user first in our evaluations.' },
          { icon: Star, title: 'Expert Reviews', desc: 'Our team has decades of combined experience reviewing and testing online betting platforms worldwide.' },
          { icon: Users, title: 'Community Focused', desc: 'We\'re built for bettors, by bettors. Our community of 100,000+ monthly users trusts our recommendations.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
            <Icon size={28} className="text-yellow-400 mb-3" />
            <h3 className="text-white font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      <section className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">How We Review</h2>
        <ol className="space-y-3">
          {[
            'We create real accounts and test each platform with real money',
            'We evaluate licensing, security, and regulatory compliance',
            'We test deposit and withdrawal methods for speed and reliability',
            'We analyze bonus terms and wagering requirements in detail',
            'We test mobile apps on iOS and Android devices',
            'We contact customer support to test response time and quality',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
              <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="prose prose-invert text-gray-300 text-sm leading-relaxed">
        <h2 className="text-2xl font-bold text-white mb-3">Affiliate Disclosure</h2>
        <p>
          CRONBET.com participates in affiliate marketing programs. We may receive compensation when users click
          affiliate links and register on platforms we feature. This compensation helps us maintain our free service.
          However, it does NOT influence our ratings or recommendations — all reviews are conducted independently
          and objectively.
        </p>
      </section>
    </div>
  )
}

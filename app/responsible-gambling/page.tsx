import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Phone, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Responsible Gambling - CRONBET',
  description: 'Learn about responsible gambling practices and find resources for help. CRONBET is committed to promoting safe and responsible betting.',
}

export default function ResponsibleGamblingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">Responsible Gambling</li>
        </ol>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <Shield size={36} className="text-yellow-400" />
        <h1 className="text-4xl font-extrabold text-white">Responsible Gambling</h1>
      </div>

      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-yellow-400 text-sm">
            <strong>Important:</strong> Gambling should be entertainment, not a way to make money. Never bet more than you can afford to lose.
            If you or someone you know has a gambling problem, please seek help immediately.
          </p>
        </div>
      </div>

      <section className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Warning Signs of Problem Gambling</h2>
        <ul className="space-y-2">
          {[
            'Spending more money or time gambling than intended',
            'Chasing losses — gambling to win back money you\'ve lost',
            'Hiding gambling from friends or family',
            'Borrowing money or selling possessions to fund gambling',
            'Neglecting work, school, or family responsibilities',
            'Feeling restless or irritable when not gambling',
            'Using gambling as a way to escape problems or emotions',
          ].map((sign, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <AlertTriangle size={13} className="text-yellow-400 mt-0.5 shrink-0" />
              {sign}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">How to Gamble Responsibly</h2>
        <ul className="space-y-2">
          {[
            'Set a strict budget and never exceed it',
            'Set time limits for your gambling sessions',
            'Never gamble when under the influence of alcohol or drugs',
            'Take regular breaks and do not gamble continuously',
            'Use platform deposit limits and self-exclusion tools',
            'Keep gambling fun — stop if it becomes stressful',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <Shield size={13} className="text-green-400 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#0f1629] border border-green-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Phone size={20} className="text-green-400" />
          Help Resources
        </h2>
        <div className="space-y-3">
          {[
            { name: 'National Problem Gambling Helpline (US)', contact: '1-800-522-4700', url: 'https://www.ncpgambling.org' },
            { name: 'GamCare (UK)', contact: '0808 8020 133', url: 'https://www.gamcare.org.uk' },
            { name: 'Gambling Therapy (International)', contact: 'Free online support', url: 'https://www.gamblingtherapy.org' },
            { name: 'Gamblers Anonymous', contact: 'Find a meeting near you', url: 'https://www.gamblersanonymous.org' },
          ].map(({ name, contact, url }) => (
            <div key={name} className="flex items-start justify-between gap-4 p-3 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium text-sm">{name}</div>
                <div className="text-gray-400 text-xs">{contact}</div>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline text-xs shrink-0"
              >
                Visit →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

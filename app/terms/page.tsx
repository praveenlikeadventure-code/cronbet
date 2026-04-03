import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - CRONBET',
  description: 'CRONBET Terms of Service. Please read these terms carefully before using our website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">Terms of Service</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing and using CRONBET (cronbet.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.',
          },
          {
            title: '2. Nature of Service',
            content: 'CRONBET is a betting comparison and review website. We provide information and comparisons about online betting platforms. We are not a betting operator and do not accept bets ourselves.',
          },
          {
            title: '3. Affiliate Relationships',
            content: 'CRONBET participates in affiliate marketing programs. We earn commissions when users click our links and sign up at partner platforms. This does not affect the cost to you. Our reviews remain independent and objective.',
          },
          {
            title: '4. Age Restriction',
            content: 'This website is intended for users aged 18 and over only. By using this site, you confirm that you are at least 18 years of age. Online gambling may be illegal in your jurisdiction — it is your responsibility to check local laws.',
          },
          {
            title: '5. Accuracy of Information',
            content: 'While we strive to keep all information accurate and up-to-date, we cannot guarantee the accuracy of bonus offers, odds, or platform details as these change frequently. Always verify current offers on the respective platform\'s website.',
          },
          {
            title: '6. Limitation of Liability',
            content: 'CRONBET is not responsible for any losses incurred through betting on platforms we review. All gambling involves financial risk. We recommend only gambling with money you can afford to lose.',
          },
          {
            title: '7. Intellectual Property',
            content: 'All content on CRONBET, including text, graphics, logos, and reviews, is the property of CRONBET and may not be reproduced without permission.',
          },
          {
            title: '8. Contact',
            content: 'Questions about these terms? Email us at: legal@cronbet.com',
          },
        ].map(({ title, content }) => (
          <section key={title}>
            <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
            <p>{content}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

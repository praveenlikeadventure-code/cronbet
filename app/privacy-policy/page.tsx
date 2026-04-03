import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - CRONBET',
  description: 'CRONBET Privacy Policy. Learn how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">Privacy Policy</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
      <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide directly to us, such as when you contact us via our contact form. This includes your name, email address, and message content. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited.',
          },
          {
            title: '2. How We Use Your Information',
            content: 'We use the information we collect to respond to your inquiries, improve our website and services, analyze website traffic and usage patterns, and comply with legal obligations. We do not sell your personal information to third parties.',
          },
          {
            title: '3. Affiliate Links & Cookies',
            content: 'Our website contains affiliate links to third-party betting platforms. When you click these links, those platforms may set cookies on your device. We use cookies to track affiliate referrals and analyze website traffic. You can disable cookies in your browser settings.',
          },
          {
            title: '4. Third-Party Services',
            content: 'We may use third-party analytics services (such as Google Analytics) to help understand how visitors use our site. These services may collect information sent by your browser as part of a web page request. Their use of this information is governed by their respective privacy policies.',
          },
          {
            title: '5. Data Security',
            content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
          },
          {
            title: '6. Your Rights',
            content: 'Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. To exercise these rights, please contact us at privacy@cronbet.com.',
          },
          {
            title: '7. Contact Us',
            content: 'If you have questions about this privacy policy, please contact us at: privacy@cronbet.com',
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

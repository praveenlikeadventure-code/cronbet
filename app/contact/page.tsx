import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact CRONBET',
  description: 'Get in touch with the CRONBET team. We respond to all inquiries within 24 hours.',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-300">Contact</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold text-white mb-4">Contact Us</h1>
      <p className="text-gray-400 mb-10">Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
          <Mail size={28} className="text-yellow-400 mb-3" />
          <h3 className="text-white font-bold mb-1">Email Us</h3>
          <a href="mailto:contact@cronbet.com" className="text-yellow-400 hover:underline text-sm">
            contact@cronbet.com
          </a>
        </div>
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-5">
          <MessageSquare size={28} className="text-yellow-400 mb-3" />
          <h3 className="text-white font-bold mb-1">Partnerships</h3>
          <a href="mailto:partners@cronbet.com" className="text-yellow-400 hover:underline text-sm">
            partners@cronbet.com
          </a>
        </div>
      </div>

      <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-5">Send a Message</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Message</label>
            <textarea
              rows={5}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
              placeholder="Your message..."
            />
          </div>
          <button
            type="button"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

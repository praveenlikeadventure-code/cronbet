'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminNav from '../../AdminNav'
import { Sparkles, ChevronDown, RefreshCw, Send, BookOpen, Clock, Megaphone, PlusCircle, CheckCircle } from 'lucide-react'

interface Platform {
  id: string
  name: string
  slug: string
  bonusText?: string | null
}

interface GeneratedBlog {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  category: string
  content: string
  wordCount: number
  suggestedTags: string[]
  internalLinkSuggestions: string[]
}

const TOPIC_CHIPS = [
  { label: 'Is 1xBet safe in India?', topic: 'Is 1xBet safe to use in India in 2025?', keyword: '1xBet India' },
  { label: 'Top cricket betting sites', topic: 'Top 5 cricket betting sites in India 2025', keyword: 'cricket betting sites India' },
  { label: '1xBet vs Melbet', topic: '1xBet vs Melbet: Which is better for Indian bettors?', keyword: '1xBet vs Melbet' },
  { label: 'Melbet welcome bonus guide', topic: 'How to claim Melbet welcome bonus step by step', keyword: 'Melbet bonus' },
  { label: 'Best betting apps Android', topic: 'Best betting apps for Android in India', keyword: 'betting apps India' },
  { label: 'How to withdraw from 22Bet', topic: 'How to withdraw money from 22Bet — complete guide', keyword: '22Bet withdrawal' },
  { label: 'Best IPL betting sites 2025', topic: 'Best IPL betting sites 2025: Where to bet on cricket', keyword: 'IPL betting' },
  { label: 'How to win at sports betting', topic: "How to win at sports betting: honest guide (no BS)", keyword: 'sports betting tips' },
]

function MarkdownPreview({ content }: { content: string }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    import('marked').then(({ marked }) => {
      const result = marked(content)
      if (typeof result === 'string') setHtml(result)
      else result.then(setHtml)
    })
  }, [content])

  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-gray-300 prose-headings:text-white prose-a:text-yellow-400 prose-strong:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function SeoBar({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${pass ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <div className={`w-2 h-2 rounded-full ${pass ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>
      <span className={pass ? 'text-gray-300' : 'text-gray-500'}>{label}</span>
    </div>
  )
}

export default function GenerateBlogPage() {
  const { status } = useSession({ required: true })
  const router = useRouter()
  const [platforms, setPlatforms] = useState<Platform[]>([])

  const [topic, setTopic] = useState('')
  const [keyword, setKeyword] = useState('')
  const [tone, setTone] = useState<'conversational' | 'beginner' | 'expert'>('conversational')
  const [wordCount, setWordCount] = useState<800 | 1200 | 1500>(1200)
  const [platform, setPlatform] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState<GeneratedBlog | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [suggestedPlatforms, setSuggestedPlatforms] = useState<Platform[]>([])
  const [addedWidgets, setAddedWidgets] = useState<Set<string>>(new Set())
  const [addingWidget, setAddingWidget] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/platforms').then(r => r.json()).then(setPlatforms).catch(() => {})
  }, [])

  function applyChip(chip: typeof TOPIC_CHIPS[0]) {
    setTopic(chip.topic)
    setKeyword(chip.keyword)
  }

  async function handleGenerate() {
    if (!topic.trim() || !keyword.trim()) {
      setError('Please enter a topic and primary keyword.')
      return
    }
    setError('')
    setLoading(true)
    setGenerated(null)

    try {
      const res = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keyword, tone, wordCount, platform: platform || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)

      // Smart auto-placement: detect which platforms are mentioned in the content
      const contentLower = (data.title + ' ' + data.content).toLowerCase()
      const mentioned = platforms.filter((p) =>
        contentLower.includes(p.name.toLowerCase())
      )
      setSuggestedPlatforms(mentioned)
      setAddedWidgets(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish(isPublished: boolean) {
    if (!generated) return
    setPublishing(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generated.title,
          slug: generated.slug,
          content: generated.content,
          excerpt: generated.excerpt,
          category: generated.category,
          metaTitle: generated.metaTitle,
          metaDescription: generated.metaDescription,
          isPublished,
          publishedAt: isPublished ? new Date().toISOString() : null,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to save')
      }
      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setPublishing(false)
    }
  }

  async function addSuggestedWidget(p: Platform) {
    setAddingWidget(p.id)
    try {
      await fetch('/api/blog-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${p.name} — Auto (All Posts)`,
          platformId: p.id,
          positions: ['ALL'],
          badge: 'Top Pick',
          highlightPoints: [],
          priority: 10,
          isActive: true,
          displayOnAllBlogs: true,
        }),
      })
      setAddedWidgets((prev) => new Set(prev).add(p.id))
    } finally {
      setAddingWidget(null)
    }
  }

  const seoChecks = generated ? {
    keywordInTitle: generated.title.toLowerCase().includes(keyword.toLowerCase()),
    metaLength: generated.metaDescription.length <= 155 && generated.metaDescription.length > 50,
    wordCountOk: generated.wordCount >= wordCount * 0.85,
    hasExcerpt: generated.excerpt.length > 20,
    titleLength: generated.metaTitle.length <= 60,
  } : null

  const seoScore = seoChecks ? Object.values(seoChecks).filter(Boolean).length : 0

  if (status === 'loading') return null

  return (
    <div className="min-h-screen bg-[#060910]">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
            <Sparkles className="text-yellow-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">AI Blog Generator</h1>
            <p className="text-gray-500 text-sm">Generates humanized, SEO-optimized posts using GPT-4o</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6 mb-6">

          {/* Row 1: Topic & Keyword */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Topic *</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Is 1xBet safe in India?"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Primary Keyword *</label>
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="e.g. 1xBet India review"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50"
              />
            </div>
          </div>

          {/* Row 2: Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Tone</label>
              <div className="relative">
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as typeof tone)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm appearance-none focus:outline-none focus:border-yellow-400/50"
                >
                  <option value="conversational">Conversational Friend</option>
                  <option value="beginner">Beginner Guide</option>
                  <option value="expert">Expert Analysis</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Word Count</label>
              <div className="relative">
                <select
                  value={wordCount}
                  onChange={e => setWordCount(Number(e.target.value) as typeof wordCount)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm appearance-none focus:outline-none focus:border-yellow-400/50"
                >
                  <option value={800}>800 words</option>
                  <option value={1200}>1200 words</option>
                  <option value={1500}>1500 words</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Platform Focus (optional)</label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm appearance-none focus:outline-none focus:border-yellow-400/50"
                >
                  <option value="">Any / General</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Topic chips */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Quick topics — click to auto-fill:</p>
            <div className="flex flex-wrap gap-2">
              {TOPIC_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => applyChip(chip)}
                  className="text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Generate button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Writing your blog...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Generate Blog
                </>
              )}
            </button>
            {loading && (
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <Clock size={12} />
                Usually takes 15–20 seconds
              </span>
            )}
          </div>
        </div>

        {/* Preview section */}
        {generated && (
          <div className="space-y-4">
            {/* Meta card */}
            <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold text-white mb-1">{generated.title}</h2>
                  <p className="text-gray-400 text-sm">{generated.metaDescription}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2.5 py-1 rounded-full">
                    {generated.category}
                  </span>
                  <span className="text-xs text-gray-500">{generated.wordCount.toLocaleString()} words</span>
                </div>
              </div>

              {/* SEO Score */}
              {seoChecks && (
                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">SEO Check</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      seoScore === 5 ? 'bg-green-500/20 text-green-400' :
                      seoScore >= 3 ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {seoScore}/5
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <SeoBar label="Keyword in title" pass={seoChecks.keywordInTitle} />
                    <SeoBar label="Meta description length" pass={seoChecks.metaLength} />
                    <SeoBar label="Target word count met" pass={seoChecks.wordCountOk} />
                    <SeoBar label="Has excerpt" pass={seoChecks.hasExcerpt} />
                    <SeoBar label="Meta title ≤60 chars" pass={seoChecks.titleLength} />
                  </div>
                </div>
              )}

              {/* Internal link suggestions */}
              {generated.internalLinkSuggestions?.length > 0 && (
                <div className="border-t border-white/5 pt-4 mt-4">
                  <p className="text-xs text-gray-500 mb-2">Suggested internal links:</p>
                  <div className="flex flex-wrap gap-2">
                    {generated.internalLinkSuggestions.map((link, i) => (
                      <span key={i} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded">
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Widgets (smart auto-placement) */}
            {suggestedPlatforms.length > 0 && (
              <div className="bg-[#0f1629] border border-yellow-400/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={15} className="text-yellow-400" />
                  <h3 className="text-sm font-bold text-white">Suggested Affiliate Widgets</h3>
                  <span className="text-xs text-gray-500">These platforms are mentioned in the blog</span>
                </div>
                <div className="flex flex-col gap-2">
                  {suggestedPlatforms.map((p) => {
                    const added = addedWidgets.has(p.id)
                    return (
                      <div key={p.id} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-lg px-3 py-2">
                        <div>
                          <span className="text-sm text-white font-medium">{p.name}</span>
                          {p.bonusText && <span className="text-xs text-yellow-400 ml-2">{p.bonusText}</span>}
                        </div>
                        {added ? (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle size={12} /> Added to Blog Ads
                          </span>
                        ) : (
                          <button
                            onClick={() => addSuggestedWidget(p)}
                            disabled={addingWidget === p.id}
                            className="text-xs bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          >
                            <PlusCircle size={11} />
                            {addingWidget === p.id ? 'Adding...' : 'Add Widget (All Posts)'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handlePublish(true)}
                disabled={publishing}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
              >
                <Send size={14} />
                {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
              <button
                onClick={() => handlePublish(false)}
                disabled={publishing}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
              >
                <BookOpen size={14} />
                Save as Draft
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-400 hover:text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Regenerate
              </button>
            </div>

            {/* Full content preview */}
            <div className="bg-[#0f1629] border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4 pb-3 border-b border-white/5">Content Preview</h3>
              <MarkdownPreview content={generated.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { BettingPlatform } from '@/lib/types'

type SortKey = 'rating' | 'name' | 'minDeposit'
type CategoryFilter = 'All' | 'Football' | 'Cricket' | 'eSports' | 'Crypto-Friendly' | 'Best Bonus'

const CATEGORY_FILTERS: CategoryFilter[] = ['All', 'Football', 'Cricket', 'eSports', 'Crypto-Friendly', 'Best Bonus']

interface ComparisonTableProps {
  platforms: BettingPlatform[]
}

export default function ComparisonTable({ platforms }: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rating')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...platforms]
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        (p.bonusText || '').toLowerCase().includes(filter.toLowerCase())
      if (!matchesSearch) return false
      if (categoryFilter === 'All') return true
      if (categoryFilter === 'Best Bonus') return p.isFeatured
      return p.sports.includes(categoryFilter)
    })
    .sort((a, b) => {
      if (categoryFilter === 'Best Bonus') return b.rating - a.rating
      let cmp = 0
      if (sortKey === 'rating') cmp = a.rating - b.rating
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={14} className="text-gray-600" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-yellow-400" />
      : <ChevronDown size={14} className="text-yellow-400" />
  }

  return (
    <div>
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setCategoryFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categoryFilter === f
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-yellow-400/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search platforms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#0f1629] border border-white/10 text-white rounded-lg px-4 py-2 text-sm w-full max-w-sm focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-3 text-gray-400 font-medium">#</th>
              <th
                className="text-left py-3 px-3 text-gray-400 font-medium cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">Platform <SortIcon col="name" /></div>
              </th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Welcome Bonus</th>
              <th
                className="text-left py-3 px-3 text-gray-400 font-medium cursor-pointer select-none"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center gap-1">Rating <SortIcon col="rating" /></div>
              </th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium hidden md:table-cell">Min Deposit</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium hidden lg:table-cell">Payout</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium hidden lg:table-cell">License</th>
              <th className="text-left py-3 px-3 text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-3 px-3 text-gray-500">{i + 1}</td>
                <td className="py-3 px-3">
                  <Link href={`/review/${p.slug}`} className="text-white font-semibold hover:text-yellow-400">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3 px-3 text-yellow-400 font-medium">{p.bonusText || '—'}</td>
                <td className="py-3 px-3">
                  <StarRating rating={p.rating} size="sm" />
                </td>
                <td className="py-3 px-3 text-gray-300 hidden md:table-cell">{p.minDeposit || '—'}</td>
                <td className="py-3 px-3 text-gray-300 hidden lg:table-cell">{p.payoutSpeed || '—'}</td>
                <td className="py-3 px-3 text-gray-400 hidden lg:table-cell text-xs">{p.license || '—'}</td>
                <td className="py-3 px-3">
                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="bg-green-500 hover:bg-green-400 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 w-fit"
                  >
                    <ExternalLink size={12} />
                    Claim
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export default function StarRating({ rating, max = 5, size = 'md', showNumber = true }: StarRatingProps) {
  const sizes = { sm: 14, md: 18, lg: 22 }
  const iconSize = sizes[size]

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <span key={i} className="relative inline-block">
            <Star size={iconSize} className="text-gray-600" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={iconSize} className="text-yellow-400 fill-yellow-400" />
              </span>
            )}
          </span>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-yellow-400 font-semibold text-sm">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

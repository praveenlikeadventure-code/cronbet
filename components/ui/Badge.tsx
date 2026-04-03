interface BadgeProps {
  variant: 'top-pick' | 'editors-choice' | 'featured' | 'new'
  className?: string
}

const variants = {
  'top-pick': 'bg-yellow-400 text-black',
  'editors-choice': 'bg-purple-600 text-white',
  'featured': 'bg-blue-600 text-white',
  'new': 'bg-green-600 text-white',
}

const labels = {
  'top-pick': '⭐ Top Pick',
  'editors-choice': '✏️ Editor\'s Choice',
  'featured': '🔥 Featured',
  'new': '🆕 New',
}

export default function Badge({ variant, className = '' }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${variants[variant]} ${className}`}>
      {labels[variant]}
    </span>
  )
}

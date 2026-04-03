function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return [] }
  }
  return []
}

export function parsePlatform(p: Record<string, unknown>): BettingPlatform {
  return {
    ...p,
    pros: parseJsonArray(p.pros),
    cons: parseJsonArray(p.cons),
    sports: parseJsonArray(p.sports),
    payments: parseJsonArray(p.payments),
  } as BettingPlatform
}

export function parsePlatforms(platforms: Record<string, unknown>[]): BettingPlatform[] {
  return platforms.map(parsePlatform)
}

export interface BettingPlatform {
  id: string
  name: string
  slug: string
  logo: string | null
  bonusText: string | null
  affiliateUrl: string
  rating: number
  pros: string[]
  cons: string[]
  sports: string[]
  payments: string[]
  minDeposit: string | null
  payoutSpeed: string | null
  license: string | null
  isFeatured: boolean
  rank: number
  isActive: boolean
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category: string
  metaTitle: string | null
  metaDescription: string | null
  isPublished: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

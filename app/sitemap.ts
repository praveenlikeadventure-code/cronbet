export const dynamic = 'force-dynamic'

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cronbet.com'

  const platforms = await prisma.bettingPlatform.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  })

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/compare`, priority: 0.9 },
    { url: `${baseUrl}/best-bonuses`, priority: 0.9 },
    { url: `${baseUrl}/blog`, priority: 0.8 },
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/contact`, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3 },
    { url: `${baseUrl}/terms`, priority: 0.3 },
    { url: `${baseUrl}/responsible-gambling`, priority: 0.6 },
  ]

  return [
    ...staticPages.map(({ url, priority }) => ({
      url,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...platforms.map((p) => ({
      url: `${baseUrl}/review/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

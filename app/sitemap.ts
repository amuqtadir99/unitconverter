import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/units'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://convertly.app'
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/#${c.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

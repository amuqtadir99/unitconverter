import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Convertly — Modern Unit Converter',
    short_name: 'Convertly',
    description:
      'A modern, immersive unit converter for length, mass, volume, temperature and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a1e',
    theme_color: '#635bff',
    categories: ['utilities', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}

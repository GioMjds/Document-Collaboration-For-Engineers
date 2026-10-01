import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CVTEC Engineer CMS',
    short_name: 'CVTEC CMS',
    description: 'Collaborative document management and review application.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fbfa',
    theme_color: '#087f74',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://4seasons-hub.com';

  // These should ideally be fetched from the API, but for now we'll define the main routes
  // and a placeholder for where dynamic routes would be populated.
  
  const routes = [
    '',
    '/search',
    '/new-launches',
    '/developers',
    '/compounds',
    '/about',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}

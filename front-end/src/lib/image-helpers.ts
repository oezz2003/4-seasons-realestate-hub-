const getOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return ''; // Relative for SSR
};

const API_ORIGIN = getOrigin();

export function getImageUrl(imagePath: string | null | undefined, fallback?: string): string {
  if (!imagePath) return fallback || 'https://placehold.co/800x600.png';

  let path = String(imagePath).trim();

  // If the path is corrupted with a leading slash before a protocol (e.g., /http:/...)
  // Strip the leading slash(es)
  if (path.match(/^\/+https?:\//) || path.match(/^\/+blob:/) || path.match(/^\/+data:/)) {
    path = path.replace(/^\/+/, '');
  }

  // Fix common single-slash corruption (http:/ -> http://)
  // This must happen BEFORE the absolute check
  if (path.match(/^https?:\/(?!\/)/)) {
    path = path.replace(/^(https?):\/([^\/])/, '$1://$2');
  }

  // If already a full URL or special protocol, return as-is
  if (
    path.includes('://') || 
    path.startsWith('//') || 
    path.startsWith('data:') || 
    path.startsWith('blob:')
  ) {
    // Next.js <Image> doesn't support // protocol-relative URLs
    if (path.startsWith('//')) {
      const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
      return `${protocol}${path}`;
    }
    return path;
  }

  // Normalize relative media paths
  let normalizedPath = path.replace(/\\/g, '/');

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  // Only collapse multiple slashes for RELATIVE paths
  normalizedPath = normalizedPath.replace(/\/+/g, '/');

  return `${API_ORIGIN}${normalizedPath}`;
}

export function getPlaceholderImage(type: 'property' | 'compound' | 'developer' | 'blog' | 'author' | 'partner'): string {
  const placeholders = {
    property: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=600&fit=crop',
    compound: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&h=600&fit=crop',
    developer: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&h=600&fit=crop',
    blog: 'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=800&h=600&fit=crop',
    author: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop',
    partner: 'https://images.unsplash.com/photo-1611108018339-b7b5391c6e43?q=80&w=150&h=80&fit=crop',
  };
  return placeholders[type];
}

export function formatPrice(price: string | number): string {
  if (typeof price === 'number') {
    return `EGP ${price.toLocaleString()}`;
  }

  // If it's already a string, check if it contains numbers
  const numericPrice = parseFloat(price);
  if (!isNaN(numericPrice)) {
    return `EGP ${numericPrice.toLocaleString()}`;
  }

  return price; // Return as-is if it's not a number
}

export function getLocationName(location: string | { name: string } | null | undefined): string {
  if (!location) return 'N/A';

  if (typeof location === 'string') {
    return location;
  }

  return location.name || 'N/A';
}

export function getDeveloperName(developer: string | { name: string } | null | undefined): string {
  if (!developer) return 'N/A';

  if (typeof developer === 'string') {
    return developer;
  }

  return developer.name || 'N/A';
}

export function getCompoundName(compound: string | { name: string } | null | undefined): string {
  if (!compound) return 'N/A';

  if (typeof compound === 'string') {
    return compound;
  }

  return compound.name || 'N/A';
}


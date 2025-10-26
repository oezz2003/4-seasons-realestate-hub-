import type {NextConfig} from 'next';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';
const apiUrl = new URL(apiBase);
const apiProtocol: 'http' | 'https' = apiUrl.protocol === 'https:' ? 'https' : 'http';
const apiHostname = apiUrl.hostname;
const apiPort = apiUrl.port === '' ? undefined : apiUrl.port;
const apiPathname = apiUrl.pathname.replace(/\/$/, '');
const mediaPath = `${apiPathname}/media/**`.replace(/\/+/, '/');
const normalizedMediaPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        port: apiPort,
        pathname: normalizedMediaPath,
      },
    ],
  },
};

export default nextConfig;

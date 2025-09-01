/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Desabilitar prerenderização para páginas dinâmicas
    workerThreads: false,
    cpus: 1
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/files/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/files/**',
      }
    ],
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://mangazinho.site/api',
    NEXT_PUBLIC_FILES_URL: process.env.NEXT_PUBLIC_FILES_URL || 'https://mangazinho.site'
  }
};

export default nextConfig;

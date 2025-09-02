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
        port: '4000',
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
  // Removendo env hardcoded - agora usa arquivos .env
  // As variáveis serão carregadas automaticamente dos arquivos .env
};

export default nextConfig;

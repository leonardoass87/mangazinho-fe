/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ obrigatório p/ rodar com "node .next/standalone/server.js"

  eslint: {
    ignoreDuringBuilds: true, // ✅ evita quebrar o build por lint em prod
  },

  experimental: {
    workerThreads: false, // ✅ combina com sua VM
    cpus: 1               // ✅ vimos no log do build que está sendo respeitado
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
      // 🔒 OPCIONAL (mais seguro): ao invés de '**', restringir aos hosts que você usa,
      // por exemplo seu IP do Tailscale e seu domínio:
      // {
      //   protocol: 'http',
      //   hostname: '100.78.66.41',
      //   port: '3000',            // se as imagens vierem do back na 3000
      //   pathname: '/files/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'api.mangazinho.site',
      //   pathname: '/files/**',
      // },
    ],
    unoptimized: true, // ✅ bom para ambientes sem Image Optimization infra
  },

  // ✅ sem env hardcoded — o Next lê automaticamente de .env*
  // OPCIONAIS de hardening/tuning (adicione se quiser):
  // poweredByHeader: false,       // remove o header "X-Powered-By: Next.js"
  // reactStrictMode: true,        // útil p/ dev, detecta patterns de render
  // compress: true,               // gzip em produção (geralmente já padrão)
};

export default nextConfig;

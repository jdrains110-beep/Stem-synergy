/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'stemsynergyaaffb7467.pinet.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for backwards compatibility
  async redirects() {
    return [
      {
        source: '/blueprint/:id/view',
        destination: '/blueprints/:id',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },

  // TypeScript and React
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
};

module.exports = nextConfig;

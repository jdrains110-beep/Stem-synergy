/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'stemsynergyaaffb7467.pinet.com',
      },
    ],
  },
}

module.exports = nextConfig

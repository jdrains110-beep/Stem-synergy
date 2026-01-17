/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stemsynergyaaffb7467.pinet.com',
      },
    ],
  },
}

module.exports = nextConfig

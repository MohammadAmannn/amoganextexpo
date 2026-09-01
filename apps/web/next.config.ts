import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@cle-does-things/pdfitdown', 'pdfjs-dist', 'canvas'],
  turbopack: {
    resolveAlias: {
      canvas: './src/lib/empty-module.js',
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig

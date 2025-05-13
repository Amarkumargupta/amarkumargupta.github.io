const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Changed from 'export' to allow dynamic routes
  output: 'export',
  // Uncomment and update this when you know your repository name
  basePath: '',
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  }
};

module.exports = withBundleAnalyzer(nextConfig);
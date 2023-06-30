const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl', 'node_modules/@esbuild/linux-x64'],
    },
  },
}

module.exports = withBundleAnalyzer(nextConfig)

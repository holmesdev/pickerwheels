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
    // https://github.com/vercel/next.js/issues/42641
    outputFileTracingExcludes: {
      '*': [
        './**/node_modules/@swc/core-linux-arm64-gnu',
        './**/node_modules/@swc/core-linux-x64-gnu',
        './**/node_modules/@swc/core-darwin-x64',
        './**/node_modules/@swc/core-darwin-arm64',
        './**/node_modules/@esbuild/darwin-x64',
        './**/node_modules/@esbuild/darwin-arm64',
        './**/node_modules/@esbuild/linux-arm64',
        './**/node_modules/@esbuild/linux-x64',
      ],
    },
  },
}

module.exports = withBundleAnalyzer(nextConfig)

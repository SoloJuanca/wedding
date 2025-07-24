/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['es', 'en', 'ko'],
    defaultLocale: 'es',
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig 
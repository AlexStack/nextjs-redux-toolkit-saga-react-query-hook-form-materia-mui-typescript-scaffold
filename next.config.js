/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: StrictMode=true will render the components twice only on the dev mode not production.
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;

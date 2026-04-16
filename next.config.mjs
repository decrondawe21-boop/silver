/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/.playwright-cli/**", "**/output/**"],
      }
    }

    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

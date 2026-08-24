const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output: docker/production deployment runs .next/standalone
  // with only production node_modules baked in (small image, no full install).
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Proxy Odoo API through the storefront so phones/other devices on the
  // network (which cannot reach "localhost:8079") still get data and images.
  async rewrites() {
    const odoo = process.env.ODOO_INTERNAL_URL || "http://localhost:8079"
    return [
      {
        source: "/api/v1/:path*",
        destination: `${odoo}/api/v1/:path*`,
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig

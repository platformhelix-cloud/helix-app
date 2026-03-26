/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    proxyClientMaxBodySize: "20mb",
  },
}

export default nextConfig

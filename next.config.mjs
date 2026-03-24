/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    middlewareClientMaxBodySize: "20mb",
  },
}

export default nextConfig

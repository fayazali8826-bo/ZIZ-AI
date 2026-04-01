const path = require('path')
const fs = require('fs')

// Load .env from project root automatically
const rootEnvPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(rootEnvPath) && !process.env.DATABASE_URL) {
  const lines = fs.readFileSync(rootEnvPath, 'utf8').split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (!process.env[key]) process.env[key] = val
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ziz/shared', '@ziz/db'],
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client', 'prisma', 'googleapis', 'ioredis', 'bullmq', 'stripe',
    ],
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig

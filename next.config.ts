import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.klaviyo.com https://fast.klaviyo.com https://cdn.judge.me",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.shopify.com https://*.myshopify.com https://*.cdnjm.com https://*.cjdropshipping.com https://*.aliexpress-media.com https://*.cloudfront.net https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://static.klaviyo.com https://a.klaviyo.com https://judge.me",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "*.myshopify.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cdnjm.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cjdropshipping.com", pathname: "/**" },
      { protocol: "https", hostname: "*.aliexpress-media.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudfront.net", pathname: "/**" },
    ],
  },
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;

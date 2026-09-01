import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true,
    // Autorise l'optimisation next/image pour les vraies images produit
    // Shopify (CDN officiel) — voir src/components/ui/PlaceholderImage.tsx.
    // Aucune autre origine externe n'est autorisée (protection SSRF /
    // optimisation d'images arbitraires — voir doc Next.js `remotePatterns`).
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "*.myshopify.com", pathname: "/**" },
    ],
  },

  async headers() {
    // En-têtes de sécurité de base, appliqués à toutes les routes.
    // Pas de Content-Security-Policy stricte ici : le site charge des
    // scripts/styles externes (polices, éventuels widgets) non inventoriés
    // dans cette mission — une CSP mal calibrée casserait silencieusement
    // des fonctionnalités. À affiner dans une mission dédiée.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;


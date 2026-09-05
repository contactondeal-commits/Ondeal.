import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

// Mission IDENTITÉ VISUELLE OFFICIELLE ONDEAL (2026-08-13) — aucun manifest
// n'existait avant cette mission. Créé uniquement à partir de données déjà
// réelles et existantes du projet (SITE_NAME, SITE_DESCRIPTION, couleurs de
// marque officielles issues du logo, icônes officielles fournies par le
// client) — aucune donnée inventée. Voir reports/ondeal-branding-audit.md
// section 8.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Votre marketplace au meilleur prix`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0c1f32",
    icons: [
      {
        src: "/brand/ondeal-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/ondeal-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

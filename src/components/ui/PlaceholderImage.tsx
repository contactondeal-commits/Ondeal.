"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { getPlaceholderColors } from "@/lib/placeholder";

interface PlaceholderImageProps {
  /**
   * URL d'image réelle (Shopify CDN, ex: https://cdn.shopify.com/...) OU
   * référence mockée (`ph:<categorie>:<index>:<n>`) utilisée uniquement
   * pour dériver une couleur de secours déterministe.
   */
  seed: string;
  label?: string;
  className?: string;
  aspectRatio?: string;
  rounded?: boolean;
  /** `sizes` transmis à next/image — à ajuster selon le contexte d'affichage. */
  sizes?: string;
}

function isRealImageUrl(seed: string): boolean {
  return /^https?:\/\//i.test(seed);
}

/**
 * Affiche la vraie image produit (Shopify CDN) quand `seed` est une URL
 * absolue valide, avec repli automatique sur un bloc coloré déterministe
 * (pas de dépendance externe) si l'URL est absente, vide, ou échoue au
 * chargement — par exemple en données de démonstration (`ph:...`) ou en cas
 * d'erreur réseau/CDN. Aucune image n'est donc jamais silencieusement
 * remplacée par un mock quand une vraie URL est disponible et fonctionne.
 */
export default function PlaceholderImage({
  seed,
  label,
  className,
  aspectRatio = "1 / 1",
  rounded = true,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px",
}: PlaceholderImageProps) {
  const [failed, setFailed] = useState(false);
  const useRealImage = isRealImageUrl(seed) && !failed;
  const { bg, fg } = getPlaceholderColors(seed);
  const alt = label ?? "Image produit";

  return (
    <div
      className={className}
      role={useRealImage ? undefined : "img"}
      aria-label={useRealImage ? undefined : (label ?? "Image produit non disponible (aperçu)")}
      style={{
        position: "relative",
        background: useRealImage ? undefined : bg,
        color: fg,
        aspectRatio,
        borderRadius: rounded ? "var(--radius-md)" : 0,
        display: useRealImage ? "block" : "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {useRealImage ? (
        <Image
          src={seed}
          alt={alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff size={28} strokeWidth={1.5} opacity={0.55} />
      )}
    </div>
  );
}

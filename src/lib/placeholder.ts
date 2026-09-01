// Génère des couleurs de placeholder déterministes (pas d'images réelles Amazon
// ni de dépendance externe) à partir d'une chaîne (id produit, catégorie...).

const PALETTE: [string, string][] = [
  ["#dbeafe", "#1a56db"],
  ["#fef3c7", "#b45309"],
  ["#dcfce7", "#15803d"],
  ["#fee2e2", "#b91c1c"],
  ["#ede9fe", "#6d28d9"],
  ["#e0f2fe", "#0369a1"],
  ["#fce7f3", "#a21caf"],
  ["#f1f5f9", "#334155"],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getPlaceholderColors(seed: string): { bg: string; fg: string } {
  const idx = hashString(seed) % PALETTE.length;
  const [bg, fg] = PALETTE[idx];
  return { bg, fg };
}

/**
 * Encodage utilisé pour les images mockées : "ph:<seed>:<n>"
 * Permet d'obtenir des couleurs stables sans fichier image réel.
 */
export function parsePlaceholderRef(ref: string): string {
  return ref.startsWith("ph:") ? ref : `ph:${ref}`;
}

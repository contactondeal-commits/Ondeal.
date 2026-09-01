/**
 * Garde-fou explicite et centralisé pour la règle absolue de la mission :
 *
 *   if product.status === "ARCHIVED":
 *       ignore
 *
 * Les produits ARCHIVED (ancien fournisseur BigBuy, abandonné) ne doivent :
 *  - jamais être réactivés ;
 *  - jamais être importés dans Next.js ;
 *  - jamais être comptabilisés dans l'objectif de 3000 ;
 *  - jamais être utilisés pour les catégories ;
 *  - jamais être affichés dans la marketplace ;
 *  - jamais être synchronisés avec CJ.
 *
 * Toute fonction du dossier src/lib/catalog/ qui reçoit une liste de produits
 * Shopify DOIT commencer par filtrer avec `rejectArchived` (ou n'avoir été
 * alimentée qu'avec des requêtes explicitement `status:active` / `status:draft`
 * — voir src/lib/shopify/admin.ts `listProductsByStatus`).
 */

export interface StatusBearing {
  status: string;
}

export function isArchived<T extends StatusBearing>(product: T): boolean {
  return product.status.toUpperCase() === "ARCHIVED";
}

/** Filtre une liste de produits Shopify en excluant explicitement tout produit ARCHIVED. */
export function rejectArchived<T extends StatusBearing>(products: T[]): T[] {
  return products.filter((p) => !isArchived(p));
}

/**
 * Lève une erreur si la liste contient le moindre produit ARCHIVED — à
 * utiliser en garde d'entrée dans les scripts d'import/synchronisation pour
 * échouer bruyamment plutôt que de risquer un mélange silencieux avec
 * l'ancien catalogue BigBuy.
 */
export function assertNoArchived<T extends StatusBearing>(products: T[], context: string): void {
  const archived = products.filter(isArchived);
  if (archived.length > 0) {
    throw new Error(
      `[archived-guard] ${archived.length} produit(s) ARCHIVED détecté(s) dans "${context}". ` +
        "Règle absolue violée : les produits archivés (ancien BigBuy) ne doivent jamais entrer " +
        "dans la logique de catalogue/import/synchronisation. Corrigez la requête en amont " +
        "(filtrer explicitement status:active ou status:draft)."
    );
  }
}

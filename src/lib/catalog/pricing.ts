/**
 * Logique de prix configurable — voir mission "PRIX" :
 * prix fournisseur + frais éventuels + marge = prix Ondeal.
 *
 * La marge n'est jamais codée en dur : elle vient de DEFAULT_MARGIN_PERCENT
 * (.env). Une marge par catégorie peut être ajoutée plus tard dans
 * CATEGORY_MARGIN_OVERRIDES sans changer la formule elle-même.
 */

export interface PricingInput {
  supplierPrice: number;
  /**
   * Frais fixes optionnels (ex: frais de traitement), en euros. Défaut 0.
   * Ne PAS y mettre les frais de livraison CJ pour un import standard : la
   * règle métier de l'utilisateur (12/08/2026) est que le multiplicateur
   * ×2,5 (DEFAULT_MARGIN_PERCENT=150) inclut déjà la livraison — ajouter des
   * frais de port ici en plus reviendrait à la facturer deux fois. Réservé
   * aux cas particuliers (produit lourd/volumineux avec surcoût réel connu).
   */
  extraFees?: number;
  /** Remplace DEFAULT_MARGIN_PERCENT pour ce calcul si fourni. */
  marginPercentOverride?: number;
}

export interface PricingResult {
  supplierPrice: number;
  extraFees: number;
  marginPercent: number;
  marginAmount: number;
  ondealPrice: number;
}

function getDefaultMarginPercent(): number {
  const raw = process.env.DEFAULT_MARGIN_PERCENT;
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  // Repli explicite si la variable n'est pas configurée — documenté, pas
  // deviné silencieusement : voir .env.example.
  // Règle métier communiquée par l'utilisateur le 12/08/2026 : "en général je
  // vends les produits à 2,5x [le prix fournisseur], livraison incluse" —
  // donc prix Ondeal = prix fournisseur × 2.5 = prix fournisseur + 150% de
  // marge. La marge reste 100% configurable via DEFAULT_MARGIN_PERCENT ; 150
  // est seulement le repli par défaut si la variable n'est pas définie.
  return 150;
}

/** Arrondi "psychologique" à ,99 le plus proche par le dessus, comme la plupart des marketplaces. */
function roundToNinetyNine(value: number): number {
  const rounded = Math.ceil(value) - 0.01;
  return Math.round(rounded * 100) / 100;
}

export function computeOndealPrice(input: PricingInput): PricingResult {
  const extraFees = input.extraFees ?? 0;
  const marginPercent = input.marginPercentOverride ?? getDefaultMarginPercent();
  const base = input.supplierPrice + extraFees;
  const marginAmount = base * (marginPercent / 100);
  const ondealPrice = roundToNinetyNine(base + marginAmount);

  return {
    supplierPrice: input.supplierPrice,
    extraFees,
    marginPercent,
    marginAmount,
    ondealPrice,
  };
}

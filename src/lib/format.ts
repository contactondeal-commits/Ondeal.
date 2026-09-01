// Mission "ONDEAL — PHASE 3 : Audit + correction catégories + audit prix +
// navigation catalogue" (13/08/2026) — section 13 (Affichage du prix) :
// bug technique confirmé — tout le site affichait les prix avec un séparateur
// décimal anglo-saxon (point), ex. "379.99 €", via des appels dispersés à
// `price.toFixed(2) + " €"`. Le marché cible d'Ondeal est francophone (site
// .fr, devise EUR, reste de l'interface en français) : le séparateur attendu
// est la virgule ("379,99 €"), conformément à la convention française
// (`Intl.NumberFormat("fr-FR", ...)`).
//
// IMPORTANT : ce correctif ne modifie AUCUNE valeur de prix — uniquement son
// formatage d'affichage. Le montant numérique réel (issu de Shopify, jamais
// modifié) reste strictement identique ; seule la représentation textuelle
// change (point → virgule, séparateur de milliers ajouté pour les montants
// ≥ 1000, ex. "1 399,99 €" pour l'Abri de jardin cité dans l'audit prix — voir
// reports/ondeal-categories-prix-audit.md section C).
//
// Point d'entrée unique : ne jamais dupliquer `toFixed(2) + " €"` ailleurs
// dans le code — toujours utiliser `formatPrice()` pour tout affichage de
// prix (voir mission section 23 : centraliser plutôt que dupliquer).
const priceFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formate un montant en euros selon la convention française (virgule décimale, espace milliers). */
export function formatPrice(amount: number): string {
  return `${priceFormatter.format(amount)} €`;
}

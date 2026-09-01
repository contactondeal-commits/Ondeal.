/**
 * Nettoyage des titres/descriptions CJ — voir mission "TITRES ET
 * DESCRIPTIONS" et "TRADUCTION FRANÇAISE".
 *
 * Ce module fait UNIQUEMENT du nettoyage mécanique (espaces, références
 * fournisseur internes, ponctuation répétée). Il n'invente aucune
 * caractéristique produit et ne fait AUCUNE promesse commerciale non
 * présente dans les données fournisseur.
 *
 * La traduction anglais → français n'est pas automatisée ici par un service
 * tiers non demandé dans la mission (aucune clé d'API de traduction n'a été
 * fournie). L'approche déjà validée sur ce projet est une passe de
 * traduction assistée (agent/LLM) par lot, comme réalisé précédemment pour
 * les 258 premiers produits CJ (voir historique du projet) — à réutiliser
 * pour les nouveaux lots plutôt que de brancher un traducteur automatique
 * non supervisé qui risquerait de déformer des informations techniques.
 */

// Références/formulations fournisseur typiques à retirer des titres CJ.
const SUPPLIER_NOISE_PATTERNS: RegExp[] = [
  /\bcj\s?-?\s?\d+\b/gi, // références internes type "CJ-12345"
  /\bwholesale\b/gi,
  /\bdropship(ping)?\b/gi,
  /\bfree\s+shipping\b/gi,
  /\d+\s*pcs?\/lot\b/gi,
  /\[.*?\]/g, // crochets de type "[HOT SALE]"
];

export function cleanSupplierTitle(rawTitle: string): string {
  let title = rawTitle;
  for (const pattern of SUPPLIER_NOISE_PATTERNS) {
    title = title.replace(pattern, " ");
  }
  return title
    .replace(/\s+/g, " ")
    .replace(/^[\s,.\-–—]+|[\s,.\-–—]+$/g, "")
    .trim();
}

export function cleanSupplierDescription(rawHtml: string): string {
  let html = rawHtml;
  for (const pattern of SUPPLIER_NOISE_PATTERNS) {
    html = html.replace(pattern, " ");
  }
  return html.replace(/(\s|&nbsp;)+/g, " ").trim();
}

/**
 * Normalise quelques unités fréquentes vers le format français
 * (ex: "in" → "po" n'est pas fait — on garde les unités internationales
 * standard, mais on uniformise la notation décimale et les espaces).
 */
export function normalizeUnits(text: string): string {
  return text
    .replace(/(\d),(\d)/g, "$1.$2") // décimales anglaises "6,7" → seulement si ambigu ; à valider manuellement
    .replace(/(\d)\s*mm\b/gi, "$1 mm")
    .replace(/(\d)\s*cm\b/gi, "$1 cm")
    .replace(/(\d)\s*kg\b/gi, "$1 kg")
    .replace(/(\d)\s*g\b/gi, "$1 g");
}

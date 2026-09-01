/**
 * Sérialise un objet JSON-LD pour injection via `dangerouslySetInnerHTML`
 * dans une balise `<script type="application/ld+json">`.
 *
 * `JSON.stringify` seul ne suffit pas : si une valeur (titre produit,
 * description...) contient la sous-chaîne `</script>`, elle romprait hors du
 * tag script et permettrait une injection de script (XSS) côté client. On
 * échappe `<` en séquence Unicode — inoffensif en JSON (les moteurs JSON-LD
 * le décodent normalement) et empêche toute fermeture prématurée de balise.
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

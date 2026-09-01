/**
 * Outil de suivi de l'objectif catalogue — voir mission "OBJECTIF 3000".
 * Agrège les compteurs produits par étape du pipeline CJ → Shopify.
 */

export interface CatalogReport {
  shopifyActiveAtStart: number;
  archivedIgnored: number;
  cjFound: number;
  cjSelected: number;
  cjImported: number;
  cjRejected: number;
  cjErrors: number;
  duplicatesDetected: number;
  cjPending: number; // sélectionnés mais pas encore traités (lots suivants)
  totalActive: number; // shopifyActiveAtStart + cjImported (produits réellement en vente)
  target: number;
  generatedAt: string;
}

export function buildCatalogReport(counts: {
  shopifyActiveAtStart: number;
  archivedIgnored: number;
  cjFound: number;
  cjSelected: number;
  cjImported: number;
  cjRejected: number;
  cjErrors: number;
  duplicatesDetected: number;
  target?: number;
  generatedAt: string;
}): CatalogReport {
  const cjPending = Math.max(0, counts.cjSelected - counts.cjImported - counts.cjRejected - counts.cjErrors);
  return {
    ...counts,
    cjPending,
    totalActive: counts.shopifyActiveAtStart + counts.cjImported,
    target: counts.target ?? 3000,
  };
}

export function formatCatalogReport(report: CatalogReport): string {
  const remaining = Math.max(0, report.target - report.totalActive);
  return [
    `Shopify actifs (début) : ${report.shopifyActiveAtStart}`,
    `Archivés BigBuy ignorés : ${report.archivedIgnored}`,
    `CJ trouvés : ${report.cjFound}`,
    `CJ sélectionnés : ${report.cjSelected}`,
    `CJ importés : ${report.cjImported}`,
    `CJ rejetés : ${report.cjRejected}`,
    `CJ en erreur : ${report.cjErrors}`,
    `CJ en attente (lots suivants) : ${report.cjPending}`,
    `Doublons détectés : ${report.duplicatesDetected}`,
    "",
    `Total actif : ${report.totalActive} / ${report.target}`,
    `Restant pour atteindre l'objectif : ${remaining}`,
    `Généré le : ${report.generatedAt}`,
  ].join("\n");
}

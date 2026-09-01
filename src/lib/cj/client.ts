import type { CJTokenResponse } from "./types";

/**
 * Client bas niveau pour l'API CJdropshipping (API 2.0).
 *
 * Documentation officielle utilisée :
 * - Auth   : https://developers.cjdropshipping.cn/en/api/api2/api/auth.html
 * - Produit: https://developers.cjdropshipping.cn/en/api/api2/api/product.html
 *
 * Ce module est strictement réservé au serveur (Server Components, Route
 * Handlers, scripts d'administration sous scripts/) — jamais un composant
 * client. Pas de marqueur `import "server-only"` ici volontairement : ce
 * module est aussi exécuté en Node pur via `tsx` par les scripts CLI
 * (npm run catalog:*), hors du bundler Next.js où `server-only` fonctionne ;
 * la protection réelle du secret reste native à Next.js — `CJ_API_KEY` n'est
 * pas préfixée `NEXT_PUBLIC_`, donc elle vaut `undefined` dans tout bundle
 * client, quel que soit le fichier qui l'importe par erreur.
 *
 * CREDENTIALS REQUIS (variables d'environnement, voir .env.example) :
 * - CJ_API_KEY       : clé au format "CJUserNum@api@xxxxxxxx", obtenue depuis
 *                       le centre personnel CJdropshipping (Réglages > API).
 * - CJ_API_BASE_URL   : optionnel, par défaut "https://developers.cjdropshipping.com/api2.0/v1".
 *
 * Tant que CJ_API_KEY n'est pas définie, toute fonction de ce module lève une
 * erreur explicite au lieu d'inventer une réponse.
 */

const DEFAULT_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

export class CJConfigError extends Error {}
export class CJApiError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly endpoint?: string
  ) {
    super(message);
  }
}

function getBaseUrl(): string {
  return process.env.CJ_API_BASE_URL?.replace(/\/$/, "") || DEFAULT_BASE_URL;
}

function getApiKey(): string {
  const key = process.env.CJ_API_KEY;
  if (!key) {
    throw new CJConfigError(
      "CJ_API_KEY manquante. Définissez CJ_API_KEY dans votre .env " +
        "(clé obtenue depuis le centre personnel CJdropshipping > Réglages API). " +
        "Voir .env.example et docs/CJ_INTEGRATION.md."
    );
  }
  return key;
}

// --- Cache mémoire du token d'accès (process-local, non persistant) --------
// Selon la doc CJ : accessToken valable 15 jours, refreshToken valable 180 jours.
// Pour une utilisation en production multi-instance, remplacer ce cache mémoire
// par un stockage partagé (Redis, table DB, etc.) — voir docs/CJ_INTEGRATION.md.

interface CachedToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}

let tokenCache: CachedToken | null = null;

// --- Limitation de débit -----------------------------------------------------
// L'API CJ 2.0 applique une limite de requêtes par seconde par endpoint (le
// tiers exact dépend du compte CJ, non communiqué par l'API elle-même) — nous
// l'avons découverte empiriquement le 12/08/2026 en recevant des HTTP 429
// ("product/query") lors d'appels successifs rapprochés pendant un test réel.
// Pour rendre les scripts d'import par lots fiables sur un grand nombre de
// produits, tout appel `cjGet`/`cjPost` passe par cette file d'attente qui
// sérialise les requêtes et impose un espacement minimal, avec une nouvelle
// tentative automatique (une seule) en cas de 429 malgré tout.
const MIN_REQUEST_INTERVAL_MS = Number(process.env.CJ_MIN_REQUEST_INTERVAL_MS ?? "1100");
let requestQueue: Promise<void> = Promise.resolve();

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Sérialise l'exécution de `fn`, en garantissant au moins `MIN_REQUEST_INTERVAL_MS` depuis le dernier appel. */
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = requestQueue.then(async () => {
    const result = await fn();
    await wait(MIN_REQUEST_INTERVAL_MS);
    return result;
  });
  // On avale l'erreur éventuelle dans la chaîne de file d'attente (sinon elle
  // bloquerait tous les appels suivants) — l'erreur réelle est bien propagée
  // à l'appelant via `run`, qui n'est pas modifié par ce `.catch`.
  requestQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function fetchNewAccessToken(): Promise<CachedToken> {
  const apiKey = getApiKey();
  const res = await fetch(`${getBaseUrl()}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  if (!res.ok) {
    throw new CJApiError(`Échec d'authentification CJ (HTTP ${res.status})`, res.status, "authentication/getAccessToken");
  }

  const json = (await res.json()) as CJTokenResponse;
  if (!json.result || !json.data) {
    throw new CJApiError(json.message || "Authentification CJ refusée", json.code, "authentication/getAccessToken");
  }

  return {
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken,
    expiresAt: new Date(json.data.accessTokenExpiryDate).getTime(),
  };
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  // Marge de sécurité de 1h avant expiration pour éviter d'utiliser un token périmé.
  if (tokenCache && tokenCache.expiresAt - now > 60 * 60 * 1000) {
    return tokenCache.accessToken;
  }
  tokenCache = await fetchNewAccessToken();
  return tokenCache.accessToken;
}

/**
 * Effectue un appel GET authentifié vers l'API CJ.
 * `path` est relatif à la base (ex: "product/list", "product/getCategory").
 * Passe par la file d'attente `throttled` (voir plus haut) pour respecter la
 * limite de débit CJ et éviter les HTTP 429 lors d'imports par lots.
 */
export async function cjGet<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  return throttled(async () => {
    const token = await getAccessToken();
    const url = new URL(`${getBaseUrl()}/${path.replace(/^\//, "")}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    });

    const doRequest = () =>
      fetch(url.toString(), {
        method: "GET",
        headers: { "CJ-Access-Token": token },
        // Le catalogue CJ change fréquemment (stock, prix) : ne pas mettre en
        // cache les réponses au niveau fetch — la couche appelante décide de
        // sa propre stratégie de cache/rafraîchissement.
        cache: "no-store",
      });

    let res = await doRequest();
    if (res.status === 429) {
      // Une seule nouvelle tentative, après une pause plus longue que
      // l'espacement normal — voir commentaire sur MIN_REQUEST_INTERVAL_MS.
      await wait(MIN_REQUEST_INTERVAL_MS * 3);
      res = await doRequest();
    }

    if (!res.ok) {
      throw new CJApiError(`Appel CJ échoué : ${path} (HTTP ${res.status})`, res.status, path);
    }

    const json = (await res.json()) as { code: number; result: boolean; message: string };
    if (!json.result) {
      throw new CJApiError(json.message || `Appel CJ refusé : ${path}`, json.code, path);
    }

    return json as unknown as T;
  });
}

/** Effectue un appel POST authentifié vers l'API CJ (ex: ajout à ma sélection). */
export async function cjPost<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
  return throttled(async () => {
    const token = await getAccessToken();
    const doRequest = () =>
      fetch(`${getBaseUrl()}/${path.replace(/^\//, "")}`, {
        method: "POST",
        headers: { "CJ-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });

    let res = await doRequest();
    if (res.status === 429) {
      await wait(MIN_REQUEST_INTERVAL_MS * 3);
      res = await doRequest();
    }

    if (!res.ok) {
      throw new CJApiError(`Appel CJ échoué : ${path} (HTTP ${res.status})`, res.status, path);
    }

    const json = (await res.json()) as { code: number; result: boolean; message: string };
    if (!json.result) {
      throw new CJApiError(json.message || `Appel CJ refusé : ${path}`, json.code, path);
    }

    return json as unknown as T;
  });
}

/** Indique si l'intégration CJ est configurée (clé API présente). Ne vérifie pas sa validité. */
export function isCJConfigured(): boolean {
  return Boolean(process.env.CJ_API_KEY);
}

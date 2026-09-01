/**
 * Mappage catégories CJdropshipping → catégories Ondeal.
 *
 * IMPORTANT : CJdropshipping utilise sa propre taxonomie de catégories,
 * différente de celle d'Ondeal (src/data/categories.ts). Ce fichier ne
 * contient PAS d'identifiants de catégorie CJ réels (ils ne peuvent être
 * obtenus qu'en appelant `getCJCategories()` avec un accès API valide — voir
 * src/lib/cj/products.ts). Il fournit :
 *
 *  1. Une correspondance heuristique par mots-clés (nom de catégorie CJ →
 *     catégorie Ondeal) utilisable dès la première synchronisation ;
 *  2. Un point d'extension `resolveOndealCategory` où brancher, une fois
 *     l'API CJ accessible, la vraie arborescence `getCJCategories()` pour
 *     construire une table catégorie-CJ-id → catégorie-Ondeal-id précise et
 *     validée manuellement (voir mission : "Avant de créer une nouvelle
 *     catégorie, vérifier si une catégorie existante peut être utilisée").
 *
 * Ne pas créer de nouvelle catégorie Ondeal automatiquement : si aucune
 * correspondance fiable n'est trouvée, le produit est classé
 * "non-categorise" et doit être trié manuellement plutôt que de gonfler
 * artificiellement l'arborescence.
 */

import { getAllCategoriesFlat } from "@/data/categories";

export const UNCATEGORIZED = "non-categorise";

/**
 * Convention de tag Shopify pour encoder la catégorie Ondeal d'un produit.
 * IMPORTANT (vérifié le 12/08/2026 par lecture réelle de produits existants
 * dans Shopify) : les ~870 produits déjà importés depuis CJ lors d'un travail
 * antérieur à cette session utilisent le préfixe `cat-` (tiret), par exemple
 * `cat-montres`, `cat-hightech-accessoires` — PAS `cat:` (deux-points).
 * Un premier brouillon de cette session avait par erreur introduit `cat:`
 * (voir scripts/cj-import-batch.ts, scripts/audit-shopify-catalog.ts avant
 * correction), ce qui aurait créé une DEUXIÈME convention concurrente sur
 * les mêmes 893 produits ACTIVE — exactement ce que la mission de
 * catégorisation interdit ("ne pas créer plusieurs systèmes de
 * catégorisation concurrents"). Point d'entrée unique désormais : toujours
 * utiliser `categoryTag()` ci-dessous, jamais un préfixe codé en dur ailleurs.
 */
export const CATEGORY_TAG_PREFIX = "cat-";

/** Construit le tag Shopify canonique pour une catégorie Ondeal donnée. */
export function categoryTag(ondealCategoryId: string): string {
  return `${CATEGORY_TAG_PREFIX}${ondealCategoryId}`;
}

/** Extrait l'id de catégorie Ondeal d'un tag Shopify, si ce tag suit la convention `cat-*`. */
export function parseCategoryTag(tag: string): string | null {
  return tag.startsWith(CATEGORY_TAG_PREFIX) ? tag.slice(CATEGORY_TAG_PREFIX.length) : null;
}

/**
 * Alias de tags Shopify "historiques" — mission "ONDEAL — PHASE 3 : Audit +
 * correction catégories + audit prix + navigation catalogue" (13/08/2026),
 * section 23 (source de vérité) : audit du catalogue réel (970 produits,
 * lecture seule via Storefront API) qui a révélé des tags `cat-*` réellement
 * appliqués aux produits mais NE CORRESPONDANT À AUCUN id de
 * `src/data/categories.ts` — cause racine identifiée : ces tags datent d'une
 * étape de catégorisation antérieure à une restructuration de
 * `categories.ts` qui a renommé certains id (ex: "montres" → "homme-montres"
 * lors de l'imbrication de Mode > Homme > Montres). Les produits eux-mêmes
 * n'ont jamais été re-tagués avec le nouvel id — Shopify n'a PAS été modifié
 * ici, seule la requête de lecture est élargie pour reconnaître ces deux
 * tags historiques, sans toucher aux données Shopify.
 *
 * IMPORTANT : seuls des alias VALIDÉS (contenu du produit vérifié
 * manuellement, correspondance à 100% sans ambiguïté) sont ajoutés ici.
 * Plusieurs autres tags `cat-*` orphelins ont été détectés dans le même
 * audit (`cat-jouets-jeux`, `cat-bricolage-outils`, `cat-eclairage`,
 * `cat-epicerie-fine`, `cat-sports-plein-air`, `cat-autres`) mais leur
 * contenu réel est hétérogène/ambigu (mélange de produits de catégories
 * différentes sous un même tag) — les ajouter ici afficherait des produits
 * dans la mauvaise catégorie, ce que la mission interdit explicitement.
 * Ils sont uniquement documentés dans
 * reports/ondeal-categories-prix-audit.md (section A) comme anomalies à
 * corriger côté Shopify (retaguage manuel), pas dans le code.
 */
const LEGACY_TAG_ALIASES: Record<string, string[]> = {
  // 91 produits réels, tous des montres/montres connectées sans exception
  // (échantillon vérifié manuellement) — tag historique "cat-montres".
  "homme-montres": ["montres"],
  // 4 produits réels, tous des accessoires audio/tech sans exception
  // (échantillon vérifié manuellement) — tag historique "cat-hightech-accessoires".
  "accessoires-electronique": ["hightech-accessoires"],
};

/**
 * Tous les tags Shopify (canonique + alias historiques validés) à interroger
 * pour une catégorie Ondeal donnée. Toujours utiliser cette fonction plutôt
 * que `categoryTag()` seul pour construire une requête Storefront — voir
 * `LEGACY_TAG_ALIASES` ci-dessus.
 */
export function categoryTagsForQuery(ondealCategoryId: string): string[] {
  const legacy = LEGACY_TAG_ALIASES[ondealCategoryId] ?? [];
  return [categoryTag(ondealCategoryId), ...legacy.map((id) => `${CATEGORY_TAG_PREFIX}${id}`)];
}

/**
 * Mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE" (20/08/2026) — demande client
 * explicite : la catégorie "Rentrée scolaire" doit réunir papeterie/bureau
 * ET informatique dans la même page, sans que ces rayons ne soient déplacés
 * ni dupliqués dans l'arborescence (voir src/data/categories.ts — la vraie
 * catégorie "Informatique" reste où elle est, page dédiée inchangée). Cette
 * table étend, en LECTURE SEULE, la liste des catégories interrogées pour la
 * catégorie clé — voir `/category/[slug]/page.tsx`, `collectCategoryIds`.
 * Aucune écriture Shopify : les tags produits réels (`cat-bureau-papeterie`,
 * `cat-pc-portables`, etc.) ne changent pas, seule la page de lecture élargit
 * sa requête.
 *
 * IMPORTANT (vérifié le 20/08/2026 via l'API Shopify) : le rayon
 * Informatique n'a que 18 produits actifs au total, dont certaines
 * sous-catégories à 1 seul produit (`cat-pc-fixes`, `cat-ecrans`) — rayon
 * encore très peu fourni. La catégorie "Rentrée scolaire" hérite donc de ce
 * volume limité côté informatique ; ce n'est pas un bug introduit ici, mais
 * un manque de profondeur catalogue déjà existant à corriger séparément par
 * du sourcing (mission permanente "remplir les collections peu fournies").
 */
export const CATEGORY_ID_UNIONS: Record<string, string[]> = {
  "rentree-scolaire": ["informatique"],
};

/** Mots-clés (français + anglais) associés à chaque catégorie Ondeal existante. */
const KEYWORD_MAP: Record<string, string[]> = {
  // IMPORTANT (12/08/2026, mission "SECONDE PASSE") : "smartphone"/"telephone"/
  // "mobile" apparaissent très souvent comme simple mention de COMPATIBILITÉ
  // sur des produits qui ne sont pas des téléphones (ex: "Casque compatible
  // smartphone", "Clavier gaming avec support téléphone"). Voir
  // `isCompatibilityMention` / `COMPATIBILITY_SENSITIVE_CATEGORIES` plus bas :
  // ces mots-clés sont ignorés pour cette catégorie quand ils apparaissent
  // juste après un mot de compatibilité ("compatible", "pour", "avec",
  // "support", "adapté").
  telephones: ["phone", "smartphone", "telephone", "mobile"],
  tablettes: ["tablet", "tablette", "ipad"],
  "pc-portables": ["laptop", "notebook", "pc portable", "ordinateur portable"],
  "pc-fixes": ["desktop", "pc fixe", "tour"],
  // Même réserve que "telephones" ci-dessus : "écran" apparaît souvent en
  // mention de compatibilité ("protection écran pour téléphone") — voir
  // COMPATIBILITY_SENSITIVE_CATEGORIES.
  ecrans: ["monitor", "ecran", "display"],
  claviers: ["keyboard", "clavier"],
  souris: ["mouse", "souris"],
  audio: [
    "headphone", "earphone", "speaker", "casque", "ecouteur", "enceinte",
    // Ajouts 12/08/2026 (données réelles) : microphone dédié (pas "micro"
    // seul, trop générique — matcherait "micro-ondes"), bandeau audio.
    "microphone", "bandeau bluetooth",
  ],
  tv: ["television", "tv", "televiseur"],
  photo: [
    "camera", "appareil photo", "objectif",
    // Ajouts 12/08/2026 : drones et caméras de surveillance/sport observés
    // en nombre sur le catalogue réel — pas de catégorie dédiée existante,
    // "photo" reste la meilleure catégorie existante pour ces produits.
    "drone", "camera de surveillance", "camera sport", "webcam",
  ],
  "accessoires-electronique": [
    "cable", "chargeur", "charger", "adapter", "power bank",
    // Ajouts 12/08/2026 : gadgets électroniques divers sans catégorie plus
    // spécifique dans la taxonomie actuelle (chargeurs sans fil, répéteurs
    // wifi, sonnettes connectées, batteries).
    "chargeur sans fil", "station de charge", "repeteur wifi",
    "amplificateur de signal", "sonnette video", "sonnette connectee",
    "batterie externe", "anneau lumineux",
  ],
  // Ajouté 12/08/2026 — mission "SECONDE PASSE" : catégorie validée par
  // l'utilisateur. Ne JAMAIS répartir ces produits dans photo/ecrans/
  // accessoires-electronique — c'est la catégorie canonique désormais.
  videoprojecteurs: [
    "videoprojecteur", "video projecteur", "mini projecteur", "projecteur led",
    "home cinema", "projecteur portable",
  ],
  cuisine: [
    "kitchen", "cuisine", "cookware", "ustensile",
    // Ajouts 12/08/2026 : contenants et petits appareils de cuisine/boisson
    // observés en nombre (thermos, gourdes, machine à café, mixeurs).
    "thermos", "gourde", "fondue", "machine a cafe", "presse-ail",
    "mandoline", "extracteur de jus", "blender", "mixeur", "tumbler",
  ],
  meubles: ["furniture", "meuble", "canape", "chaise", "table"],
  decoration: [
    "decor", "decoration", "lampe", "luminaire",
    // Ajouts 12/08/2026 : veilleuses/projecteurs décoratifs très présents
    // sur le catalogue réel (produits CJ "déco chambre").
    "veilleuse", "projecteur galaxie", "projecteur aurore boreale", "horloge murale",
    "globe terrestre",
  ],
  electromenager: [
    "appliance", "electromenager", "aspirateur", "refrigerateur",
    // Ajouts 12/08/2026 : petit électroménager de confort/climat, absent de
    // la liste initiale malgré une présence significative dans le catalogue.
    "ventilateur", "humidificateur", "purificateur d'air", "climatiseur",
    "robot laveur", "robot aspirateur",
  ],
  // Ajouté 12/08/2026 — mission "SECONDE PASSE" : catégorie validée par
  // l'utilisateur (étendoirs, organisateurs de tiroirs, boîtes de rangement).
  rangement: [
    "etendoir", "organisateur", "organiseur", "rangement",
    "boite de rangement", "cube de rangement",
  ],
  "femme-vetements": [
    "women dress", "women clothing", "robe femme", "vetement femme",
    // Ajouts 12/08/2026 : pièces typiquement féminines identifiées sur le
    // catalogue réel (robe, jupe, tailleur, lingerie/gainant). Les pièces
    // réellement unisexes (chemise, pull, pantalon...) ne sont PAS ajoutées
    // ici : voir "À_REVOIR"/finding dans le rapport de mission — la taxonomie
    // actuelle n'a pas de catégorie "Vêtements" unisexe pour les trancher
    // sans indication de genre explicite dans le titre.
    "robe", "jupe", "tailleur", "combinaison femme", "legging", "brassiere",
    "soutien-gorge", "body gainant", "culotte",
  ],
  "femme-chaussures": ["women shoes", "chaussure femme"],
  "femme-sacs": ["women bag", "handbag", "sac femme"],
  // Ajouté 20/08/2026 — mission "REMPLIR LES COLLECTIONS PEU FOURNIES" :
  // catégorie existante (src/data/categories.ts, slug "accessoires-femme")
  // sans aucune entrée KEYWORD_MAP jusqu'ici, ce qui faisait rejeter
  // systématiquement tout produit CJ pertinent (guessOndealCategoryId
  // retournait UNCATEGORIZED → rejet automatique dans evaluateCJProduct).
  // Périmètre volontairement restreint aux accessoires portés/génériques
  // avec signal de genre explicite "femme" — les montres restent dans
  // "homme-montres" (catégorie unique montres, tous genres, déjà en place),
  // les bijoux de type collier/bague/boucle d'oreille dans "maquillage"/
  // "parfums" ne sont pas concernés ici.
  // Correctif 20/08/2026 (même jour) : les mots-clés initiaux étaient
  // uniquement en français, alors que guessOndealCategoryId est appelé avec
  // `productNameEn` (titre CJ, systématiquement en anglais côté fournisseur)
  // — aucun ne matchait donc jamais en pratique (vérifié : lot de test réel,
  // 0 correspondance sur des foulards/écharpes CJ authentiques). Ajout des
  // équivalents anglais, systématiquement associés à "women"/"woman's" pour
  // ne pas capter les mêmes objets côté homme (déjà couverts ailleurs) ni des
  // accessoires pour animaux (ex: "scarf" seul matche aussi des bandanas pour
  // chats/chiens dans le catalogue CJ réel).
  "femme-accessoires": [
    "women accessories", "accessoire femme", "foulard femme", "echarpe femme",
    "gants femme", "ceinture femme", "lunettes de soleil femme", "bonnet femme",
    "bandeau femme", "chapeau femme",
    "womens scarf", "scarf for women", "womens shawl",
    "womens gloves", "womens belt", "womens sunglasses", "womens beanie",
    "womens hat", "womens hair accessory", "hair clip women",
  ],
  "homme-vetements": [
    "men clothing", "vetement homme", "t-shirt homme",
    // Ajouts 12/08/2026 : mêmes réserves que femme-vetements ci-dessus —
    // uniquement des pièces avec un signal de genre explicite dans les
    // données réelles observées (ex: titres "... Homme").
    "costume homme", "blazer homme", "boxer",
  ],
  "homme-chaussures": ["men shoes", "chaussure homme"],
  // Ajouté 12/08/2026 — mission "SECONDE PASSE" : catégorie validée par
  // l'utilisateur pour les vêtements génériques SANS indication de genre
  // explicite. IMPORTANT : ces mots-clés sont volontairement génériques
  // (chemise, pull, pantalon...) car un même nom d'article existe aussi bien
  // en version homme que femme sur le catalogue réel. Le moteur
  // (`resolveClothingGender` dans product-categorizer.ts) reclasse
  // automatiquement vers femme-vetements/homme-vetements si le titre
  // contient explicitement "femme"/"homme" — ne JAMAIS dupliquer cette
  // logique ici avec des mots-clés "homme"/"femme" bruts (risque de
  // faux-positifs déjà constaté avec "parfum homme", "montre homme", etc. où
  // homme-vetements n'est pas la bonne catégorie).
  "vetements-mixte": [
    "chemise", "pull", "pantalon", "manteau", "veste", "sweat", "cardigan",
    "blazer", "costume", "short", "polo", "gilet", "vetement unisexe",
    "vetement mixte", "t-shirt",
  ],
  "homme-montres": [
    "watch", "montre",
    // Ajouts 12/08/2026 : montres et bracelets connectés (fitness tracker)
    // — pas de catégorie "objets connectés" dédiée dans la taxonomie
    // actuelle, "homme-montres" reste la catégorie existante la plus proche
    // pour un objet porté au poignet.
    "montre connectee", "smartwatch", "bracelet connecte", "bague connectee",
  ],
  bebes: ["baby", "bebe", "infant"],
  "soins-visage": ["skincare", "soin visage", "serum"],
  maquillage: ["makeup", "maquillage", "cosmetic"],
  parfums: ["perfume", "parfum", "fragrance"],
  // Ajouté 12/08/2026 — mission "SECONDE PASSE" : catégorie validée par
  // l'utilisateur. Ne PAS répartir ces produits dans soins-visage/maquillage/
  // parfums — c'est la catégorie canonique pour le bien-être corporel.
  "bien-etre-massage": [
    "masseur", "massage", "appareil de massage", "amincissant",
  ],
  "mobilier-jardin": ["garden furniture", "mobilier jardin", "hamac"],
  "outils-jardin": ["garden tool", "outil jardin"],
  barbecue: ["barbecue", "bbq", "grill"],
  fitness: ["fitness", "musculation", "yoga", "haltere"],
  running: ["running", "course a pied"],
  football: ["football", "soccer"],
  romans: ["novel", "roman"],
  bd: ["comic", "bande dessinee", "manga"],
  // Ajouté 20/08/2026 — mission "REMPLIR LES COLLECTIONS PEU FOURNIES" :
  // même correctif que "femme-accessoires" ci-dessus. Catégorie existante
  // (id "jeunesse-livres", slug "jeunesse") sans entrée KEYWORD_MAP. Mots-clés
  // volontairement centrés sur "enfant"/"jeunesse" pour ne jamais capter les
  // livres/cahiers de coloriage ADULTES déjà classés ailleurs (romans/bd).
  "jeunesse-livres": [
    "children book", "kids book", "livre enfant", "livre jeunesse",
    "album jeunesse", "conte enfant", "livre d'eveil", "livre eveil",
    "cahier d'activites enfant", "coloriage enfant",
  ],
  "jeux-societe": ["board game", "jeu de societe"],
  jouets: ["toy", "jouet"],
  "jeux-video": ["video game", "jeu video", "console", "manette"],
  outillage: ["power tool", "outillage", "perceuse", "visseuse"],
  quincaillerie: ["hardware", "quincaillerie", "vis", "boulon"],
  chiens: ["dog", "chien", "chiot", "puppy"],
  // IMPORTANT (corrigé le 12/08/2026) : le mot-clé "cat" seul a été retiré —
  // en correspondance par sous-chaîne (avant le passage à une correspondance
  // par limite de mot ci-dessous), "cat" matchait "location", "vacation",
  // "category", "indication", etc., ce qui aurait mal classé un grand nombre
  // de produits n'ayant aucun rapport avec les chats.
  //
  // Mission "CONTINUER LE SOURCING CJ" (20/08/2026) — "chat"/"chaton"
  // (français) ne matchaient quasiment jamais en pratique : guessOndealCategoryId
  // est toujours appelé sur productNameEn (titres CJ en anglais, voir plus
  // haut), et "kitten"/"feline" seuls ratent la plupart des produits
  // (accessoires génériques titrés "cat bed", "cat toy", etc., jamais
  // "kitten"/"feline"). "cat" seul est maintenant sûr à réintroduire : depuis
  // le passage à la correspondance par LIMITE DE MOT (keywordMatches
  // ci-dessous, pas une correspondance par sous-chaîne), un mot de 3
  // caractères comme "cat" exige une égalité exacte du mot entier
  // (maxSuffix=0 pour kw.length<4) — "category"/"location"/"vacation" ne
  // matchent plus (vérifié).
  chats: ["chat", "chaton", "kitten", "feline", "cat", "cats", "cat toy", "cat bed", "cat tree", "cat litter", "cat collar", "cat carrier", "cat scratcher", "cat bowl", "catnip"],
  // Ajouté le 19/08/2026 (mission "Correction catégorisation catalogue") —
  // nouvelle catégorie "Instruments de musique" créée après découverte de 27
  // produits réels (pianos, guitares, ukulélés, flûtes, tambours, micros...)
  // sans catégorie locale correspondante, tous tagués `instru-musique` côté
  // Shopify. Mots-clés dérivés des titres réels observés.
  "instruments-musique": [
    "piano", "guitare", "guitar", "ukulele", "ocarina", "flute", "kalimba",
    "tambour", "xylophone", "instrument a vent", "instrument de musique",
    "clavier midi", "micro studio", "microphone studio", "saxophone", "trompette",
  ],
  // Ajouté 20/08/2026 — mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE" : nouvelle
  // catégorie "Papeterie & Bureau" (id "bureau-papeterie", tag Shopify déjà
  // appliqué à 210 produits réels — legacy BigBuy + import DSers, jamais
  // représentée dans src/data/categories.ts avant ce jour, donc invisible de
  // toute navigation). Mots-clés dérivés des vrais titres produits observés
  // (cartables, trousses, classeurs, cahiers, calculatrices, étiquettes...).
  "bureau-papeterie": [
    "cartable", "trousse", "classeur", "reliure", "cahier", "carnet",
    "papeterie", "stylo", "crayon", "gomme", "surligneur", "agenda",
    "calculatrice", "etiquette adhesive", "fourre-tout", "chemise a rabat",
    "school bag", "school supplies", "backpack", "pencil case", "binder",
    "notebook", "stationery", "office supplies",
  ],
};

/** Accès en lecture seule à la table de mots-clés (réutilisé par le moteur de catégorisation, voir product-categorizer.ts). Ne jamais dupliquer cette table ailleurs. */
export function getKeywordMap(): Readonly<Record<string, string[]>> {
  return KEYWORD_MAP;
}

/**
 * Vérifie qu'un mot-clé apparaît dans le texte en tant que MOT (limite de
 * mot), jamais en simple sous-chaîne — avec une tolérance de pluriel/suffixe
 * courte pour les mots-clés d'au moins 4 caractères (ex: "headphone" doit
 * matcher "headphones", "watch" doit matcher "watches"/"watch's").
 *
 * IMPORTANT (corrigé le 12/08/2026, en deux temps) :
 *  1. Une correspondance par sous-chaîne (`text.includes(kw)`) faisait
 *     matcher des mots-clés courts (ex: "cat", "tv") à l'intérieur de mots
 *     sans rapport ("location" contient "cat", "activity" contient "tv").
 *  2. Le premier correctif (limite de mot stricte, sans tolérance) a ensuite
 *     raté des correspondances évidentes au pluriel ("headphone" ne matchait
 *     pas "headphones") — découvert en testant le moteur de catégorisation
 *     sur des exemples réalistes avant de l'exécuter sur les vraies données.
 *
 * Règle retenue : mots-clés courts (< 4 caractères, ex: "tv", "bd") exigent
 * une correspondance exacte ; mots-clés plus longs tolèrent jusqu'à 3
 * caractères de suffixe supplémentaires sur le mot du texte (couvre la
 * plupart des pluriels et formes possessives anglais/français sans
 * réintroduire de faux positifs par sous-chaîne).
 */
/**
 * Retire les accents/diacritiques (ex: "é"→"e", "à"→"a") — voir bug critique
 * trouvé le 12/08/2026 en analysant les vraies données du catalogue : la
 * quasi-totalité des titres produits réels utilisent des accents français
 * ("Écouteurs", "Étendoir", "Vêtement"...) alors que KEYWORD_MAP est écrite
 * sans accent ("ecouteur", "vetement"...). Sans cette normalisation,
 * `"écouteurs".startsWith("ecouteur")` est FAUX (le "é" ≠ "e" en comparaison
 * directe), ce qui faisait manquer la quasi-totalité des correspondances sur
 * les mots français accentués — cause principale d'un taux de non-catégorisé
 * artificiellement élevé (581/893 avant correctif). Découvert en examinant un
 * échantillon réel de produits `proposedCategoryId: null` dont les titres
 * contenaient pourtant des mots-clés évidents ("Écouteurs Bluetooth" pour
 * `audio`, "Vêtement Femme" pour `femme-vetements`, etc.).
 */
export function stripDiacritics(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Catégories pour lesquelles un mot-clé apparaissant juste après un mot de
 * COMPATIBILITÉ ("compatible", "pour", "avec", "support", "adapté") ne doit
 * pas compter comme un vrai signal — voir mission "SECONDE PASSE" (12/08/2026),
 * section 8 : "Casque Bluetooth compatible smartphone" → Audio, pas
 * Téléphones ; "Clavier gaming avec support téléphone" → Claviers, pas
 * Téléphones. Sans ce filtre, une simple mention de compatibilité fait
 * basculer à tort le produit vers `telephones`/`ecrans`.
 */
export const COMPATIBILITY_SENSITIVE_CATEGORIES = new Set(["telephones", "ecrans"]);

const COMPATIBILITY_TRIGGERS = new Set([
  "compatible", "compatibles", "pour", "avec", "support", "supporte",
  "adapte", "adaptee", "adaptees", "adaptable", "adaptables",
]);

/**
 * Vrai si CHAQUE occurrence du mot-clé dans le texte est immédiatement
 * précédée (dans une fenêtre de 3 mots) d'un mot de compatibilité — c'est-à-
 * dire que le mot-clé n'apparaît QUE comme mention de compatibilité, jamais
 * comme le produit lui-même. S'il existe au moins une occurrence "libre"
 * (sans mot de compatibilité juste avant), le mot-clé est considéré comme un
 * vrai signal et cette fonction retourne `false`.
 */
export function isCompatibilityMention(text: string, keyword: string): boolean {
  const lowerText = stripDiacritics(text.toLowerCase());
  const words = lowerText.match(/[a-z0-9]+/g) ?? [];
  const kw = stripDiacritics(keyword.toLowerCase());
  const maxSuffix = kw.length >= 4 ? 2 : 0;

  let foundAny = false;
  let allAreCompatibilityMentions = true;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!(word.startsWith(kw) && word.length - kw.length <= maxSuffix)) continue;
    foundAny = true;
    const windowStart = Math.max(0, i - 3);
    const precedingWords = words.slice(windowStart, i);
    if (!precedingWords.some((w) => COMPATIBILITY_TRIGGERS.has(w))) {
      allAreCompatibilityMentions = false;
    }
  }

  return foundAny && allAreCompatibilityMentions;
}

export function keywordMatches(text: string, keyword: string): boolean {
  const lowerText = stripDiacritics(text.toLowerCase());
  if (keyword.includes(" ")) {
    // Mot-clé multi-mots (ex: "power bank") : limite de mot sur la phrase entière.
    const escaped = stripDiacritics(keyword.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i");
    return pattern.test(` ${lowerText} `);
  }

  const kw = stripDiacritics(keyword.toLowerCase());
  // Tolérance volontairement resserrée à 2 caractères (pas 3) : suffisant
  // pour "headphone"→"headphones" ou "watch"→"watches", mais insuffisant
  // pour des faux positifs constatés en test comme "chat"→"chateau" (+3).
  const maxSuffix = kw.length >= 4 ? 2 : 0;
  const words = lowerText.match(/[a-z0-9]+/g) ?? [];
  return words.some((word) => word.startsWith(kw) && word.length - kw.length <= maxSuffix);
}

/**
 * Devine la catégorie Ondeal la plus probable à partir du nom/type de
 * produit CJ. Retourne `UNCATEGORIZED` si aucune correspondance fiable —
 * NE PAS forcer une catégorie approximative, un produit mal classé nuit
 * plus à la marketplace qu'un produit temporairement non catégorisé.
 */
export function guessOndealCategoryId(cjProductNameOrType: string): string {
  const text = cjProductNameOrType.toLowerCase();
  const validIds = new Set(getAllCategoriesFlat().map((c) => c.id));

  for (const [ondealCategoryId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (!validIds.has(ondealCategoryId)) continue; // sécurité si categories.ts évolue
    if (keywords.some((kw) => keywordMatches(text, kw))) {
      return ondealCategoryId;
    }
  }
  return UNCATEGORIZED;
}

/**
 * Catégories Ondeal jugées "insuffisamment couvertes" par le catalogue
 * actuel — à recalculer dynamiquement une fois l'audit Shopify possible
 * (voir scripts/audit-shopify-catalog.ts), en comptant les produits ACTIVE
 * par categoryId et en comparant à un seuil (ex: < 20 produits).
 */
export function findUndercoveredCategories(
  productCountByCategoryId: Record<string, number>,
  threshold = 20
): string[] {
  return getAllCategoriesFlat()
    .filter((c) => c.children.length === 0) // catégories feuilles uniquement
    .filter((c) => (productCountByCategoryId[c.id] ?? 0) < threshold)
    .map((c) => c.id);
}

import type { Category } from "@/types";

// Structure de catégories centralisée — modifiable depuis ce seul fichier.
// Le menu (sidebar, mega-menu, navigation) est généré automatiquement à partir d'ici.

export const categories: Category[] = [
  {
    // Ajouté le 20/08/2026 (mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE",
    // demande client explicite) — cette catégorie n'existait sous AUCUNE
    // forme avant ce jour : 210 produits réels (cartables, trousses,
    // classeurs, cahiers, calculatrices, étiquettes...) portaient déjà le
    // tag Shopify `cat-bureau-papeterie` (legacy BigBuy + import DSers) mais
    // n'apparaissaient dans AUCUNE navigation du site — même défaut de fond
    // que "Instruments de musique" (voir plus bas). Placée en première
    // position (priorité promotionnelle actuelle, cohérent avec la carte
    // "Rentrée scolaire" en tête du carrousel d'accueil, voir
    // CategoryBlocks.tsx). Réunit volontairement papeterie/bureau ET
    // informatique dans une seule page (demande explicite du client) via
    // CATEGORY_ID_UNIONS (src/lib/catalog/category-mapping.ts) plutôt qu'en
    // déplaçant "Informatique" ici — cette catégorie reste indépendante et
    // consultable seule par ailleurs. Sous-catégorie "Papeterie & Bureau"
    // ci-dessous : uniquement le tag `cat-bureau-papeterie` (sans
    // informatique), pour qui veut filtrer sur ce seul rayon.
    id: "rentree-scolaire",
    name: "Rentrée scolaire",
    slug: "rentree-scolaire",
    icon: "Backpack",
    image: "/campaigns/rentree-scolaire.jpg",
    description: "Papeterie, fournitures de bureau et informatique pour la rentrée.",
    children: [
      { id: "bureau-papeterie", name: "Papeterie & Bureau", slug: "papeterie-bureau", icon: "Pencil", children: [] },
    ],
  },
  {
    id: "electronique",
    name: "Électronique",
    slug: "electronique",
    icon: "Smartphone",
    image: "/categories/electronique.jpg",
    description: "Smartphones, tablettes, ordinateurs, audio et plus encore.",
    children: [
      { id: "telephones", name: "Téléphones", slug: "telephones", icon: "Smartphone", children: [] },
      { id: "tablettes", name: "Tablettes", slug: "tablettes", icon: "Tablet", children: [] },
      { id: "ordinateurs", name: "Ordinateurs", slug: "ordinateurs", icon: "Laptop", children: [] },
      { id: "tv", name: "Télévisions", slug: "televisions", icon: "Tv", children: [] },
      { id: "audio", name: "Audio", slug: "audio", icon: "Headphones", children: [] },
      { id: "photo", name: "Photo", slug: "photo", icon: "Camera", children: [] },
      { id: "accessoires-electronique", name: "Accessoires", slug: "accessoires-electronique", icon: "Cable", children: [] },
      // Ajouté 12/08/2026 — mission "SECONDE PASSE DE CATÉGORISATION" :
      // catégorie validée par l'utilisateur, catégorie canonique pour les
      // vidéoprojecteurs/mini-projecteurs (ne pas les répartir dans Photo,
      // Écrans ou Accessoires électroniques).
      { id: "videoprojecteurs", name: "Vidéoprojecteurs", slug: "videoprojecteurs", icon: "Projector", children: [] },
    ],
  },
  {
    id: "informatique",
    name: "Informatique",
    slug: "informatique",
    icon: "Laptop",
    image: "/categories/informatique.jpg",
    description: "PC portables, PC fixes, écrans, périphériques.",
    children: [
      { id: "pc-portables", name: "PC portables", slug: "pc-portables", icon: "Laptop", children: [] },
      { id: "pc-fixes", name: "PC fixes", slug: "pc-fixes", icon: "Monitor", children: [] },
      { id: "ecrans", name: "Écrans", slug: "ecrans", icon: "Monitor", children: [] },
      { id: "claviers", name: "Claviers", slug: "claviers", icon: "Keyboard", children: [] },
      { id: "souris", name: "Souris", slug: "souris", icon: "Mouse", children: [] },
    ],
  },
  {
    id: "maison",
    name: "Maison",
    slug: "maison",
    icon: "Sofa",
    image: "/categories/maison.jpg",
    description: "Cuisine, meubles, décoration et électroménager.",
    children: [
      { id: "cuisine", name: "Cuisine", slug: "cuisine", icon: "CookingPot", children: [] },
      { id: "meubles", name: "Meubles", slug: "meubles", icon: "Sofa", children: [] },
      { id: "decoration", name: "Décoration", slug: "decoration", icon: "Lamp", children: [] },
      { id: "electromenager", name: "Électroménager", slug: "electromenager", icon: "Refrigerator", children: [] },
      // Ajouté 12/08/2026 — mission "SECONDE PASSE DE CATÉGORISATION" :
      // catégorie validée par l'utilisateur (étendoirs, organisateurs de
      // tiroirs, boîtes/rangements modulaires...).
      { id: "rangement", name: "Rangement", slug: "rangement", icon: "Archive", children: [] },
    ],
  },
  {
    id: "mode",
    name: "Mode",
    slug: "mode",
    icon: "Shirt",
    image: "/categories/mode.jpg",
    description: "Vêtements, chaussures, sacs et accessoires pour toute la famille.",
    children: [
      {
        id: "mode-femme", name: "Femme", slug: "femme", icon: "Shirt",
        children: [
          { id: "femme-vetements", name: "Vêtements", slug: "vetements", icon: "Shirt", children: [] },
          { id: "femme-chaussures", name: "Chaussures", slug: "chaussures", icon: "Footprints", children: [] },
          { id: "femme-sacs", name: "Sacs", slug: "sacs", icon: "ShoppingBag", children: [] },
          { id: "femme-accessoires", name: "Accessoires", slug: "accessoires-femme", icon: "Watch", children: [] },
        ],
      },
      {
        id: "mode-homme", name: "Homme", slug: "homme", icon: "Shirt",
        children: [
          { id: "homme-vetements", name: "Vêtements", slug: "vetements-homme", icon: "Shirt", children: [] },
          { id: "homme-chaussures", name: "Chaussures", slug: "chaussures-homme", icon: "Footprints", children: [] },
          { id: "homme-montres", name: "Montres", slug: "montres", icon: "Watch", children: [] },
          { id: "homme-accessoires", name: "Accessoires", slug: "accessoires-homme", icon: "Glasses", children: [] },
        ],
      },
      {
        id: "mode-enfants", name: "Enfants", slug: "enfants", icon: "Baby",
        children: [
          { id: "bebes", name: "Bébés", slug: "bebes", icon: "Baby", children: [] },
          { id: "filles", name: "Filles", slug: "filles", icon: "Shirt", children: [] },
          { id: "garcons", name: "Garçons", slug: "garcons", icon: "Shirt", children: [] },
        ],
      },
      // Ajouté 12/08/2026 — mission "SECONDE PASSE DE CATÉGORISATION" :
      // catégorie validée par l'utilisateur, réservée aux vêtements dont le
      // titre/la description ne permet pas de déterminer le genre de façon
      // fiable (ex: "Pull oversize unisexe") — jamais utilisée si "homme" ou
      // "femme" apparaît explicitement (ces cas restent dans
      // femme-vetements/homme-vetements, voir product-categorizer.ts).
      { id: "vetements-mixte", name: "Vêtements mixte / unisexe", slug: "vetements-mixte", icon: "Shirt", children: [] },
      // Ajouté 12/08/2026 — mission "VALIDATION TAXONOMIE + PRÉPARATION DU
      // PREMIER LOT CJ" : catégorie validée par l'utilisateur (proposée en
      // V2 sur la base de 147 produits ACTIVE déjà présents au catalogue,
      // non gendrée par défaut — regroupe colliers, bracelets, bagues,
      // boucles d'oreilles, bijoux fantaisie/acier/argent/plaqué or/pierres.
      // ÉTAPE LOCALE UNIQUEMENT : non encore écrite dans Shopify (aucun tag
      // cat-bijoux appliqué), voir data/cj-phase1-bijoux-reclassification.json.
      { id: "bijoux", name: "Bijoux", slug: "bijoux", icon: "Gem", children: [] },
    ],
  },
  {
    id: "beaute",
    // Nom mis à jour le 12/08/2026 (mission "SECONDE PASSE DE
    // CATÉGORISATION") pour refléter l'ajout de la sous-catégorie
    // Bien-être/Massage — id/slug inchangés pour ne rien casser (tags,
    // routes existantes).
    name: "Beauté & Bien-être",
    slug: "beaute",
    icon: "Sparkles",
    image: "/categories/beaute.jpg",
    description: "Soins, maquillage, parfums et bien-être.",
    children: [
      { id: "soins-visage", name: "Soins visage", slug: "soins-visage", icon: "Sparkles", children: [] },
      { id: "maquillage", name: "Maquillage", slug: "maquillage", icon: "Sparkles", children: [] },
      { id: "parfums", name: "Parfums", slug: "parfums", icon: "FlaskConical", children: [] },
      // Ajouté 12/08/2026 — mission "SECONDE PASSE DE CATÉGORISATION" :
      // catégorie validée par l'utilisateur (masseurs, appareils de
      // bien-être/beauté corporelle — distincte de Soins visage/Maquillage).
      { id: "bien-etre-massage", name: "Bien-être / Massage", slug: "bien-etre-massage", icon: "HeartPulse", children: [] },
    ],
  },
  {
    id: "jardin",
    name: "Jardin",
    slug: "jardin",
    icon: "Trees",
    image: "/categories/jardin.jpg",
    description: "Mobilier de jardin, outils et barbecue.",
    children: [
      { id: "mobilier-jardin", name: "Mobilier de jardin", slug: "mobilier-jardin", icon: "Trees", children: [] },
      { id: "outils-jardin", name: "Outils", slug: "outils-jardin", icon: "Hammer", children: [] },
      { id: "barbecue", name: "Barbecue", slug: "barbecue", icon: "Flame", children: [] },
    ],
  },
  {
    id: "sport",
    name: "Sport",
    slug: "sport",
    icon: "Dumbbell",
    image: "/categories/sport.jpg",
    description: "Fitness, running, football et plein air.",
    children: [
      { id: "fitness", name: "Fitness", slug: "fitness", icon: "Dumbbell", children: [] },
      { id: "running", name: "Running", slug: "running", icon: "Footprints", children: [] },
      { id: "football", name: "Football", slug: "football", icon: "CircleDot", children: [] },
    ],
  },
  {
    id: "livres",
    name: "Livres",
    slug: "livres",
    icon: "BookOpen",
    image: "/categories/livres.jpg",
    description: "Romans, bandes dessinées et jeunesse.",
    children: [
      { id: "romans", name: "Romans", slug: "romans", icon: "BookOpen", children: [] },
      { id: "bd", name: "BD", slug: "bd", icon: "BookOpen", children: [] },
      { id: "jeunesse-livres", name: "Jeunesse", slug: "jeunesse", icon: "BookOpen", children: [] },
    ],
  },
  {
    id: "jeux-jouets",
    name: "Jeux et jouets",
    slug: "jeux-et-jouets",
    icon: "Puzzle",
    image: "/categories/jeux.jpg",
    description: "Jeux de société, jouets et jeux vidéo.",
    children: [
      { id: "jeux-societe", name: "Jeux de société", slug: "jeux-de-societe", icon: "Puzzle", children: [] },
      { id: "jouets", name: "Jouets", slug: "jouets", icon: "Puzzle", children: [] },
      { id: "jeux-video", name: "Jeux vidéo", slug: "jeux-video", icon: "Gamepad2", children: [] },
    ],
  },
  {
    id: "bricolage",
    name: "Bricolage",
    slug: "bricolage",
    icon: "Wrench",
    image: "/categories/bricolage.jpg",
    description: "Outillage, quincaillerie et matériaux.",
    children: [
      { id: "outillage", name: "Outillage", slug: "outillage", icon: "Wrench", children: [] },
      { id: "quincaillerie", name: "Quincaillerie", slug: "quincaillerie", icon: "Hammer", children: [] },
    ],
  },
  {
    id: "animalerie",
    name: "Animalerie",
    slug: "animalerie",
    icon: "PawPrint",
    image: "/categories/animalerie.jpg",
    description: "Tout pour vos animaux de compagnie.",
    children: [
      { id: "chiens", name: "Chiens", slug: "chiens", icon: "PawPrint", children: [] },
      { id: "chats", name: "Chats", slug: "chats", icon: "PawPrint", children: [] },
    ],
  },
  {
    // Ajouté le 19/08/2026 (mission "Correction catégorisation catalogue") —
    // 27 produits réels (pianos, guitares, ukulélés, flûtes, tambours,
    // micros...) existent dans le catalogue Shopify sous le tag `instru-musique`
    // mais n'avaient AUCUNE catégorie locale correspondante avant ce jour :
    // ils étaient donc invisibles dans toute la navigation du site. Catégorie
    // créée en top-level (pas de sous-catégorie forcée pour l'instant, faute
    // de volume suffisant par famille d'instrument — cf. reports pour le
    // détail produit par produit). Pas d'image statique fournie : le bloc
    // d'accueil utilise automatiquement la vraie photo d'un produit réel de
    // la catégorie (voir CategoryBlocks.tsx, `hero.images[0]`).
    id: "instruments-musique",
    name: "Instruments de musique",
    slug: "instruments-musique",
    icon: "Music",
    description: "Pianos, guitares, ukulélés, flûtes, percussions et accessoires pour musiciens.",
    children: [],
  },
];

export function findCategoryBySlug(slug: string, list: Category[] = categories): Category | undefined {
  for (const cat of list) {
    if (cat.slug === slug) return cat;
    const found = findCategoryBySlug(slug, cat.children);
    if (found) return found;
  }
  return undefined;
}

export function getAllCategoriesFlat(list: Category[] = categories): Category[] {
  return list.flatMap((cat) => [cat, ...getAllCategoriesFlat(cat.children)]);
}

// Catégories mises en avant dans la navigation principale (mega-menu)
export const megaMenuCategoryIds = ["mode", "electronique", "maison"];

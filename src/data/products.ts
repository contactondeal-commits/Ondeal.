import type { Badge, Product, ProductReview } from "@/types";
import { brands } from "./brands";
import { SITE_NAME } from "@/lib/site-config";

// PRNG déterministe (mulberry32) — évite Math.random() pour ne pas casser
// l'hydratation SSR/CSR de Next.js (le serveur et le client doivent générer
// exactement les mêmes données mockées).
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260812);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProductTemplate {
  name: string;
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  features: string[];
  specifications: Record<string, string>;
}

const templates: ProductTemplate[] = [
  { name: "Smartphone écran 6.7\" 128Go", categoryId: "electronique", subcategoryId: "telephones", basePrice: 349, features: ["Écran AMOLED 120Hz", "Triple capteur photo 50MP", "Batterie 5000mAh", "Charge rapide 33W"], specifications: { "Stockage": "128 Go", "RAM": "8 Go", "Écran": "6.7 pouces", "Batterie": "5000 mAh" } },
  { name: "Tablette 10.9\" WiFi 64Go", categoryId: "electronique", subcategoryId: "tablettes", basePrice: 229, features: ["Écran Full HD", "Autonomie 10h", "Compatible stylet"], specifications: { "Stockage": "64 Go", "Écran": "10.9 pouces", "Poids": "465 g" } },
  { name: "Casque audio sans fil réduction de bruit", categoryId: "electronique", subcategoryId: "audio", basePrice: 89, features: ["Réduction de bruit active", "Autonomie 30h", "Bluetooth 5.3"], specifications: { "Autonomie": "30h", "Poids": "250 g", "Connectivité": "Bluetooth 5.3" } },
  { name: "Enceinte Bluetooth portable étanche", categoryId: "electronique", subcategoryId: "audio", basePrice: 45, features: ["Étanche IPX7", "Autonomie 12h", "Son 360°"], specifications: { "Puissance": "20W", "Autonomie": "12h" } },
  { name: "Téléviseur LED 55\" 4K", categoryId: "electronique", subcategoryId: "tv", basePrice: 449, features: ["4K UHD", "Smart TV", "HDR10"], specifications: { "Taille": "55 pouces", "Résolution": "3840x2160" } },
  { name: "Appareil photo hybride 24MP", categoryId: "electronique", subcategoryId: "photo", basePrice: 599, features: ["Capteur 24MP", "Vidéo 4K", "Stabilisation optique"], specifications: { "Capteur": "24 MP", "Vidéo": "4K 30fps" } },
  { name: "Câble USB-C renforcé 2m", categoryId: "electronique", subcategoryId: "accessoires-electronique", basePrice: 12, features: ["Charge rapide", "Tressé nylon", "2 mètres"], specifications: { "Longueur": "2 m", "Charge": "100W" } },
  { name: "PC portable 15.6\" i5 16Go", categoryId: "informatique", subcategoryId: "pc-portables", basePrice: 649, features: ["Processeur i5", "16 Go RAM", "SSD 512 Go"], specifications: { "RAM": "16 Go", "Stockage": "SSD 512 Go", "Écran": "15.6 pouces" } },
  { name: "PC fixe gamer RTX", categoryId: "informatique", subcategoryId: "pc-fixes", basePrice: 999, features: ["Carte graphique dédiée", "16 Go RAM", "SSD 1To"], specifications: { "RAM": "16 Go", "Stockage": "SSD 1 To" } },
  { name: "Écran PC 27\" 144Hz", categoryId: "informatique", subcategoryId: "ecrans", basePrice: 219, features: ["144Hz", "1ms", "IPS"], specifications: { "Taille": "27 pouces", "Fréquence": "144 Hz" } },
  { name: "Clavier mécanique rétroéclairé", categoryId: "informatique", subcategoryId: "claviers", basePrice: 59, features: ["Switchs mécaniques", "Rétroéclairage RGB"], specifications: { "Connectivité": "USB / Bluetooth" } },
  { name: "Souris gaming sans fil", categoryId: "informatique", subcategoryId: "souris", basePrice: 39, features: ["16000 DPI", "Sans fil", "Autonomie 70h"], specifications: { "DPI": "16000" } },
  { name: "Batterie de cuisine 10 pièces", categoryId: "maison", subcategoryId: "cuisine", basePrice: 79, features: ["Antiadhésif", "Compatible induction"], specifications: { "Pièces": "10" } },
  { name: "Canapé d'angle convertible", categoryId: "maison", subcategoryId: "meubles", basePrice: 549, features: ["Convertible", "Coffre de rangement"], specifications: { "Places": "5" } },
  { name: "Lampe de table design", categoryId: "maison", subcategoryId: "decoration", basePrice: 34, features: ["LED intégrée", "3 intensités"], specifications: { "Hauteur": "42 cm" } },
  { name: "Réfrigérateur combiné 300L", categoryId: "maison", subcategoryId: "electromenager", basePrice: 449, features: ["No Frost", "Classe énergie C"], specifications: { "Volume": "300 L" } },
  { name: "T-shirt coton bio col rond", categoryId: "mode", subcategoryId: "femme-vetements", basePrice: 19, features: ["Coton bio", "Coupe régulière"], specifications: { "Matière": "100% coton" } },
  { name: "Baskets running légères", categoryId: "mode", subcategoryId: "femme-chaussures", basePrice: 59, features: ["Semelle amortissante", "Respirant"], specifications: { "Matière": "Mesh" } },
  { name: "Sac à main cuir végétal", categoryId: "mode", subcategoryId: "femme-sacs", basePrice: 69, features: ["Cuir végétal", "Bandoulière ajustable"], specifications: { "Dimensions": "30x22x12 cm" } },
  { name: "Chemise coupe slim", categoryId: "mode", subcategoryId: "homme-vetements", basePrice: 39, features: ["Coupe slim", "Repassage facile"], specifications: { "Matière": "Coton mélangé" } },
  { name: "Montre chronographe acier", categoryId: "mode", subcategoryId: "homme-montres", basePrice: 89, features: ["Étanche 5ATM", "Bracelet acier"], specifications: { "Étanchéité": "5 ATM" } },
  { name: "Doudoune bébé capuche", categoryId: "mode", subcategoryId: "bebes", basePrice: 29, features: ["Déperlant", "Capuche amovible"], specifications: { "Matière": "Polyester" } },
  { name: "Crème hydratante visage 50ml", categoryId: "beaute", subcategoryId: "soins-visage", basePrice: 15, features: ["Hydratation 24h", "Sans parabène"], specifications: { "Contenance": "50 ml" } },
  { name: "Palette maquillage 12 teintes", categoryId: "beaute", subcategoryId: "maquillage", basePrice: 22, features: ["12 teintes", "Longue tenue"], specifications: { "Teintes": "12" } },
  { name: "Eau de parfum 90ml", categoryId: "beaute", subcategoryId: "parfums", basePrice: 45, features: ["Notes boisées", "Longue tenue"], specifications: { "Contenance": "90 ml" } },
  { name: "Salon de jardin résine tressée", categoryId: "jardin", subcategoryId: "mobilier-jardin", basePrice: 329, features: ["Résine tressée", "Coussins inclus"], specifications: { "Places": "6" } },
  { name: "Kit outils de jardinage 8 pièces", categoryId: "jardin", subcategoryId: "outils-jardin", basePrice: 24, features: ["Acier inoxydable", "Sac de rangement"], specifications: { "Pièces": "8" } },
  { name: "Barbecue à charbon roulettes", categoryId: "jardin", subcategoryId: "barbecue", basePrice: 79, features: ["Grille réglable", "Roulettes"], specifications: { "Diamètre": "57 cm" } },
  { name: "Tapis de course pliable", categoryId: "sport", subcategoryId: "fitness", basePrice: 249, features: ["Pliable", "12 programmes"], specifications: { "Vitesse max": "14 km/h" } },
  { name: "Chaussures running amorties", categoryId: "sport", subcategoryId: "running", basePrice: 69, features: ["Amorti réactif", "Respirant"], specifications: { "Poids": "260 g" } },
  { name: "Ballon de football taille 5", categoryId: "sport", subcategoryId: "football", basePrice: 19, features: ["Résistant à l'usure", "Toutes surfaces"], specifications: { "Taille": "5" } },
  { name: "Roman policier best-seller", categoryId: "livres", subcategoryId: "romans", basePrice: 12, features: ["Broché", "320 pages"], specifications: { "Pages": "320" } },
  { name: "BD aventure tome 1", categoryId: "livres", subcategoryId: "bd", basePrice: 14, features: ["Couverture rigide", "48 pages"], specifications: { "Pages": "48" } },
  { name: "Livre jeunesse illustré", categoryId: "livres", subcategoryId: "jeunesse-livres", basePrice: 9, features: ["Dès 4 ans", "Illustrations couleur"], specifications: { "Âge": "4+" } },
  { name: "Jeu de société stratégie", categoryId: "jeux-jouets", subcategoryId: "jeux-societe", basePrice: 34, features: ["2 à 6 joueurs", "Dès 10 ans"], specifications: { "Joueurs": "2-6" } },
  { name: "Circuit de voitures télécommandées", categoryId: "jeux-jouets", subcategoryId: "jouets", basePrice: 44, features: ["Piste 4m", "2 voitures incluses"], specifications: { "Longueur piste": "4 m" } },
  { name: "Manette sans fil compatible multi-plateformes", categoryId: "jeux-jouets", subcategoryId: "jeux-video", basePrice: 39, features: ["Sans fil", "Vibration double moteur"], specifications: { "Autonomie": "20h" } },
  { name: "Perceuse visseuse sans fil 18V", categoryId: "bricolage", subcategoryId: "outillage", basePrice: 69, features: ["2 batteries incluses", "Mallette de transport"], specifications: { "Tension": "18V" } },
  { name: "Coffret de vis et chevilles 200pcs", categoryId: "bricolage", subcategoryId: "quincaillerie", basePrice: 15, features: ["200 pièces", "Boîte de rangement"], specifications: { "Pièces": "200" } },
  { name: "Panier pour chien rembourré", categoryId: "animalerie", subcategoryId: "chiens", basePrice: 29, features: ["Housse lavable", "Antidérapant"], specifications: { "Taille": "M" } },
  { name: "Arbre à chat 3 niveaux", categoryId: "animalerie", subcategoryId: "chats", basePrice: 39, features: ["Griffoir sisal", "3 niveaux"], specifications: { "Hauteur": "90 cm" } },
];

const reviewAuthors = ["Camille", "Julien", "Sofia", "Nicolas", "Amandine", "Yanis", "Chloé", "Mehdi", "Laura", "Thomas"];
const reviewTitles = ["Très satisfait", "Bon rapport qualité-prix", "Conforme à la description", "Livraison rapide", "Je recommande", "Un peu déçu", "Parfait pour l'usage prévu"];

function generateReviews(count: number): ProductReview[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev-${i}`,
    author: pick(reviewAuthors),
    rating: randInt(3, 5),
    date: `2026-0${randInt(1, 8)}-${String(randInt(1, 28)).padStart(2, "0")}`,
    title: pick(reviewTitles),
    comment: "Produit reçu rapidement, conforme à mes attentes. Le rapport qualité-prix est correct pour cette gamme.",
    verified: rng() > 0.2,
    helpful: randInt(0, 45),
  }));
}

function buildProduct(template: ProductTemplate, index: number): Product {
  const brand = pick(brands);
  const title = `${brand.name} — ${template.name}`;
  const slug = `${slugify(title)}-${index}`;
  const hasDiscount = rng() > 0.55;
  const price = Math.round((template.basePrice * (0.9 + rng() * 0.3)) * 100) / 100;
  const oldPrice = hasDiscount ? Math.round(price * (1.15 + rng() * 0.3) * 100) / 100 : undefined;
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;
  const stock = randInt(0, 80);
  const inStock = stock > 0;
  const createdDaysAgo = randInt(0, 120);
  const salesCount = randInt(3, 2400);

  const badges: Badge[] = [];
  if (!inStock) badges.push("RUPTURE_STOCK");
  if (createdDaysAgo < 14) badges.push("NOUVEAU");
  if (hasDiscount && discount && discount >= 15) badges.push("PROMOTION");
  if (salesCount > 1500) badges.push("BESTSELLER");
  else if (salesCount > 800) badges.push("TOP_VENTE");
  if (rng() > 0.85) badges.push("EXCLUSIVITE");
  if (rng() > 0.8 && !badges.includes("BESTSELLER")) badges.push("RECOMMANDE");

  const reviewsCount = randInt(0, 1800);
  const rating = reviewsCount > 0 ? Math.round((3.4 + rng() * 1.6) * 10) / 10 : 0;

  const now = new Date("2026-08-12T00:00:00Z").getTime();
  const createdAt = new Date(now - createdDaysAgo * 86400000).toISOString();

  return {
    id: `prod-${index}`,
    slug,
    title,
    brand: brand.name,
    categoryId: template.categoryId,
    subcategoryId: template.subcategoryId,
    images: [`ph:${template.categoryId}:${index}:0`, `ph:${template.categoryId}:${index}:1`, `ph:${template.categoryId}:${index}:2`],
    price,
    oldPrice,
    discount,
    rating,
    reviewsCount,
    reviews: generateReviews(Math.min(6, reviewsCount > 0 ? randInt(1, 6) : 0)),
    stock,
    inStock,
    badges,
    delivery: {
      fast: rng() > 0.4,
      freeShipping: price >= 39 || rng() > 0.5,
      estimate: rng() > 0.5 ? "Livraison demain" : "Livraison sous 2-4 jours",
    },
    // Mission IDENTITÉ VISUELLE (2026-08-13) — "MonSite" (placeholder
    // générique) remplacé par le vrai nom de marque SITE_NAME ; ce fichier
    // ne génère que des données de démonstration (fallback local quand
    // Shopify n'est pas configuré, voir productService.ts) — aucune donnée
    // catalogue Shopify réelle n'est concernée par ce changement.
    seller: rng() > 0.7 ? pick([`Vendu par ${SITE_NAME}`, `Vendu par ${brand.name} Store`]) : `Vendu par ${SITE_NAME}`,
    description: `${title} — ${template.features.join(", ")}. Conçu pour allier performance et fiabilité au quotidien, ce produit répond aux besoins des utilisateurs les plus exigeants tout en restant accessible.`,
    features: template.features,
    specifications: template.specifications,
    createdAt,
    salesCount,
  };
}

// Génère plusieurs variantes par template pour dépasser largement les 30 produits minimum
export const products: Product[] = templates.flatMap((tpl, tplIndex) => {
  const variantCount = 2;
  return Array.from({ length: variantCount }, (_, v) => buildProduct(tpl, tplIndex * variantCount + v));
});

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId || p.subcategoryId === categoryId);
}

export function getRelatedProducts(product: Product, count = 6): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, count);
}

export function getBestsellers(count = 10): Product[] {
  return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, count);
}

export function getNewArrivals(count = 10): Product[] {
  return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, count);
}

export function getDeals(count = 10): Product[] {
  return [...products].filter((p) => p.discount && p.discount > 0).sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0)).slice(0, count);
}

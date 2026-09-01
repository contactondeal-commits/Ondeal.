export interface HelpItem {
  id: string;
  question: string;
  answer: string;
}

export interface HelpSection {
  id: string;
  title: string;
  items: HelpItem[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: "commandes",
    title: "Commandes",
    items: [
      {
        id: "suivre-commande",
        question: "Comment suivre ma commande ?",
        answer:
          "Rendez-vous dans « Mon compte » puis « Mes commandes » pour consulter le statut et le numéro de suivi de chaque commande dès qu'elle est expédiée.",
      },
      {
        id: "modifier-commande",
        question: "Puis-je modifier ou annuler ma commande ?",
        answer:
          "Une commande peut être modifiée ou annulée tant qu'elle n'a pas été préparée pour l'expédition. Contactez le service client dès que possible pour toute demande de changement.",
      },
      {
        id: "delai-livraison",
        question: "Quels sont les délais de livraison ?",
        answer:
          "Les délais varient selon le produit et le mode de livraison choisi, généralement entre 2 et 7 jours ouvrés. Le délai estimé est indiqué sur chaque fiche produit avant l'achat.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Livraison",
    items: [
      {
        id: "frais-livraison",
        question: "Quels sont les frais de livraison ?",
        // Corrigé le 2026-08-14 (mission déploiement Vercel) : 39 € était un
        // chiffre jamais recroisé avec Shopify. Seuil réel confirmé =
        // FREE_SHIPPING_THRESHOLD (@/lib/site-config, 80 €).
        answer:
          "La livraison standard est gratuite dès 80 € d'achat. En dessous de ce montant, des frais de livraison sont calculés au moment du paiement selon votre adresse.",
      },
      {
        id: "zones-livrees",
        question: "Livrez-vous partout en France et en Europe ?",
        answer:
          "Oui, nous livrons en France métropolitaine, dans les DOM-TOM et dans la plupart des pays de l'Union européenne. Les délais et frais peuvent varier selon la destination.",
      },
    ],
  },
  {
    id: "retours",
    title: "Retours & remboursements",
    items: [
      {
        id: "delai-retour",
        question: "De combien de temps je dispose pour retourner un article ?",
        answer:
          "Vous disposez de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, conformément à la réglementation en vigueur.",
      },
      {
        id: "remboursement",
        question: "Sous quel délai suis-je remboursé ?",
        answer:
          "Le remboursement est effectué sous 14 jours après réception et contrôle de l'article retourné, sur le même moyen de paiement utilisé lors de l'achat.",
      },
    ],
  },
  {
    id: "paiement",
    title: "Paiement & sécurité",
    items: [
      {
        id: "moyens-paiement",
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Nous acceptons les cartes bancaires (Visa, Mastercard), ainsi que d'autres moyens de paiement sécurisés affichés lors du passage en caisse.",
      },
      {
        id: "securite-paiement",
        question: "Mes informations de paiement sont-elles sécurisées ?",
        answer:
          "Oui, toutes les transactions sont chiffrées et traitées par des prestataires de paiement certifiés. Nous ne stockons jamais vos données bancaires complètes sur nos serveurs.",
      },
    ],
  },
  {
    id: "compte",
    title: "Compte & confidentialité",
    items: [
      {
        id: "creer-compte",
        question: "Dois-je créer un compte pour commander ?",
        answer:
          "Un compte permet de suivre vos commandes et de gérer vos favoris, mais n'est pas obligatoire : vous pouvez également commander en tant qu'invité.",
      },
      {
        id: "donnees-personnelles",
        question: "Comment sont utilisées mes données personnelles ?",
        answer:
          "Vos données sont utilisées uniquement pour le traitement de vos commandes et l'amélioration de votre expérience. Consultez notre politique de confidentialité pour plus de détails.",
      },
    ],
  },
  {
    id: "vendeur",
    title: "Devenir vendeur",
    items: [
      {
        id: "devenir-vendeur",
        question: "Puis-je vendre mes produits sur OnDeal ?",
        answer:
          "OnDeal fonctionne aujourd'hui comme une boutique unique, sans marketplace ouverte aux vendeurs tiers. Les fournisseurs et marques intéressés par un partenariat peuvent nous contacter directement — voir la page « Nos Partenaires ».",
      },
    ],
  },
];

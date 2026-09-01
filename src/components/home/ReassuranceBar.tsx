import { ShieldCheck, Truck, RotateCcw, Headphones, MapPin, CreditCard } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site-config";
import styles from "./ReassuranceBar.module.css";

const ITEMS = [
  { icon: ShieldCheck, label: "Paiement sécurisé", sub: "Visa · Mastercard · PayPal" },
  { icon: Truck, label: "Livraison offerte", sub: `Dès ${FREE_SHIPPING_THRESHOLD} €` },
  { icon: RotateCcw, label: "Retours sous 14 jours", sub: "Satisfait ou remboursé" },
  { icon: Headphones, label: "SAV 100% Français", sub: "Support basé en France" },
  { icon: MapPin, label: "Expédition mondiale", sub: "Livraison partout" },
  { icon: CreditCard, label: "Paiement en plusieurs fois", sub: "Sans frais" },
];

export default function ReassuranceBar() {
  return (
    <section className={styles.bar} aria-label="Nos engagements">
      <ul className={styles.list}>
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <li key={label} className={styles.item}>
            <span className={styles.iconWrap}>
              <Icon size={20} />
            </span>
            <span className={styles.text}>
              <strong>{label}</strong>
              <span>{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

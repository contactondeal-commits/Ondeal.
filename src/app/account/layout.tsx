import Link from "next/link";
import { User, Package, Heart, MapPin, CreditCard, Settings } from "lucide-react";
import { getCustomer } from "@/lib/shopify/customer";
import LogoutButton from "./LogoutButton";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/account", label: "Tableau de bord", icon: User },
  { href: "/account/orders", label: "Mes commandes", icon: Package },
  { href: "/account/wishlist", label: "Mes favoris", icon: Heart },
  { href: "/account/profile", label: "Mes informations", icon: Settings },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomer();
  const displayName = customer
    ? `${customer.firstName} ${customer.lastName}`.trim()
    : "Mon compte";

  return (
    <div className={`${styles.page} container`}>
      <aside className={styles.sidebar}>
        <p className={styles.greeting}>Bonjour, {displayName}</p>
        <nav aria-label="Navigation du compte">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    <Icon size={17} /> {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <span className={styles.navLink}>
                <MapPin size={17} /> Mes adresses
              </span>
            </li>
            <li>
              <span className={styles.navLink}>
                <CreditCard size={17} /> Mes moyens de paiement
              </span>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

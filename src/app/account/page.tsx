import type { Metadata } from "next";
import Link from "next/link";
import { mockOrders } from "@/data/orders";
import { getCustomer } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/format";
import { Package, Heart, ChevronRight, TrendingUp, Clock, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false, follow: false } };

const STATUS_COLORS: Record<string, string> = {
  Livrée: "#16a34a",
  Expédiée: "#7c3aed",
  "En préparation": "#ca8a04",
  Annulée: "#dc2626",
};

export default async function AccountDashboard() {
  const customer = await getCustomer();
  const firstName = customer?.firstName ?? "vous";

  const lastOrder = mockOrders[0];
  const totalSpent = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = mockOrders.filter(o => o.status === "Livrée").length;

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Bienvenue, <strong>{firstName}</strong> 👋</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Package size={20} className={styles.statIcon} style={{color: "#6366f1"}} />
          <div>
            <p className={styles.statValue}>{mockOrders.length}</p>
            <p className={styles.statLabel}>Commandes</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={20} className={styles.statIcon} style={{color: "#10b981"}} />
          <div>
            <p className={styles.statValue}>{formatPrice(totalSpent)}</p>
            <p className={styles.statLabel}>Total dépensé</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={20} className={styles.statIcon} style={{color: "#16a34a"}} />
          <div>
            <p className={styles.statValue}>{deliveredCount}</p>
            <p className={styles.statLabel}>Livrées</p>
          </div>
        </div>
      </div>

      {/* Dernière commande */}
      {lastOrder && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock size={16} /> Dernière commande
            </h2>
            <Link href="/account/orders" className={styles.seeAll}>Tout voir <ChevronRight size={14} /></Link>
          </div>
          <div className={styles.orderCard}>
            <div className={styles.orderRow}>
              <span className={styles.orderId}>{lastOrder.id}</span>
              <span className={styles.orderStatus} style={{color: STATUS_COLORS[lastOrder.status]}}>
                {lastOrder.status}
              </span>
            </div>
            <p className={styles.orderDate}>Commandée le {lastOrder.date}</p>
            <div className={styles.orderFooter}>
              <span className={styles.orderTotal}>{formatPrice(lastOrder.total)}</span>
              <Link href="/account/orders" className={styles.orderBtn}>Voir le détail</Link>
            </div>
          </div>
        </div>
      )}

      {/* Raccourcis */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}><Heart size={16} /> Accès rapide</h2>
        <div className={styles.shortcuts}>
          <Link href="/account/orders" className={styles.shortcut}>
            <Package size={22} />
            <span>Mes commandes</span>
            <ChevronRight size={14} className={styles.shortcutArrow} />
          </Link>
          <Link href="/account/wishlist" className={styles.shortcut}>
            <Heart size={22} />
            <span>Mes favoris</span>
            <ChevronRight size={14} className={styles.shortcutArrow} />
          </Link>
          <Link href="/account/profile" className={styles.shortcut}>
            <span style={{fontSize: 22}}>⚙️</span>
            <span>Mes informations</span>
            <ChevronRight size={14} className={styles.shortcutArrow} />
          </Link>
        </div>
      </div>
    </div>
  );
}

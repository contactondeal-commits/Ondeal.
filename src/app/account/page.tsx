import type { Metadata } from "next";
import Link from "next/link";
import { getCustomer, getCustomerOrders } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/format";
import { Package, Heart, ChevronRight, TrendingUp, Clock, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false, follow: false } };

const STATUS_COLORS: Record<string, string> = {
  FULFILLED: "#16a34a",
  PARTIAL: "#7c3aed",
  UNFULFILLED: "#ca8a04",
  RESTOCKED: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  FULFILLED: "Livrée",
  PARTIAL: "Partiellement expédiée",
  UNFULFILLED: "En préparation",
  RESTOCKED: "Annulée",
};

export default async function AccountDashboard() {
  const [customer, orders] = await Promise.all([getCustomer(), getCustomerOrders()]);
  const firstName = customer?.firstName ?? "vous";

  const lastOrder = orders[0];
  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.currentTotalPrice.amount), 0);
  const deliveredCount = orders.filter(o => o.fulfillmentStatus === "FULFILLED").length;

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h1 className={styles.title}>Tableau de bord</h1>
        <p className={styles.subtitle}>Bienvenue, <strong>{firstName}</strong> 👋</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Package size={20} className={styles.statIcon} style={{ color: "#6366f1" }} />
          <div>
            <p className={styles.statValue}>{orders.length}</p>
            <p className={styles.statLabel}>Commandes</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={20} className={styles.statIcon} style={{ color: "#10b981" }} />
          <div>
            <p className={styles.statValue}>{formatPrice(totalSpent)}</p>
            <p className={styles.statLabel}>Total dépensé</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <CheckCircle size={20} className={styles.statIcon} style={{ color: "#16a34a" }} />
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
            <Link href="/account/orders" className={styles.seeAll}>
              Tout voir <ChevronRight size={14} />
            </Link>
          </div>
          <div className={styles.orderCard}>
            <div className={styles.orderRow}>
              <span className={styles.orderId}>#{lastOrder.orderNumber}</span>
              <span
                className={styles.orderStatus}
                style={{ color: STATUS_COLORS[lastOrder.fulfillmentStatus ?? "UNFULFILLED"] }}
              >
                {STATUS_LABELS[lastOrder.fulfillmentStatus ?? "UNFULFILLED"]}
              </span>
            </div>
            <p className={styles.orderDate}>
              Commandée le {new Date(lastOrder.processedAt).toLocaleDateString("fr-FR")}
            </p>
            <div className={styles.orderFooter}>
              <span className={styles.orderTotal}>
                {formatPrice(parseFloat(lastOrder.currentTotalPrice.amount))}
              </span>
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
            <span>Ma wishlist</span>
            <ChevronRight size={14} className={styles.shortcutArrow} />
          </Link>
        </div>
      </div>
    </div>
  );
}

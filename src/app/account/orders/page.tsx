import type { Metadata } from "next";
import Link from "next/link";
import { mockOrders } from "@/data/orders";
import { products } from "@/data/products";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatPrice } from "@/lib/format";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mes commandes", robots: { index: false, follow: false } };

const STATUS_STYLES: Record<string, string> = {
  Livrée: styles.statusDelivered,
  Expédiée: styles.statusShipped,
  "En préparation": styles.statusPreparing,
  Annulée: styles.statusCancelled,
};

const STATUS_ICONS: Record<string, string> = {
  Livrée: "✓",
  Expédiée: "🚚",
  "En préparation": "⏳",
  Annulée: "✕",
};

export default function OrdersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Package size={22} strokeWidth={1.8} />
        <h1 className={styles.pageTitle}>Mes commandes</h1>
      </div>

      {mockOrders.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={48} strokeWidth={1.2} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Aucune commande pour le moment</p>
          <p className={styles.emptyText}>Vous n&apos;avez pas encore passé de commande.</p>
          <Link href="/catalogue" className={styles.emptyBtn}>Découvrir nos produits</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {mockOrders.map((order) => (
            <div key={order.id} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <p className={styles.orderId}>{order.id}</p>
                  <p className={styles.date}>Commandée le {order.date}</p>
                </div>
                <span className={`${styles.status} ${STATUS_STYLES[order.status]}`}>
                  <span>{STATUS_ICONS[order.status]}</span>
                  {order.status}
                </span>
              </div>

              <div className={styles.items}>
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <Link key={item.productId} href={`/product/${product.slug}`} className={styles.item}>
                      <div className={styles.itemImage}>
                      <PlaceholderImage seed={product.images[0]} label={product.title} sizes="56px" />
                    </div>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemTitle}>{product.title}</p>
                        <p className={styles.itemQty}>Qté : {item.quantity}</p>
                      </div>
                      <ChevronRight size={16} className={styles.itemArrow} />
                    </Link>
                  );
                })}
              </div>

              <div className={styles.footer}>
                <span className={styles.footerLabel}>Total de la commande</span>
                <span className={styles.total}>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

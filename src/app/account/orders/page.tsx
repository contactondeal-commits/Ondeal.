import type { Metadata } from "next";
import Link from "next/link";
import { getCustomerOrders } from "@/lib/shopify/customer";
import { formatPrice } from "@/lib/format";
import { Package, ChevronRight } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mes commandes", robots: { index: false, follow: false } };

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

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <Package size={20} style={{ color: "#6366f1" }} />
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Mes commandes</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#6b7280" }}>
          <Package size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <p>Vous n&apos;avez pas encore de commandes.</p>
          <Link href="/" style={{ color: "#6366f1", fontWeight: 600, marginTop: "1rem", display: "inline-block" }}>
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              background: "#fff",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 700, color: "#111" }}>#{order.orderNumber}</span>
                <span style={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: STATUS_COLORS[order.fulfillmentStatus ?? "UNFULFILLED"],
                }}>
                  {STATUS_LABELS[order.fulfillmentStatus ?? "UNFULFILLED"]}
                </span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                {new Date(order.processedAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
              <div style={{ fontSize: "0.875rem", color: "#374151", marginBottom: "0.75rem" }}>
                {order.lineItems.slice(0, 3).map((item, i) => (
                  <span key={i}>{item.quantity}× {item.title}{i < Math.min(order.lineItems.length, 3) - 1 ? ", " : ""}</span>
                ))}
                {order.lineItems.length > 3 && <span style={{ color: "#9ca3af" }}> +{order.lineItems.length - 3} article(s)</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "#111" }}>
                  {formatPrice(parseFloat(order.currentTotalPrice.amount))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

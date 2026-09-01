"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Package, ShoppingCart, Menu } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import LanguageSwitcher from "./LanguageSwitcher";
import TrustBadge from "@/components/ui/TrustBadge";
import { useCart } from "@/hooks/useCart";
import { SITE_NAME, SHOPIFY_ACCOUNT_URL } from "@/lib/site-config";
import styles from "./Header.module.css";

interface HeaderProps {
  onOpenCategoryMenu: () => void;
}

export default function Header({ onOpenCategoryMenu }: HeaderProps) {
  const { count } = useCart();

  return (
    <header className={styles.header} style={{ position: "relative" }}>
      <div className={`${styles.inner} container`}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          aria-label="Ouvrir le menu des catégories"
          onClick={onOpenCategoryMenu}
        >
          <Menu size={24} />
        </button>

        <Link href="/" className={styles.logoChip} aria-label={`${SITE_NAME} — Retour à l'accueil`}>
          <Image
            src="/brand/ondeal-logo.png"
            alt={SITE_NAME}
            width={1524}
            height={511}
            fetchPriority="high"
            loading="eager"
            className={styles.logoImg}
          />
        </Link>

        <SearchBar className={styles.searchBar} />

        <nav className={styles.actions} aria-label="Compte et panier">
          <LanguageSwitcher />
          <a href={SHOPIFY_ACCOUNT_URL} className={styles.actionBtn} aria-label="Mon compte">
            <User size={20} />
            <span className={styles.actionText}>
              <small>Bonjour</small>
              <span>Compte</span>
            </span>
          </a>
          <a href={SHOPIFY_ACCOUNT_URL} className={styles.actionBtn} aria-label="Mes commandes">
            <Package size={20} />
            <span className={styles.actionText}>
              <small>Vos</small>
              <span>Commandes</span>
            </span>
          </a>
          <Link href="/cart" className={styles.cartBtn} aria-label={`Panier, ${count} article(s)`}>
            <span className={styles.cartIconWrap}>
              <ShoppingCart size={22} />
              {count > 0 && <span className={styles.cartCount}>{count > 99 ? "99+" : count}</span>}
            </span>
            <span className={styles.actionText}>
              <span>Panier</span>
            </span>
          </Link>
        </nav>
      </div>

      <div className={styles.mobileSearchRow}>
        <SearchBar />
      </div>

      <div className={styles.trustBar}>
        <TrustBadge rating={4.61} reviewsCount={259} />
      </div>
    </header>
  );
}

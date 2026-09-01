"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, User, Package, HelpCircle, Settings } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { categories } from "@/data/categories";
import { getIcon } from "@/lib/icon-map";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/site-config";
import type { Category } from "@/types";
import styles from "./CategoryMenu.module.css";

interface CategoryMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Menu latéral catégories — navigation multi-niveaux avec retour au niveau précédent.
 */
export default function CategoryMenu({ open, onClose }: CategoryMenuProps) {
  const [stack, setStack] = useState<Category[]>([]);
  const current = stack[stack.length - 1];
  const list = current ? current.children : categories;

  function handleClose() {
    onClose();
    // Réinitialise après la fermeture pour repartir du niveau racine la prochaine fois
    setTimeout(() => setStack([]), 300);
  }

  return (
    <Drawer open={open} onClose={handleClose} side="left" title={current ? current.name : "Toutes les catégories"}>
      <div className={styles.root}>
        {!current && (
          <a href={SHOPIFY_ACCOUNT_URL} className={styles.accountBanner} onClick={handleClose}>
            <User size={18} />
            <span>Bonjour, connectez-vous</span>
          </a>
        )}

        {current && (
          <button className={styles.backRow} onClick={() => setStack((s) => s.slice(0, -1))}>
            <ChevronLeft size={16} /> Toutes les catégories
          </button>
        )}

        {/*
          Mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE" (20/08/2026) — demande
          client explicite : "Catalogue" (page /catalogue, tous les produits
          actifs + rayons) ajoutée au menu "Toutes les catégories". Entrée
          manuelle (pas une vraie catégorie Shopify par tag, contrairement au
          reste de la liste ci-dessous) car elle pointe vers la page dédiée
          /catalogue, pas vers /category/<slug>. "Rentrée scolaire" n'a pas
          besoin d'une entrée manuelle équivalente : c'est désormais une vraie
          catégorie de src/data/categories.ts (voir ce fichier), donc déjà
          incluse automatiquement dans `categories` ci-dessous.
        */}
        {!current && (
          <ul className={styles.list}>
            <li>
              <Link href="/catalogue" className={styles.row} onClick={handleClose}>
                <span className={styles.rowLeft}>
                  <LayoutGrid size={18} /> Voir le catalogue
                </span>
              </Link>
            </li>
          </ul>
        )}

        <p className={styles.sectionLabel}>{current ? "Sous-catégories" : "Catégories principales"}</p>
        <ul className={styles.list}>
          {list.map((cat) => {
            const Icon = getIcon(cat.icon);
            const hasChildren = cat.children.length > 0;
            return (
              <li key={cat.id}>
                {hasChildren ? (
                  <button className={styles.row} onClick={() => setStack((s) => [...s, cat])}>
                    <span className={styles.rowLeft}>
                      <Icon size={18} />
                      {cat.name}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <Link href={`/category/${cat.slug}`} className={styles.row} onClick={handleClose}>
                    <span className={styles.rowLeft}>
                      <Icon size={18} />
                      {cat.name}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {!current && (
          <>
            <hr className={styles.divider} />
            <p className={styles.sectionLabel}>Aide et paramètres</p>
            <ul className={styles.list}>
              {/*
                Mission "CONNEXION CLIENT" (15/08/2026) — voir SHOPIFY_ACCOUNT_URL
                dans site-config.ts : ces trois entrées pointent désormais
                vers le portail natif Shopify plutôt que vers /account, /login
                (comptes clients réels incompatibles avec l'ancien système à
                mot de passe personnalisé).
              */}
              <li>
                <a href={SHOPIFY_ACCOUNT_URL} className={styles.row} onClick={handleClose}>
                  <span className={styles.rowLeft}>
                    <User size={18} /> Votre compte
                  </span>
                </a>
              </li>
              <li>
                <a href={SHOPIFY_ACCOUNT_URL} className={styles.row} onClick={handleClose}>
                  <span className={styles.rowLeft}>
                    <Package size={18} /> Vos commandes
                  </span>
                </a>
              </li>
              <li>
                <Link href="/help" className={styles.row} onClick={handleClose}>
                  <span className={styles.rowLeft}>
                    <HelpCircle size={18} /> Aide
                  </span>
                </Link>
              </li>
              <li>
                <a href={SHOPIFY_ACCOUNT_URL} className={styles.row} onClick={handleClose}>
                  <span className={styles.rowLeft}>
                    <Settings size={18} /> Paramètres
                  </span>
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </Drawer>
  );
}

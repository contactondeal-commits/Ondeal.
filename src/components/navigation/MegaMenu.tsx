"use client";

import Link from "next/link";
import Drawer from "@/components/ui/Drawer";
import type { Category } from "@/types";
import styles from "./MegaMenu.module.css";

interface MegaMenuProps {
  category: Category;
  onClose: () => void;
}

/**
 * Panneau mega-menu — affiché au hover (desktop, via MainNav) ou dans un
 * Drawer plein écran sur mobile (voir usage dans MainNav).
 */
export function MegaMenuPanel({ category, onClose }: MegaMenuProps) {
  return (
    <div className={styles.panel} onMouseLeave={onClose}>
      <div className={`${styles.columns} container`}>
        {category.children.map((child) => (
          <div key={child.id} className={styles.column}>
            <Link href={`/category/${child.slug}`} className={styles.columnTitle} onClick={onClose}>
              {child.name}
            </Link>
            <ul>
              {(child.children.length > 0 ? child.children : [child]).map((grand) => (
                <li key={grand.id}>
                  <Link href={`/category/${grand.slug}`} onClick={onClose}>
                    {grand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className={styles.column}>
          <p className={styles.columnTitle}>Découvrir</p>
          <ul>
            <li>
              <Link href={`/category/${category.slug}?sort=bestselling`} onClick={onClose}>
                Meilleures ventes
              </Link>
            </li>
            <li>
              <Link href={`/category/${category.slug}?sort=newest`} onClick={onClose}>
                Nouveautés
              </Link>
            </li>
            <li>
              <Link href={`/category/${category.slug}`} onClick={onClose}>
                Promotions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MegaMenuMobile({ category, open, onClose }: { category: Category; open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title={category.name}>
      <div className={styles.mobileColumns}>
        {category.children.map((child) => (
          <div key={child.id} className={styles.mobileColumn}>
            <Link href={`/category/${child.slug}`} className={styles.columnTitle} onClick={onClose}>
              {child.name}
            </Link>
            <ul>
              {(child.children.length > 0 ? child.children : [child]).map((grand) => (
                <li key={grand.id}>
                  <Link href={`/category/${grand.slug}`} onClick={onClose}>
                    {grand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

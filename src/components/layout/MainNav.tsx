"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { categories, megaMenuCategoryIds } from "@/data/categories";
import { MegaMenuPanel, MegaMenuMobile } from "@/components/navigation/MegaMenu";
import DeliveryLocation from "./DeliveryLocation";
import type { Category } from "@/types";
import styles from "./MainNav.module.css";

interface MainNavProps {
  onOpenCategoryMenu: () => void;
}

const STATIC_LINKS = [
  { label: "Meilleures ventes", href: "/search?q=&sort=bestselling" },
  { label: "Nouveautés", href: "/search?q=&sort=newest" },
  { label: "Offres", href: "/search?q=&sort=price_asc" },
  { label: "Idées cadeaux", href: "/category/jeux-et-jouets" },
  { label: "Services", href: "/help" },
  { label: "Vendre", href: "/help" },
  { label: "Aide", href: "/help" },
];

export default function MainNav({ onOpenCategoryMenu }: MainNavProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileMega, setMobileMega] = useState<string | null>(null);
  const [lastMegaCategory, setLastMegaCategory] = useState<Category | null>(null);
  const megaCategories = categories.filter((c) => megaMenuCategoryIds.includes(c.id));
  const activeMega = megaCategories.find((c) => c.id === hovered);

  return (
    <nav className={styles.nav} aria-label="Navigation principale" onMouseLeave={() => setHovered(null)}>
      <div className={`${styles.inner} container`}>
        <button type="button" className={styles.allCategoriesBtn} onClick={onOpenCategoryMenu}>
          <Menu size={16} />
          Toutes les catégories
        </button>

        <ul className={styles.links}>
          {megaCategories.map((cat) => (
            <li
              key={cat.id}
              onMouseEnter={() => setHovered(cat.id)}
              className={styles.megaTrigger}
            >
              <Link
                href={`/category/${cat.slug}`}
                className={styles.link}
                aria-haspopup="true"
                aria-expanded={hovered === cat.id}
                onClick={(e) => {
                  if (window.matchMedia("(max-width: 767px)").matches) {
                    e.preventDefault();
                    setLastMegaCategory(cat);
                    setMobileMega(cat.id);
                  }
                }}
              >
                {cat.name}
              </Link>
            </li>
          ))}
          {STATIC_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
          <li><DeliveryLocation /></li>
        </ul>
      </div>

      {activeMega && <MegaMenuPanel category={activeMega} onClose={() => setHovered(null)} />}
      {lastMegaCategory && (
        <MegaMenuMobile category={lastMegaCategory} open={!!mobileMega} onClose={() => setMobileMega(null)} />
      )}
    </nav>
  );
}

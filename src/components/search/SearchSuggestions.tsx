import Link from "next/link";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { SearchSuggestion } from "@/types";
import { formatPrice } from "@/lib/format";
import styles from "./SearchSuggestions.module.css";

interface SearchSuggestionsProps {
  query: string;
  suggestions: SearchSuggestion | null;
  loading: boolean;
  history: string[];
  onSelect: (query: string) => void;
  onClearHistory: () => void;
}

export default function SearchSuggestions({ query, suggestions, loading, history, onSelect, onClearHistory }: SearchSuggestionsProps) {
  const showHistory = !query && history.length > 0;

  return (
    <div className={styles.panel} role="listbox" aria-label="Suggestions de recherche">
      {loading && <p className={styles.status}>Recherche en cours…</p>}

      {!loading && showHistory && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Historique de recherche</span>
            <button type="button" onClick={onClearHistory} className={styles.clearBtn}>
              Effacer
            </button>
          </div>
          <ul>
            {history.map((h) => (
              <li key={h}>
                <button type="button" className={styles.textRow} onClick={() => onSelect(h)}>
                  <Clock size={14} /> {h}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && suggestions && query && (
        <>
          {suggestions.products.length === 0 && suggestions.categories.length === 0 && suggestions.popularSearches.length === 0 && (
            <p className={styles.status}>Aucun résultat pour « {query} »</p>
          )}

          {suggestions.products.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Produits</p>
              <ul>
                {suggestions.products.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} className={styles.productRow}>
                      <PlaceholderImage seed={p.images[0]} className={styles.productThumb} rounded />
                      <span className={styles.productTitle}>{p.title}</span>
                      <span className={styles.productPrice}>{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.categories.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Catégories</p>
              <ul>
                {suggestions.categories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/category/${c.slug}`} className={styles.textRow}>
                      <Search size={14} /> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.popularSearches.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Recherches populaires</p>
              <ul>
                {suggestions.popularSearches.map((s) => (
                  <li key={s}>
                    <button type="button" className={styles.textRow} onClick={() => onSelect(s)}>
                      <TrendingUp size={14} /> {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { X as CloseIcon };

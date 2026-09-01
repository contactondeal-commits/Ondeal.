"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";
import SearchSuggestions from "./SearchSuggestions";
import { categories } from "@/data/categories";
import { searchSuggestions } from "@/services/searchService";
import { useSearchHistoryStore } from "@/store/searchHistoryStore";
import { fireGoogleAdsConversion } from "@/lib/analytics/googleAds";
import type { SearchSuggestion } from "@/types";
import styles from "./SearchBar.module.css";

const categoryOptions = [
  { value: "all", label: "Toutes les catégories" },
  ...categories.map((c) => ({ value: c.slug, label: c.name })),
];

export default function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const history = useSearchHistoryStore((s) => s.history);
  const addSearch = useSearchHistoryStore((s) => s.addSearch);
  const clearHistory = useSearchHistoryStore((s) => s.clearHistory);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!open) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    debounceRef.current = setTimeout(async () => {
      const result = await searchSuggestions(query);
      if (cancelled) return;
      setSuggestions(result);
      setLoading(false);
    }, 180);
    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addSearch(trimmed);
    setOpen(false);
    fireGoogleAdsConversion("search");
    const params = new URLSearchParams({ q: trimmed });
    if (category !== "all") params.set("category", category);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} ref={rootRef}>
      <Dropdown
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        ariaLabel="Choisir une catégorie de recherche"
        className={styles.categoryDropdown}
      />
      <div className={styles.inputWrap}>
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          className={styles.input}
          placeholder="Rechercher des produits…"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch(query);
            if (e.key === "Escape") setOpen(false);
          }}
        />
        {query && (
          <button type="button" className={styles.clearInput} aria-label="Effacer la recherche" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
      </div>
      <button type="button" className={styles.searchBtn} aria-label="Lancer la recherche" onClick={() => runSearch(query)}>
        <Search size={18} />
      </button>

      {open && (
        <div id="search-suggestions">
          <SearchSuggestions
            query={query}
            suggestions={suggestions}
            loading={loading}
            history={history}
            onSelect={(q) => {
              setQuery(q);
              runSearch(q);
            }}
            onClearHistory={clearHistory}
          />
        </div>
      )}
    </div>
  );
}

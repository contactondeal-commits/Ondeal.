"use client";

import Dropdown from "@/components/ui/Dropdown";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Pertinence" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "bestselling", label: "Meilleures ventes" },
  { value: "rating", label: "Meilleures notes" },
  { value: "newest", label: "Nouveautés" },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Dropdown
      options={SORT_OPTIONS}
      value={value}
      onChange={(v) => onChange(v as SortOption)}
      ariaLabel="Trier les produits"
    />
  );
}

export { SORT_OPTIONS };

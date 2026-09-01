"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import FilterSidebar from "./FilterSidebar";
import type { FilterState } from "@/types";
import styles from "./FilterMobile.module.css";

interface FilterMobileProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function FilterMobile({ filters, onChange, resultCount }: FilterMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={styles.triggerBtn} onClick={() => setOpen(true)}>
        <SlidersHorizontal size={16} /> Filtres
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Filtres">
        <div className={styles.body}>
          <FilterSidebar filters={filters} onChange={onChange} />
        </div>
        <div className={styles.footer}>
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Voir {resultCount} résultats
          </Button>
        </div>
      </Drawer>
    </>
  );
}

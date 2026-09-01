"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { HelpItem } from "./help-data";
import styles from "./HelpAccordion.module.css";

export default function HelpAccordion({ items, sectionId }: { items: HelpItem[]; sectionId: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${sectionId}-${item.id}-panel`;
        const buttonId = `${sectionId}-${item.id}-button`;
        return (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} className={isOpen ? styles.iconOpen : styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
